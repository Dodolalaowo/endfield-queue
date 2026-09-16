param([Parameter(Mandatory=$true)][string]$Ffmpeg)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$source=Join-Path $projectRoot 'assets/perlica-idle-original.mp4'
& $Ffmpeg -hide_banner -y -i $source -vf 'scale=2880:810:flags=lanczos' -r 30 -c:v libx264 -profile:v main -level 5.0 -pix_fmt yuv420p -crf 18 -maxrate 6000k -bufsize 12000k -g 60 -movflags +faststart -an (Join-Path $projectRoot 'assets/perlica-desktop-hq.mp4')
if($LASTEXITCODE -ne 0){throw 'Desktop transcode failed'}
& $Ffmpeg -hide_banner -y -i $source -vf 'scale=1920:540:flags=lanczos' -r 30 -c:v libx264 -profile:v main -level 3.2 -pix_fmt yuv420p -crf 18 -maxrate 3500k -bufsize 7000k -g 60 -movflags +faststart -an (Join-Path $projectRoot 'assets/perlica-mobile-hq.mp4')
if($LASTEXITCODE -ne 0){throw 'Mobile transcode failed'}
