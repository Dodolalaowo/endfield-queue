const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const origin=process.env.PREVIEW_URL||'http://127.0.0.1:8080';
const out=path.join(__dirname,'verification');fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.BROWSER_CHANNEL?{channel:process.env.BROWSER_CHANNEL}:{})});
 const passed=[];
 async function open(options={},query=''){
  const page=await browser.newPage(options),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(origin+'/'+query);await page.waitForFunction(()=>document.querySelector('.canvas').dataset.fontsReady==='true');return{page,errors};
 }
 try{
  for(const [width,height] of [[320,568],[360,640],[390,844],[768,1024],[899,900],[900,900],[1366,768],[1920,1080]]){
   const {page,errors}=await open({viewport:{width,height},reducedMotion:'reduce'});
   const state=await page.evaluate(()=>({mobile:document.querySelector('.canvas').classList.contains('mobile'),overflow:document.documentElement.scrollWidth>innerWidth,number:document.querySelector('.number text').textContent,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),font:[...document.fonts].map(f=>({name:f.family,status:f.status})),videos:document.querySelectorAll('video').length,noticeBottom:document.querySelector('.notice').offsetTop+document.querySelector('.notice').offsetHeight,canvasHeight:document.querySelector('.canvas').offsetHeight}));
   assert.equal(state.mobile,width<900);assert.equal(state.overflow,false);assert.equal(state.number,'039');assert(state.images);assert(state.font.every(f=>f.status==='loaded'));assert.equal(state.videos,0);assert(state.noticeBottom<=state.canvasHeight);assert.deepEqual(errors,[]);
   if(width===360||width===1920)await page.screenshot({path:path.join(out,`static-${width}.png`),fullPage:true});
   passed.push(`layout ${width}x${height}: fonts, images, leading zero, no horizontal overflow, reduced motion`);await page.close();
  }
  for(const view of ['mobile','tv']){
   const {page,errors}=await open({viewport:{width:1000,height:800},reducedMotion:'reduce'},`?view=${view}`);
   assert.equal(await page.locator('.canvas').evaluate(e=>e.classList.contains('mobile')),view==='mobile');assert.deepEqual(errors,[]);await page.close();passed.push(`forced ${view}`);
  }
  {
   const page=await browser.newPage({viewport:{width:360,height:640},reducedMotion:'reduce'});
   await page.route('**/content.js',async route=>{const r=await route.fetch();await route.fulfill({response:r,body:(await r.text()).replace("day:'1',number:'039'","day:'12',number:'0009'").replace("noticeMain:'請於叫號前返回 GRYPHLINE STORE 等候'","noticeMain:'請於叫號前返回 GRYPHLINE STORE 等候。現場人潮較多時請依工作人員引導，保持通道暢通並備妥入場憑證。'")});});
   await page.goto(origin);await page.waitForFunction(()=>document.querySelector('.canvas').dataset.fontsReady==='true');
   assert.equal(await page.locator('.number text').textContent(),'0009');assert.equal(await page.locator('.day-value text').textContent(),'12');
   const bounds=await page.evaluate(()=>({end:document.querySelector('.notice').offsetTop+document.querySelector('.notice').offsetHeight,height:document.querySelector('.canvas').offsetHeight,overflow:document.documentElement.scrollWidth>innerWidth}));assert(bounds.end<=bounds.height);assert.equal(bounds.overflow,false);
   await page.screenshot({path:path.join(out,'long-notice.png'),fullPage:true});await page.close();passed.push('DAY 12, 0009, long notice extends canvas');
  }
  {
   const {page,errors}=await open({viewport:{width:1920,height:1080}});
   await page.waitForFunction(()=>Number(document.querySelector('.character-layer[data-character=male]').dataset.frames)>5);
   await page.screenshot({path:path.join(out,'animated-desktop.png')});
   const start=await page.locator('.character-layer[data-character=male]').getAttribute('data-frames');await page.waitForFunction(s=>Number(document.querySelector('.character-layer[data-character=male]').dataset.frames)>Number(s)+5,start);
   await page.waitForFunction(()=>document.querySelector('.canvas').dataset.character==='female',{},{timeout:16000});
   await page.waitForFunction(()=>document.querySelector('.character-layer[data-character=female]').classList.contains('has-video'));
   await page.waitForTimeout(1000);
   assert(await page.locator('.character-layer[data-character=male] video').evaluate(v=>v.paused));assert.deepEqual(errors,[]);
   await page.screenshot({path:path.join(out,'animated-desktop-female.png')});await page.close();passed.push('3D frames advance, male/female transition, outgoing decoder pauses');
  }
  {
   const {page,errors}=await open({viewport:{width:390,height:844},isMobile:true,hasTouch:true},'?character=female');
   await page.waitForFunction(()=>Number(document.querySelector('.character-layer[data-character=female]').dataset.frames)>5);
   assert.equal(await page.locator('.canvas').evaluate(e=>e.classList.contains('mobile')),true);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth),false);await page.screenshot({path:path.join(out,'animated-mobile.png'),fullPage:true});assert.deepEqual(errors,[]);
   await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.paused));assert(await page.locator('video').evaluate(v=>v.paused));assert.equal(await page.locator('.has-video').count(),0);await page.close();passed.push('mobile animation, runtime reduced-motion fallback');
  }
  {
   const page=await browser.newPage({viewport:{width:360,height:640}});await page.route('**/*.mp4',r=>r.abort());await page.goto(origin+'/?character=male');
   await page.waitForFunction(()=>document.querySelector('.character-layer[data-character=male]').dataset.videoState==='poster');
   assert.equal(await page.locator('.has-video').count(),0);assert(await page.locator('.character-layer[data-character=male] img').evaluate(e=>e.complete&&e.naturalWidth>0));await page.close();passed.push('blocked video preserves static character');
  }
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({testedAt:new Date().toISOString(),engine:'Chromium desktop + viewport/touch emulation; not physical iPhone',passed},null,2));console.log(passed.join('\n'));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});



