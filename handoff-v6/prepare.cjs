const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),assets=path.join(root,'reference-assets');
const html=fs.readFileSync(path.join(assets,'ak-page.html'),'utf8');
const svg=[...html.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/g)].map(m=>m[0]).find(x=>x.includes('id="svg_def-title_arknights"'));
if(!svg)throw Error('Official logo not found');
fs.writeFileSync(path.join(assets,'arknights-logo.svg'),svg.replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" ').replace('</svg>','<use href="#svg_def-title_arknights"/></svg>'));
fs.copyFileSync(path.join(assets,'source/endfield-queue-main/serve.cjs'),path.join(root,'preview.cjs'));
console.log('Official logo extracted');

