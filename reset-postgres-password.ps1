# Step 1: Backup current pg_hba.conf
Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf" "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup"

# Step 2: Modify pg_hba.conf to allow trust authentication
$pgHbaPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"
$content = Get-Content $pgHbaPath
$newContent = $content -replace 'scram-sha-256', 'trust'
Set-Content $pgHbaPath $newContent

Write-Host "✅ Modified pg_hba.conf to allow passwordless login" -ForegroundColor Green

# Step 3: Restart PostgreSQL service
Write-Host "`n🔄 Restarting PostgreSQL service..." -ForegroundColor Yellow
Restart-Service postgresql-x64-18
Start-Sleep -Seconds 3

Write-Host "✅ PostgreSQL restarted" -ForegroundColor Green

# Step 4: Connect and set new password
Write-Host "`n🔐 Setting new password..." -ForegroundColor Yellow
Write-Host "Enter your new password for PostgreSQL:"
$newPassword = Read-Host -AsSecureString
$newPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

# Set the password
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$env:PGPASSWORD = ""
& $psqlPath -U postgres -h 127.0.0.1 -d postgres -c "ALTER USER postgres WITH PASSWORD '$newPasswordPlain';"

Write-Host "✅ Password updated!" -ForegroundColor Green

# Step 5: Restore pg_hba.conf
Write-Host "`n🔄 Restoring authentication settings..." -ForegroundColor Yellow
Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" $pgHbaPath -Force

# Step 6: Restart PostgreSQL again
Restart-Service postgresql-x64-18
Start-Sleep -Seconds 3

Write-Host "`n✅ PostgreSQL password reset complete!" -ForegroundColor Green
Write-Host "`n📝 Update your .env file with:" -ForegroundColor Cyan
Write-Host "DATABASE_URL=postgresql://postgres:$newPasswordPlain@127.0.0.1:5432/milabs?schema=public"
Write-Host "`n⚠️  Remember to URL-encode special characters (@, #, etc.) as %40, %23, etc." -ForegroundColor Yellow
