# MiLabs Backend Setup Guide

## Prerequisites

You need **ONE** of the following:
1. Docker Desktop installed (recommended for easy setup)
2. PostgreSQL installed locally

## Option 1: Using Docker (Recommended)

### Step 1: Install Docker Desktop
Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop/

### Step 2: Start PostgreSQL
```bash
docker-compose up -d
```

### Step 3: Initialize Database
```bash
npx prisma migrate dev --name init
```

### Step 4: Seed Database (optional)
```bash
npx prisma db seed
```

## Option 2: Using Local PostgreSQL

### Step 1: Install PostgreSQL
Download from: https://www.postgresql.org/download/windows/

### Step 2: Create Database
```bash
createdb milabs
```

### Step 3: Initialize Database
```bash
npx prisma migrate dev --name init
```

## Environment Variables

Make sure `.env.local` has:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/milabs?schema=public
NEXTAUTH_SECRET=your-secret-here
ENCRYPTION_KEY=your-encryption-key-here
```

## Verify Setup

```bash
# Check database connection
npx prisma studio

# Run development server
npm run dev
```

## Database Commands

```bash
# View database in browser
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Push schema changes without migration
npx prisma db push
```
