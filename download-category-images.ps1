# # Download Category Default Images for StudentShare
# # This script downloads 8 real photographic images from Unsplash

# $ErrorActionPreference = "Stop"

# # Set project directory
# $projectDir = "D:\Desktop\sharestudent"
# $imagesDir = Join-Path $projectDir "public\images"

# # Create images directory if it doesn't exist
# if (-not (Test-Path $imagesDir)) {
#     Write-Host "Creating directory: $imagesDir" -ForegroundColor Cyan
#     New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
# } else {
#     Write-Host "Images directory exists: $imagesDir" -ForegroundColor Green
# }

# # Define image URLs from Unsplash (direct photo URLs)
# $images = @{
#     "default-electronics.jpg" = "https://images.unsplash.com/photo-1517336714731-489971d81c5d?w=800&h=600&fit=crop&fm=jpg"
#     "default-books.jpg" = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop&fm=jpg"
#     "default-clothing.jpg" = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=600&fit=crop&fm=jpg"
#     "default-hostel.jpg" = "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&h=600&fit=crop&fm=jpg"
#     "default-sports.jpg" = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&fm=jpg"
#     "default-academic.jpg" = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&fm=jpg"
#     "default-project.jpg" = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&fm=jpg"
#     "default-product.jpg" = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&fm=jpg"
# }

# Write-Host "`n=== Downloading Category Images ===`" -ForegroundColor Yellow
# Write-Host "Target directory: $imagesDir` -ForegroundColor Cyan
# Write-Host ""

# $successCount = 0
# $failCount = 0

# foreach ($image in $images.GetEnumerator()) {
#     $fileName = $image.Key
#     $url = $image.Value
#     $filePath = Join-Path $imagesDir $fileName
    
#     Write-Host "Downloading: $fileName" -ForegroundColor Cyan
    
#     try {
#         # Download the image
#         Invoke-WebRequest -Uri $url -OutFile $filePath -UseBasicParsing
        
#         # Verify the file was downloaded and has content
#         if (Test-Path $filePath) {
#             $fileSize = (Get-Item $filePath).Length
            
#             # Check if file is too small (likely an error page)
#             if ($fileSize -lt 1000) {
#                 Write-Host "  ✗ FAILED: File too small ($fileSize bytes) - likely an error page" -ForegroundColor Red
#                 Remove-Item $filePath -Force
#                 $failCount++
#             } else {
#                 # Check if it's a valid image by checking file signature
#                 $bytes = [System.IO.File]::ReadAllBytes($filePath)
#                 $isJpg = $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8 -and $bytes[2] -eq 0xFF
                
#                 if ($isJpg) {
#                     Write-Host "  ✓ SUCCESS: Downloaded ($fileSize bytes)" -ForegroundColor Green
#                     $successCount++
#                 } else {
#                     Write-Host "  ✗ FAILED: Invalid JPG file signature" -ForegroundColor Red
#                     Remove-Item $filePath -Force
#                     $failCount++
#                 }
#             }
#         } else {
#             Write-Host "  ✗ FAILED: File not created" -ForegroundColor Red
#             $failCount++
#         }
#     }
#     catch {
#         Write-Host "  ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
#         $failCount++
#     }
# }

# Write-Host "`n=== Download Summary ===" -ForegroundColor Yellow
# Write-Host "Successful: $successCount" -ForegroundColor Green
# Write-Host "Failed: $failCount" -ForegroundColor Red

# if ($successCount -eq 8) {
#     Write-Host "`n✓ All 8 category images downloaded successfully!" -ForegroundColor Green
#     exit 0
# } else {
#     Write-Host "`n✗ Some downloads failed. Please check the errors above." -ForegroundColor Red
#     exit 1
# }

$ErrorActionPreference = "Stop"

$projectDir = "D:\Desktop\sharestudent"
$imagesDir = Join-Path $projectDir "public\images"

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}

$images = [ordered]@{
    "default-electronics.jpg" = "https://images.unsplash.com/photo-1517336714731-489971d81c5d?w=800&h=600&fit=crop&fm=jpg"
    "default-books.jpg"       = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop&fm=jpg"
    "default-clothing.jpg"    = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&h=600&fit=crop&fm=jpg"
    "default-hostel.jpg"      = "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&h=600&fit=crop&fm=jpg"
    "default-sports.jpg"      = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop&fm=jpg"
    "default-academic.jpg"    = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop&fm=jpg"
    "default-project.jpg"     = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&fm=jpg"
    "default-product.jpg"     = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&fm=jpg"
}

$successCount = 0
$failCount = 0

Write-Host "`n=== Downloading StudentShare Category Images ===" -ForegroundColor Yellow

foreach ($entry in $images.GetEnumerator()) {

    $fileName = $entry.Key
    $url = $entry.Value
    $filePath = Join-Path $imagesDir $fileName
    $tempPath = "$filePath.download"

    Write-Host "`nDownloading $fileName..." -ForegroundColor Cyan

    try {
        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force
        }

        Invoke-WebRequest -Uri $url -OutFile $tempPath -UseBasicParsing

        if (-not (Test-Path $tempPath)) {
            throw "Download did not create a file."
        }

        $bytes = [System.IO.File]::ReadAllBytes($tempPath)

        if ($bytes.Length -lt 10000) {
            throw "Downloaded file is too small: $($bytes.Length) bytes."
        }

        $isJpg = (
            $bytes.Length -ge 3 -and
            $bytes[0] -eq 0xFF -and
            $bytes[1] -eq 0xD8 -and
            $bytes[2] -eq 0xFF
        )

        if (-not $isJpg) {
            throw "Downloaded file is not a valid JPEG."
        }

        # Replace the final file only after successful validation.
        Move-Item -LiteralPath $tempPath -Destination $filePath -Force

        $sizeKB = [math]::Round((Get-Item $filePath).Length / 1KB, 1)

        Write-Host "SUCCESS: $fileName ($sizeKB KB)" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "FAILED: $fileName - $($_.Exception.Message)" -ForegroundColor Red
        $failCount++

        if (Test-Path $tempPath) {
            Remove-Item $tempPath -Force
        }
    }
}

Write-Host "`n=== DOWNLOAD SUMMARY ===" -ForegroundColor Yellow
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red

Write-Host "`nImages directory: $imagesDir"

if ($successCount -eq 8) {
    Write-Host "All eight images downloaded and passed JPEG signature checks." -ForegroundColor Green
} else {
    Write-Host "Some images failed. Existing valid images were preserved." -ForegroundColor Yellow
}