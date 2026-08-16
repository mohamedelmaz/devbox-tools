$ErrorActionPreference = "Stop"
$root = "C:\Users\smart\Desktop\devbox"

Write-Host "Starting DevBox fixes..." -ForegroundColor Cyan
Write-Host ""

# ========================================
# Fix 1: Homepage script path
# ========================================
$indexFile = Join-Path $root "index.html"
if (Test-Path $indexFile) {
    $content = Get-Content $indexFile -Raw
    if ($content -match 'src="/assets/js/app\.js"') {
        $content = $content -replace 'src="/assets/js/app\.js"', 'src="./assets/js/app.js"'
        $content | Set-Content $indexFile -NoNewline
        Write-Host "[OK] Fixed index.html script path" -ForegroundColor Green
    } else {
        Write-Host "[OK] index.html script path already correct" -ForegroundColor Green
    }
} else {
    Write-Host "[ERROR] index.html not found" -ForegroundColor Red
}

Write-Host ""

# ========================================
# Fix 2: Count HTML files
# ========================================
$htmlFiles = Get-ChildItem -Path $root -Filter "index.html" -Recurse
Write-Host "Found $($htmlFiles.Count) index.html files" -ForegroundColor Cyan

# ========================================
# Fix 3: Check theme-toggle presence
# ========================================
Write-Host ""
Write-Host "Checking theme-toggle buttons..." -ForegroundColor Cyan
$missingToggle = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -notmatch 'class="theme-toggle"') {
        $relative = $file.FullName.Replace($root, '').TrimStart('\')
        $missingToggle += $relative
    }
}

if ($missingToggle.Count -eq 0) {
    Write-Host "[OK] All pages have theme-toggle" -ForegroundColor Green
} else {
    Write-Host "[WARN] Missing theme-toggle in $($missingToggle.Count) pages:" -ForegroundColor Yellow
    $missingToggle | ForEach-Object { Write-Host "  - $_" }
}

# ========================================
# Fix 4: Check wrong app.js paths
# ========================================
Write-Host ""
Write-Host "Checking app.js paths..." -ForegroundColor Cyan
$wrongPaths = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match 'src="/assets/js/app\.js"') {
        $relative = $file.FullName.Replace($root, '').TrimStart('\')
        $wrongPaths += $relative
    }
}

if ($wrongPaths.Count -eq 0) {
    Write-Host "[OK] All pages have correct app.js paths" -ForegroundColor Green
} else {
    Write-Host "[WARN] Wrong app.js path in $($wrongPaths.Count) pages:" -ForegroundColor Yellow
    $wrongPaths | ForEach-Object { Write-Host "  - $_" }
}

# ========================================
# Fix 5: Check wrong link paths
# ========================================
Write-Host ""
Write-Host "Checking for absolute paths that break on GitHub Pages..." -ForegroundColor Cyan
$badLinks = @()

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $relative = $file.FullName.Replace($root, '').TrimStart('\')
    
    # Check for href="/ or src="/ (absolute paths)
    $absoluteHrefs = [regex]::Matches($content, 'href="/(?!/)')
    $absoluteSrcs = [regex]::Matches($content, 'src="/(?!/)')
    
    if ($absoluteHrefs.Count -gt 0 -or $absoluteSrcs.Count -gt 0) {
        $badLinks += $relative
    }
}

if ($badLinks.Count -eq 0) {
    Write-Host "[OK] No absolute paths found" -ForegroundColor Green
} else {
    Write-Host "[WARN] Absolute paths in $($badLinks.Count) pages:" -ForegroundColor Yellow
    $badLinks | ForEach-Object { Write-Host "  - $_" }
}

# ========================================
# Summary
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HTML files found: $($htmlFiles.Count)" -ForegroundColor White
Write-Host "Missing theme-toggle: $($missingToggle.Count)" -ForegroundColor $(if($missingToggle.Count -eq 0){'Green'}else{'Yellow'})
Write-Host "Wrong app.js paths: $($wrongPaths.Count)" -ForegroundColor $(if($wrongPaths.Count -eq 0){'Green'}else{'Yellow'})
Write-Host "Absolute paths: $($badLinks.Count)" -ForegroundColor $(if($badLinks.Count -eq 0){'Green'}else{'Yellow'})
Write-Host ""
Write-Host "Next: git add . ; git commit -m 'Fix issues' ; git push origin main" -ForegroundColor Cyan