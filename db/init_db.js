const fs = require('fs');
const { Pool, Client } = require('pg');
require('dotenv').config();

const INIT_SQL_PATH = './db/init.sql';
const rawSql = fs.readFileSync(INIT_SQL_PATH, 'utf8');

function parseDatabaseName(databaseUrl) {
  try {
    const u = new URL(databaseUrl);
    return u.pathname.replace(/^\//, '') || null;
  } catch {
    return null;
  }
}

function setDatabaseInUrl(databaseUrl, dbName) {
  try {
    const u = new URL(databaseUrl);
    u.pathname = '/' + dbName;
    return u.toString();
  } catch {
    return databaseUrl;
  }
}

async function main() {
  const envUrl = process.env.DATABASE_URL || 'postgres://localhost/loftvision';
  const targetDb = parseDatabaseName(envUrl) || 'loftvision';
  const adminUrl = setDatabaseInUrl(envUrl, 'postgres');
  const adminClient = new Client({ connectionString: adminUrl });
  try {
    await adminClient.connect();
    const check = await adminClient.query('SELECT 1 FROM pg_database WHERE datname=$1', [targetDb]);
    if (check.rowCount === 0) {
      console.log(`Database "${targetDb}" not found — creating...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Created database "${targetDb}".`);
    } else {
      console.log(`Database "${targetDb}" already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  const targetUrl = setDatabaseInUrl(envUrl, targetDb);
  const pool = new Pool({ connectionString: targetUrl });
  try {
    console.log(`Running SQL from ${INIT_SQL_PATH}...`);
    await pool.query(rawSql);
    console.log('DB init SQL executed successfully.');
  } catch (err) {
    console.error('Error running init SQL:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(err=>{
  console.error(err);
  process.exit(1);
});