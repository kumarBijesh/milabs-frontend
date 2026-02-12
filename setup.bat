@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo       MiLabs Project Setup (MongoDB)
echo ==========================================

echo [1/3] Generating Prisma Client...
call npx prisma generate

echo [2/3] Syncing Database Schema...
echo (Note: MongoDB is schema-less, but this validates the schema with the db)
call npx prisma db push --accept-data-loss

echo [3/3] Seeding Database...
call npx prisma db seed

echo ==========================================
echo       Setup Complete! 
echo ==========================================
echo Run 'npm run dev' to start the application.
pause
