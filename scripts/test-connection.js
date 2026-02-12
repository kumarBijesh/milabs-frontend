const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
    try {
        console.log('🔍 Testing database connection...');
        console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

        // Try to connect
        await prisma.$connect();
        console.log('✅ Successfully connected to PostgreSQL!');

        // Try to execute a simple query
        const result = await prisma.$queryRaw`SELECT version()`;
        console.log('✅ PostgreSQL version:', result);

        // Try to create the milabs database if we're connected to postgres
        if (process.env.DATABASE_URL?.includes('/postgres?')) {
            console.log('\n📦 Creating milabs database...');
            try {
                await prisma.$executeRawUnsafe(`CREATE DATABASE milabs`);
                console.log('✅ Database milabs created!');
            } catch (error) {
                if (error.message.includes('already exists')) {
                    console.log('ℹ️  Database milabs already exists');
                } else {
                    throw error;
                }
            }
        }

        await prisma.$disconnect();
        console.log('\n🎉 Connection test successful!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    }
}

require('dotenv').config();
testConnection();
