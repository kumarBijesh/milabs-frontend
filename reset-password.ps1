# PostgreSQL Password Reset Script
# Run this as Administrator

Write-Host "PostgreSQL Password Reset Tool"
Write-Host "==============================="

# Step 1: Backup
Write-Host "`nStep 1: Backing up pg_hba.conf..."
Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf" "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" -Force

# Step 2: Enable trust authentication
Write-Host "Step 2: Enabling passwordless login..."
$pgHbaPath = "C:\Program Files\PostgreSQL\18\data\pg_hba.conf"
$content = Get-Content $pgHbaPath
$newContent = $content -replace 'scram-sha-256', 'trust'
Set-Content $pgHbaPath $newContent

# Step 3: Restart service
Write-Host "Step 3: Restarting PostgreSQL..."
Restart-Service postgresql-x64-18
Start-Sleep -Seconds 3

# Step 4: Set password
Write-Host "Step 4: Enter new password for PostgreSQL:"
$newPassword = Read-Host "New Password"

$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
& $psqlPath -U postgres -h 127.0.0.1 -d postgres -c "ALTER USER postgres WITH PASSWORD '$newPassword';"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nPassword updated successfully!"
    
    # Step 5: Restore security
    Write-Host "Step 5: Restoring security settings..."
    Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" $pgHbaPath -Force
    Restart-Service postgresql-x64-18
    Start-Sleep -Seconds 3
    
    Write-Host "`nDone! Your new password is: $newPassword"
    Write-Host "`nNow update .env file with this connection string:"
    
    # URL encode special characters
    $encodedPassword = $newPassword -replace '@', '%40' -replace '#', '%23' -replace '!', '%21'
    Write-Host "DATABASE_URL=postgresql://postgres:$encodedPassword@127.0.0.1:5432/milabs?schema=public"
}
else {
    Write-Host "`nFailed to set password. Restoring original settings..."
    Copy-Item "C:\Program Files\PostgreSQL\18\data\pg_hba.conf.backup" $pgHbaPath -Force
    Restart-Service postgresql-x64-18
}
