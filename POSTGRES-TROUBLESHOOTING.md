# PostgreSQL Connection Troubleshooting Guide

## Current Issue
PostgreSQL is installed and running, but we're getting authentication errors.

## Quick Fix Options

### Option 1: Reset PostgreSQL Password (RECOMMENDED)

1. Open **Command Prompt as Administrator**
2. Run these commands:

```cmd
cd "C:\Program Files\PostgreSQL\18\bin"
psql -U postgres
```

3. If it asks for a password and fails, we need to reset it:
   - Open `C:\Program Files\PostgreSQL\18\data\pg_hba.conf` in Notepad (as Administrator)
   - Find the line: `host    all             all             127.0.0.1/32            scram-sha-256`
   - Change `scram-sha-256` to `trust` (temporarily)
   - Save the file
   - Restart PostgreSQL service:
     ```powershell
     Restart-Service postgresql-x64-18
     ```
   - Now connect without password:
     ```cmd
     psql -U postgres -h 127.0.0.1
     ```
   - Set a new password:
     ```sql
     ALTER USER postgres WITH PASSWORD 'newpassword123';
     ```
   - Change `pg_hba.conf` back to `scram-sha-256`
   - Restart service again

### Option 2: Use pgAdmin (EASIEST)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. It will ask for a master password (set one if first time)
3. Connect to PostgreSQL 18 server
4. If password doesn't work, use Option 1 to reset it first
5. Once connected:
   - Right-click "Databases" → "Create" → "Database"
   - Name: `milabs`
   - Click "Save"

### Option 3: Use SQLite for Development (FASTEST)

If PostgreSQL is too complex to set up right now, we can use SQLite for development:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Update `.env`:
   ```
   DATABASE_URL="file:./dev.db"
   ```

3. Run:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

## What to Do Next

**Tell me which option you want to try:**
1. Reset PostgreSQL password
2. Use pgAdmin to create database
3. Switch to SQLite for now

I'll guide you through whichever you choose!
