// Database Debug Script
// Run this to test your database connection
const { Pool } = require('pg');
require('dotenv').config();

console.log('🔍 Testing database connection...\n');

// Show configuration (without password)
console.log('📋 Database Configuration:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Port: ${process.env.DB_PORT}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? '***set***' : '❌ NOT SET'}\n`);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

async function testConnection() {
    try {
        // Test 1: Basic connection
        console.log('Test 1: Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connection successful!\n');

        // Test 2: Check if designs table exists
        console.log('Test 2: Checking if designs table exists...');
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'designs'
            );
        `);
        
        if (tableCheck.rows[0].exists) {
            console.log('✅ Designs table exists!\n');
        } else {
            console.log('❌ Designs table does NOT exist!');
            console.log('   Run: npm run setup:db\n');
            client.release();
            process.exit(1);
        }

        // Test 3: Count designs
        console.log('Test 3: Counting designs in database...');
        const countResult = await client.query('SELECT COUNT(*) FROM designs');
        const count = countResult.rows[0].count;
        console.log(`✅ Found ${count} designs in database\n`);

        if (count === 0) {
            console.log('⚠️  No designs found. Run: npm run setup:db\n');
        }

        // Test 4: Fetch sample design
        console.log('Test 4: Fetching first design...');
        const designResult = await client.query('SELECT id, title, style FROM designs LIMIT 1');
        
        if (designResult.rows.length > 0) {
            const design = designResult.rows[0];
            console.log('✅ Sample design:');
            console.log(`   ID: ${design.id}`);
            console.log(`   Title: ${design.title}`);
            console.log(`   Style: ${design.style}\n`);
        }

        client.release();
        
        console.log('🎉 All tests passed!');
        console.log('👉 Your database is ready. Start server with: npm run dev\n');
        
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   - PostgreSQL is not running. Start PostgreSQL service.');
            console.error('   - Check if port 5432 is correct in .env');
        } else if (error.code === '28P01') {
            console.error('   - Wrong username or password in .env');
        } else if (error.code === '3D000') {
            console.error('   - Database does not exist. Run: npm run setup:db');
        } else {
            console.error('   - Check your .env file configuration');
        }
        
        console.error('\n');
        process.exit(1);
    }
}

testConnection();