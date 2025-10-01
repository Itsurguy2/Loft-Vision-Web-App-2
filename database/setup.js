// Database Setup Script
// Run this to create tables and seed data
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    // Connect to PostgreSQL (first to postgres database to create our database)
    const adminPool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: 'postgres', // Connect to default postgres database
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });

    try {
        console.log('🔧 Setting up LoftVision database...\n');

        // Create database if it doesn't exist
        console.log('1️⃣  Creating database...');
        await adminPool.query(`
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${process.env.DB_NAME}'
            AND pid <> pg_backend_pid();
        `);
        
        await adminPool.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
        await adminPool.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        console.log(`✅ Database '${process.env.DB_NAME}' created\n`);

        await adminPool.end();

        // Connect to the new database
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        // Run schema.sql
        console.log('2️⃣  Creating tables...');
        const schemaSQL = fs.readFileSync(
            path.join(__dirname, 'schema.sql'),
            'utf8'
        );
        await pool.query(schemaSQL);
        console.log('✅ Tables created\n');

        // Run seed.sql
        console.log('3️⃣  Seeding data...');
        const seedSQL = fs.readFileSync(
            path.join(__dirname, 'seed.sql'),
            'utf8'
        );
        await pool.query(seedSQL);
        console.log('✅ Data seeded\n');

        // Verify data
        const result = await pool.query('SELECT COUNT(*) FROM designs');
        console.log(`📊 Total designs in database: ${result.rows[0].count}\n`);

        // Show sample data
        const designs = await pool.query('SELECT id, title, style FROM designs LIMIT 5');
        console.log('📋 Sample designs:');
        designs.rows.forEach(d => {
            console.log(`   - ${d.id}: ${d.title} (${d.style})`);
        });

        await pool.end();
        console.log('\n🎉 Database setup complete!');
        console.log('👉 Run "npm run dev" to start the server\n');

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1);
    }
}

// Run setup
setupDatabase();