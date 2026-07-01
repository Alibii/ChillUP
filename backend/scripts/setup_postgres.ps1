# One-time PostgreSQL bootstrap for the ChillUP backend.
#
# WHY THIS EXISTS: your local PostgreSQL 18 requires a password (scram-sha-256)
# for the `postgres` superuser, and nobody has it. This script never needs that
# password — it temporarily flips local/host auth to `trust`, creates a
# dedicated low-privilege role (`chillup_app`) + database (`chillup`) that the
# Django backend will use, then restores the original auth config.
#
# HOW TO RUN: right-click this file -> "Run with PowerShell" from an
# Administrator PowerShell window, or open an elevated PowerShell and run:
#   cd <this scripts folder>
#   .\setup_postgres.ps1
#
# It is safe to re-run.

#Requires -RunAsAdministrator

$ErrorActionPreference = "Stop"

$PgVersion = "18"
$PgHome    = "C:\Program Files\PostgreSQL\$PgVersion"
$PgBin     = Join-Path $PgHome "bin"
$PgData    = Join-Path $PgHome "data"
$HbaFile   = Join-Path $PgData "pg_hba.conf"
$HbaBackup = Join-Path $PgData "pg_hba.conf.bak_chillup"
$ServiceName = "postgresql-x64-18"
$SqlFile   = Join-Path $PSScriptRoot "setup_postgres.sql"
$EnvFile   = Join-Path (Split-Path $PSScriptRoot -Parent) ".env"

if (-not (Test-Path $HbaFile)) { throw "pg_hba.conf not found at $HbaFile - check `$PgVersion/`$PgHome at the top of this script." }
if (-not (Test-Path $SqlFile)) { throw "setup_postgres.sql not found next to this script." }

# Generate a fresh random password for the chillup_app role rather than
# hardcoding one in setup_postgres.sql (which is committed to git).
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 24
$rng.GetBytes($bytes)
$dbPassword = ([Convert]::ToBase64String($bytes) -replace '[^a-zA-Z0-9]', '').Substring(0, 28)

Write-Host "1/5 Backing up pg_hba.conf..."
if (-not (Test-Path $HbaBackup)) {
    Copy-Item $HbaFile $HbaBackup
}

Write-Host "2/5 Temporarily enabling trust auth for local connections..."
(Get-Content $HbaBackup) -replace '\bscram-sha-256\b', 'trust' | Set-Content $HbaFile

Write-Host "3/5 Restarting PostgreSQL service to apply trust auth..."
Restart-Service -Name $ServiceName -Force
Start-Sleep -Seconds 3

try {
    Write-Host "4/5 Creating chillup_app role + chillup database..."
    $env:PATH += ";$PgBin"
    & psql -U postgres -h 127.0.0.1 -v chillup_password="$dbPassword" -f $SqlFile
    if ($LASTEXITCODE -ne 0) { throw "psql setup script failed with exit code $LASTEXITCODE" }
    Write-Host "    Done."
}
finally {
    Write-Host "5/5 Restoring original auth config (scram-sha-256) and restarting service..."
    Copy-Item $HbaBackup $HbaFile -Force
    Restart-Service -Name $ServiceName -Force
}

Write-Host "Writing DB_PASSWORD into backend/.env..."
if (Test-Path $EnvFile) {
    $lines = Get-Content $EnvFile
    if ($lines -match '^DB_PASSWORD=') {
        $lines = $lines -replace '^DB_PASSWORD=.*$', "DB_PASSWORD=$dbPassword"
    } else {
        $lines += "DB_PASSWORD=$dbPassword"
    }
    Set-Content -Path $EnvFile -Value $lines
} else {
    Write-Host "  backend/.env not found - copy backend/.env.example to backend/.env and set DB_PASSWORD=$dbPassword manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "All set. Database 'chillup' and role 'chillup_app' are ready." -ForegroundColor Green
Write-Host "backend/.env has been updated with the generated DB_PASSWORD." -ForegroundColor Green
