const path=require('path'),fs=require('fs');
let playwright;try{playwright=require('playwright')}catch{playwright=require('C:/Users/BBNK/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')}const {chromium}=playwright;
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const report=[];
 for(const mobile of [false,true])for(const character of ['male','female']){
  const name=`${mobile?'mobile':'desktop'}-${character==='male'?'perlica':'amiya'}`;
  const page=await browser.newPage({viewport:mobile?{width:360,height:700}:{width:1920,height:1080},deviceScaleFactor:mobile?2:1,reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8080/mockups/proposal.html?motion=off&view=${mobile?'mobile':'tv'}&character=${character}`);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  await page.waitForFunction(()=>document.querySelector('.canvas').dataset.fontsReady==='true');
  await page.screenshot({path:path.join(__dirname,`${name}.png`),fullPage:true});
  report.push({name,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].every(i=>i.complete&&i.naturalWidth>0),height:document.body.scrollHeight}))});
  await page.close();
 }
 fs.writeFileSync(path.join(__dirname,'render-check.json'),JSON.stringify(report,null,2));console.log(report);
}finally{await browser.close();}})();


