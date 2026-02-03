
Add-Type -AssemblyName System.Drawing

$imagePath = "public\ogp.jpg"
$fullPath = Resolve-Path $imagePath
$image = [System.Drawing.Image]::FromFile($fullPath)

Write-Output "Width: $($image.Width)"
Write-Output "Height: $($image.Height)"
Write-Output "Size(KB): $([math]::Round((Get-Item $imagePath).Length / 1024, 2))"
Write-Output "Format: $($image.RawFormat.Guid)"

$image.Dispose()
