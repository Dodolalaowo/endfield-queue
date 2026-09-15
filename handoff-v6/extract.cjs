const fs=require('fs'),path=require('path');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/BBNK/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}const {chromium}=playwright;
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:8080/reference-assets/source/endfield-queue-main/index.html?motion=off');
 const frame=await page.evaluate(async()=>{
  const v=document.createElement('video');v.muted=true;v.src='/reference-assets/perlica-idle.mp4';
  await new Promise((r,j)=>{v.onloadeddata=r;v.onerror=j;});
  v.currentTime=1;await new Promise(r=>v.onseeked=r);
  const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;
  const ctx=c.getContext('2d');ctx.drawImage(v,0,0);const w=c.width/2,h=c.height;
  const rgb=ctx.getImageData(0,0,w,h),mask=ctx.getImageData(w,0,w,h);
  for(let i=0;i<rgb.data.length;i+=4)rgb.data[i+3]=mask.data[i];
  c.width=w;ctx.putImageData(rgb,0,0);return {url:c.toDataURL('image/png'),width:w,height:h};
 });
 fs.writeFileSync(path.join(__dirname,'../reference-assets/perlica-frame.png'),Buffer.from(frame.url.split(',')[1],'base64'));
 console.log({width:frame.width,height:frame.height});
 }finally{await browser.close();}
})();


