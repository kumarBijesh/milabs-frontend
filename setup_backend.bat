@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo       MiLabs Backend Setup (SQLite)
echo ==========================================

echo [1/5] Configuring for SQLite...
echo DATABASE_URL="file:./dev.db" > .env

echo [2/5] Cleaning previous Prisma builds...
if exist "node_modules\.prisma" rmdir /s /q "node_modules\.prisma"
if exist "prisma\dev.db" del /f /q "prisma\dev.db"

echo [3/5] Installing dependencies...
call npm install

echo [4/5] Generating Prisma Client...
set PRISMA_CLI_BINARY_TARGETS=windows
call npx prisma generate

echo [5/5] Pushing Schema to SQLite Database...
call npx prisma db push --accept-data-loss

echo [6/6] Seeding Database...
set TS_NODE_COMPILER_OPTIONS={"module":"commonjs"}
call npx prisma db seed

echo ==========================================
echo       Backend Setup Complete! 
echo ==========================================
echo Please RESTART your 'npm run dev' terminal now.
pause
