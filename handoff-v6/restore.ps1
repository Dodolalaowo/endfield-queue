$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
New-Item -ItemType Directory -Force mockups,reference-assets | Out-Null
Copy-Item -Path "$PSScriptRoot\*.cjs","$PSScriptRoot\*.css" -Destination mockups -Force
Invoke-WebRequest 'https://codeload.github.com/Dodolalaowo/endfield-queue/zip/refs/heads/main' -OutFile reference-assets/source.zip
Expand-Archive -LiteralPath reference-assets/source.zip -DestinationPath reference-assets/source -Force
$downloads = @{
 'perlica-idle.mp4'='https://web-static.hg-cdn.com/endfield/official-v4/_next/static/media/video/idle.f95544.mp4'
 'amiya.png'='https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e0.2c74e355.png'
 'amiya-e1.png'='https://web-static.hg-cdn.com/arknights/official/_next/static/media/amiya_e1.739a31c1.png'
 'ak-page.html'='https://ak.gryphline.com/'
}
foreach ($name in $downloads.Keys) { Invoke-WebRequest $downloads[$name] -OutFile (Join-Path reference-assets $name) }
npm install --no-save playwright
node mockups/prepare.cjs
$previewProcess = Start-Process -FilePath (Get-Command node).Source -ArgumentList 'preview.cjs','8080' -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru
try { Start-Sleep -Seconds 2; node mockups/extract.cjs; node mockups/build.cjs; node mockups/render.cjs } finally { Stop-Process -Id $previewProcess.Id -ErrorAction SilentlyContinue }
Write-Output 'Ready. Run node preview.cjs 8080 to open the mockup.'

