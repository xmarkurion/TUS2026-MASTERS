# Paths
$db       = "deploy/db"
$dumpDir  = "deploy/db_dump"

# Ensure dump directory exists
if (-not (Test-Path $dumpDir)) {
    New-Item -ItemType Directory -Path $dumpDir | Out-Null
}

# Check if DB folder contains any files
$hasFiles = Get-ChildItem -Path $db -File -Recurse -Force -ErrorAction SilentlyContinue

if ($hasFiles -and $hasFiles.Count -gt 0) {
    $zip = Join-Path $dumpDir "dump.zip"

    # Remove old zip if present
    if (Test-Path $zip) {
        Remove-Item $zip -Force
    }

    # Create new archive
    Compress-Archive -Path (Join-Path $db "*") -DestinationPath $zip -Force
}
else {
    Write-Host "DB folder empty; skipping zip"
}
