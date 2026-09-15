const fs=require('fs'),path=require('path');
const original=path.join(__dirname,'../reference-assets/source/endfield-queue-main');
let html=fs.readFileSync(path.join(original,'index.html'),'utf8');
html=html.replace('<head>','<head><base href="../reference-assets/source/endfield-queue-main/">');
html=html.replace('</head>','<link rel="stylesheet" href="/mockups/proposal.css"></head>');
html=html.replace('<body>','<body><span class="event" hidden></span>');
html=html.replace(/<img class="logo"[\s\S]*?<div class="header-note">/,'<div class="brand-pair"><img class="brand-endfield" src="assets/endfield-logo-original.svg" alt="終末地"><span class="brand-divider"></span><img class="brand-arknights" src="/reference-assets/arknights-logo.svg" alt="明日方舟"></div><div class="header-note">');
html=html.replace('<b>[ 管理員 ]</b><small>ENDMINISTRATOR</small>','<b class="operator-name"></b><small class="operator-en"></small>');
html=html.replace('<div class="character-stage"','<div class="amiya-scene"><img src="/reference-assets/amiya-e1.png" alt=""><span>RHODES ISLAND</span></div><div class="character-stage"');
html=html.replace('assets/male-3d-frame.png','/reference-assets/perlica-frame.png').replace('assets/female-3d-frame.png','/reference-assets/amiya.png');
html=html.replace('</body>',`<script>
const isAmiya=new URLSearchParams(location.search).get('character')==='female';
document.querySelector('.canvas').classList.add(isAmiya?'amiya':'perlica');
document.querySelector('.operator-name').textContent=isAmiya?'[ 阿米婭 ]':'[ 佩麗卡 ]';
document.querySelector('.operator-en').textContent=isAmiya?'AMIYA / RHODES ISLAND':'PERLICA / ENDFIELD';
if(isAmiya && new URLSearchParams(location.search).get('demo')==='on' && !matchMedia('(prefers-reduced-motion: reduce)').matches){
 const mobile=new URLSearchParams(location.search).get('view')==='mobile';
 const foreground=document.querySelector('[data-character="female"] .character-poster');
 const background=document.querySelector('.amiya-scene img');
 const animations=[foreground.animate([{transform:'translateX(0)'},{transform:'translateX('+(mobile?5:14)+'px)'}],{duration:6500,iterations:Infinity,direction:'alternate',easing:'ease-in-out'}),background.animate([{transform:'translateX(0)'},{transform:'translateX(-'+(mobile?7:20)+'px)'}],{duration:6500,iterations:Infinity,direction:'alternate',easing:'ease-in-out'})];
 document.addEventListener('visibilitychange',()=>animations.forEach(a=>document.hidden?a.pause():a.play()));
}
</script></body>`);
fs.writeFileSync(path.join(__dirname,'proposal.html'),html);
console.log('Mockup HTML created');


