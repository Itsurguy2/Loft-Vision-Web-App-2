const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const axios = require('axios');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/loftvision'
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// simple in-memory cache for Pexels lookups
const imageCache = new Map();

// Replace existing fetchPexelsImage / ensureImageUrl with a single provider-aware helper
async function fetchFromPexels(query) {
  const url = process.env.PEXELS_API_URL || 'https://api.pexels.com/v1/search';
  try {
    const res = await axios.get(url, {
      params: { query, per_page: 1 },
      headers: { Authorization: process.env.PEXELS_API_KEY }
    });
    const photo = res.data && (res.data.photos || res.data.results) && (res.data.photos || res.data.results)[0];
    return photo ? (photo.src && (photo.src.large2x || photo.src.large || photo.src.original) || photo.image_url || photo.url) : null;
  } catch (err) {
    console.error('Pexels error:', err.response?.status, err.message);
    return null;
  }
}

async function fetchFromDecor8(query) {
  const url = process.env.DECOR8_API_URL;
  if (!url) return null;
  try {
    const res = await axios.get(url, {
      params: { q: query, limit: 1 },
      headers: { Authorization: `Bearer ${process.env.DECOR8_API_KEY}` }
    });
    const photo = res.data && (res.data.results || res.data.photos) && (res.data.results || res.data.photos)[0];
    return photo ? (photo.image_url || photo.url || (photo.src && photo.src.large)) : null;
  } catch (err) {
    console.error('decor8.ai error:', err.response?.status, err.message);
    return null;
  }
}

async function fetchImageForQuery(query) {
  if (!query) return null;
  const key = query.toLowerCase();
  if (imageCache.has(key)) return imageCache.get(key);

  // prefer decor8 if configured, else pexels if configured
  let url = null;
  if (process.env.DECOR8_API_KEY && process.env.DECOR8_API_URL) {
    url = await fetchFromDecor8(query);
  }
  if (!url && process.env.PEXELS_API_KEY) {
    url = await fetchFromPexels(query);
  }

  imageCache.set(key, url);
  return url;
}

// helper to ensure image_url present (falls back to picsum seed)
async function ensureImageUrl(item) {
  if (item.image_url) return item.image_url;
  const q = item.title || item.summary || item.slug || item.collection;
  const fetched = await fetchImageForQuery(q);
  if (fetched) return fetched;
  const seed = encodeURIComponent(item.slug || item.title || q || 'loft');
  return `https://picsum.photos/seed/${seed}/800/600`;
}
// API: list all items
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items ORDER BY id');
    // fill image_url when missing (concurrent)
    const filled = await Promise.all(rows.map(async r => {
      r.image_url = await ensureImageUrl(r);
      return r;
    }));
    res.json(filled);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// API: item by collection & slug
app.get('/api/:collection/:slug', async (req, res) => {
  const { collection, slug } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM items WHERE collection = $1 AND slug = $2 LIMIT 1',
      [collection, slug]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    const item = rows[0];
    item.image_url = await ensureImageUrl(item);
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// For API unknown routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// All other GETs -> index.html (History API friendly)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});