param([Parameter(Mandatory=$true)][string]$Ffmpeg)
$ErrorActionPreference='Stop'
$projectRoot=Split-Path $PSScriptRoot -Parent
$source=Join-Path $projectRoot 'assets/perlica-idle-original.mp4'
& $Ffmpeg -hide_banner -y -i $source -vf 'scale=1920:540' -r 24 -c:v libx264 -profile:v main -level 3.2 -pix_fmt yuv420p -crf 21 -maxrate 2200k -bufsize 4400k -g 48 -movflags +faststart -an (Join-Path $projectRoot 'assets/perlica-desktop.mp4')
if($LASTEXITCODE -ne 0){throw 'Desktop transcode failed'}
& $Ffmpeg -hide_banner -y -i $source -vf 'scale=1280:360' -r 24 -c:v libx264 -profile:v baseline -level 3.1 -pix_fmt yuv420p -crf 22 -maxrate 1000k -bufsize 2000k -g 48 -movflags +faststart -an (Join-Path $projectRoot 'assets/perlica-mobile.mp4')
if($LASTEXITCODE -ne 0){throw 'Mobile transcode failed'}
