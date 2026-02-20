# Paths
$db   = "deploy/db"
$dump = "deploy/db_dump/dump.zip"

# Ensure DB directory exists
if (-not (Test-Path $db)) {
    New-Item -ItemType Directory -Path $db | Out-Null
}

# Remove existing DB contents
Remove-Item -Path (Join-Path $db "*") -Recurse -Force -ErrorAction SilentlyContinue

# Restore from dump.zip
if (Test-Path $dump) {
    Expand-Archive -Path $dump -DestinationPath $db -Force
}
else {
    Write-Error "dump.zip not found"
    exit 1
}
