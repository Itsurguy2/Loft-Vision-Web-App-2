async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: res.statusText }));
    const e = new Error(err.error || res.statusText);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

async function renderList() {
  const container = document.getElementById('content');
  container.innerHTML = '<p>Loading...</p>';
  try {
    const items = await fetchJSON('/api/items');
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'card-grid';
    items.forEach(it => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${it.image_url}" alt="${escapeHtml(it.title)}">
        <div class="card-body">
          <div class="meta">${escapeHtml(it.collection)}</div>
          <div class="title">${escapeHtml(it.title)}</div>
          <div class="summary">${escapeHtml(it.summary || '')}</div>
          <div class="actions">
            <a href="/${encodeURIComponent(it.collection)}/${encodeURIComponent(it.slug)}" data-link class="contrast">View</a>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  } catch (err) {
    container.innerHTML = `<p>Error loading items: ${escapeHtml(err.message)}</p>`;
  }
}

async function renderDetail(collection, slug) {
  const container = document.getElementById('content');
  container.innerHTML = '<p>Loading item...</p>';
  try {
    const it = await fetchJSON(`/api/${encodeURIComponent(collection)}/${encodeURIComponent(slug)}`);
    container.innerHTML = `
      <article class="detail">
        <div>
          <img src="${it.image_url}" alt="${escapeHtml(it.title)}" style="width:100%;height:auto;max-height:480px;object-fit:cover;border-radius:8px">
        </div>
        <div>
          <h2>${escapeHtml(it.title)}</h2>
          <p class="meta">${escapeHtml(it.collection)}</p>
          <p>${escapeHtml(it.description || it.summary || '')}</p>
          <h4>Attributes</h4>
          <ul id="attrs"></ul>
          <p><a href="/" data-link>Back</a></p>
        </div>
      </article>
    `;
    const attrs = document.getElementById('attrs');
    const attributes = it.attributes || {};
    Object.entries(attributes).forEach(([k, v]) => {
      const li = document.createElement('li');
      li.textContent = `${k}: ${v}`;
      attrs.appendChild(li);
    });
  } catch (err) {
    if (err.status === 404) {
      render404();
    } else {
      container.innerHTML = `<p>Error: ${escapeHtml(err.message)}</p>`;
    }
  }
}

function render404() {
  const container = document.getElementById('content');
  container.innerHTML = `<h2>404 — Page not found</h2><p>The requested page could not be located.</p><p><a href="/" data-link>Return home</a></p>`;
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'", '&#39;');
}

// initial route handler must be defined in router.js
if (typeof handleRoute === 'function') {
  handleRoute();
} else {
  console.warn('handleRoute is not defined. Ensure public/js/router.js is loaded before this file.');
}