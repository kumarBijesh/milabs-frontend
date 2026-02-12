// Simple script to test Prisma connection and initialize database
const { execSync } = require('child_process');
require('dotenv').config();

console.log('🔍 Checking DATABASE_URL...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Not found');

if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
}

try {
    console.log('\n📤 Pushing schema to database...');
    execSync('npx prisma db push --accept-data-loss', {
        stdio: 'inherit',
        env: { ...process.env }
    });

    console.log('\n✅ Database schema created successfully!');
    console.log('\n🌱 Seeding database...');

    execSync('npx prisma db seed', {
        stdio: 'inherit',
        env: { ...process.env }
    });

    console.log('\n🎉 Database setup complete!');
} catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
}
