require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'codelearn',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
});

async function initDatabase() {
    const client = await pool.connect();
    
    try {
        console.log('🚀 Initializing database...\n');
        
        // Read and execute schema
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📋 Creating tables...');
        await client.query(schema);
        console.log('✅ Tables created successfully!\n');
        
        // Read and execute seed data
        const seedPath = path.join(__dirname, 'seed.sql');
        const seed = fs.readFileSync(seedPath, 'utf8');
        
        console.log('🌱 Seeding data...');
        await client.query(seed);
        console.log('✅ Data seeded successfully!\n');
        
        console.log('🎉 Database initialization complete!');
        
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

initDatabase().catch(console.error);
