# Database Setup Script for MiLabs
# This script will help you set up the PostgreSQL database

Write-Host "🚀 MiLabs Database Setup" -ForegroundColor Cyan
Write-Host "=" * 50

# Step 1: Check PostgreSQL Service
Write-Host "`n📊 Checking PostgreSQL service..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue

if ($pgService -and $pgService.Status -eq 'Running') {
    Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
}
else {
    Write-Host "❌ PostgreSQL service not found or not running" -ForegroundColor Red
    Write-Host "Please start PostgreSQL service from Services (services.msc)" -ForegroundColor Yellow
    exit 1
}

# Step 2: Get PostgreSQL password
Write-Host "`n🔐 PostgreSQL Setup" -ForegroundColor Yellow
Write-Host "Please enter the password you set during PostgreSQL installation:"
$pgPassword = Read-Host -AsSecureString
$pgPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($pgPassword))

# Step 3: Test connection and create database
Write-Host "`n📦 Creating database 'milabs'..." -ForegroundColor Yellow

$env:PGPASSWORD = $pgPasswordPlain
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Check if database exists
$dbExists = & $psqlPath -U postgres -h localhost -p 5432 -tAc "SELECT 1 FROM pg_database WHERE datname='milabs'" 2>$null

if ($dbExists -eq "1") {
    Write-Host "✅ Database 'milabs' already exists" -ForegroundColor Green
}
else {
    # Create database
    & $psqlPath -U postgres -h localhost -p 5432 -c "CREATE DATABASE milabs;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database 'milabs' created successfully" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Failed to create database. Please check your password." -ForegroundColor Red
        exit 1
    }
}

# Step 4: Update .env file
Write-Host "`n📝 Updating .env file..." -ForegroundColor Yellow
$connectionString = "DATABASE_URL=postgresql://postgres:$pgPasswordPlain@localhost:5432/milabs?schema=public"
Set-Content -Path ".env" -Value $connectionString
Write-Host "✅ .env file updated" -ForegroundColor Green

# Step 5: Update schema.prisma to use env variable
Write-Host "`n📝 Updating Prisma schema..." -ForegroundColor Yellow
$schemaContent = Get-Content "prisma\schema.prisma" -Raw
$schemaContent = $schemaContent -replace 'url\s*=\s*"postgresql://[^"]*"', 'url      = env("DATABASE_URL")'
Set-Content -Path "prisma\schema.prisma" -Value $schemaContent -NoNewline
Write-Host "✅ Prisma schema updated" -ForegroundColor Green

# Step 6: Generate Prisma Client
Write-Host "`n🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
}
else {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}

# Step 7: Push schema to database
Write-Host "`n📤 Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database schema created" -ForegroundColor Green
}
else {
    Write-Host "❌ Failed to push schema" -ForegroundColor Red
    exit 1
}

# Step 8: Seed database
Write-Host "`n🌱 Seeding database with initial data..." -ForegroundColor Yellow
npx prisma db seed
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Seeding failed, but you can continue" -ForegroundColor Yellow
}

Write-Host "`n" + ("=" * 50)
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
Write-Host "`n📝 Login Credentials:" -ForegroundColor Cyan
Write-Host "Super Admin Email: superadmin@milabs.com"
Write-Host "Super Admin Password: SuperAdmin@123"
Write-Host "`nPatient Email: patient1@example.com"
Write-Host "Patient Password: Patient@123"
Write-Host "`n💡 Run 'npm run dev' to start the development server" -ForegroundColor Yellow
