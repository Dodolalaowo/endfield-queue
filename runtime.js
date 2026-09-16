(() => {
 'use strict';
 const config=window.QUEUE_CONTENT, stage=document.querySelector('.canvas');
 const params=new URLSearchParams(location.search), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layers=[...document.querySelectorAll('.character-layer')];
 const requested=({male:'perlica',female:'amiya'})[params.get('character')]||params.get('character');
 const fixed=['perlica','amiya'].includes(requested)?requested:null;
 let current=fixed==='amiya'?1:0, timer=0, fadeTimer=0;
 let perlicaPlayer; const decodedImages=new WeakSet();
 const fields={headerNote:'.header-note',title:'.title',label:'.label',dayLabel:'.day-label text',day:'.day-value text',number:'.number text',status:'.status span',noticeTag:'.notice-tag',noticeMain:'.notice-main',noticeSub:'.notice-sub'};
 function renderContent(){
  for(const [key,selector] of Object.entries(fields))document.querySelector(selector).textContent=String(config[key]??'');
  document.querySelector('.updated').textContent=`更新時間 ${config.updatedAt}`;
  document.querySelector('.queue-announcement').textContent=`${config.dayLabel} ${config.day}，${config.label} ${config.number}。`;
 }
 function fitText(selector,maxWidth,maxHeight){
  const svg=document.querySelector(selector), text=svg.querySelector('text');text.removeAttribute('transform');
  const style=getComputedStyle(text),measure=document.createElement('canvas').getContext('2d');
  measure.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  if('letterSpacing' in measure)measure.letterSpacing=style.letterSpacing;
  const metrics=measure.measureText(text.textContent),v=svg.viewBox.baseVal;
  const b={x:-metrics.actualBoundingBoxLeft,y:-metrics.actualBoundingBoxAscent,width:metrics.actualBoundingBoxLeft+metrics.actualBoundingBoxRight,height:metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent};
  if(!b.width||!b.height)return;
  const k=Math.min(maxWidth/b.width,maxHeight/b.height);
  text.setAttribute('transform',`translate(${v.width/2-(b.x+b.width/2)*k} ${v.height/2-(b.y+b.height/2)*k}) scale(${k})`);
 }
 function optical(){fitText('.number',580,228);fitText('.day-label',86,28);fitText('.day-value',108,90);}
 // Preserve the template's two canvases, but let a long notice extend the page.
 function layout(){
  const viewportWidth=document.documentElement.clientWidth,viewportHeight=document.documentElement.clientHeight;
  const mobile=params.get('view')==='mobile'||(params.get('view')!=='tv'&&viewportWidth<config.layout.breakpoint);
  stage.classList.toggle('mobile',mobile);
  const notice=document.querySelector('.notice');
  const width=mobile?360:1920,height=Math.max(mobile?640:1080,notice.offsetTop+notice.offsetHeight+(mobile?15:48));
  stage.style.height=`${height}px`;
  const scale=mobile?Math.min(viewportWidth/width,config.layout.mobileMaxScale):Math.min(viewportWidth/width,viewportHeight/height);
  stage.style.transform=`scale(${scale})`;stage.style.left=`${Math.max(0,(viewportWidth-width*scale)/2)}px`;
  stage.style.top=`${mobile?0:Math.max(0,(viewportHeight-height*scale)/2)}px`;
  document.body.style.minHeight=`${Math.max(viewportHeight,height*scale)}px`;
 }
 function motionAllowed(){return config.motion.enabled!==false&&params.get('motion')!=='off'&&!reduced.matches;}
 function player(){
  if(!perlicaPlayer){
   const mobile=stage.classList.contains('mobile'),canvas=layers[0].querySelector('canvas');
   canvas.width=mobile?640:960;canvas.height=mobile?360:540;
   perlicaPlayer=createQueueVideoPlayer(layers[0],{src:config.assets.perlica[mobile?'mobile':'desktop'],fallbackSrc:config.assets.perlica.mobile});
  }return perlicaPlayer;
 }
 function ready(index){return [...layers[index].querySelectorAll('img'),...(index===1?[document.querySelector('.amiya-scene img')]:[])].every(img=>decodedImages.has(img));}
 function display(index){
  layers.forEach((layer,i)=>layer.classList.toggle('is-active',i===index));stage.dataset.character=layers[index].dataset.character;
  stage.classList.toggle('amiya',index===1);stage.classList.toggle('perlica',index===0);
  document.querySelector('.operator-name').textContent=index===1?'[ 阿米婭 ]':'[ 佩麗卡 ]';
  document.querySelector('.operator-en').textContent=index===1?'AMIYA / RHODES ISLAND':'PERLICA / ENDFIELD';
 }
 function resetMotion(){
  clearTimeout(timer);clearTimeout(fadeTimer);perlicaPlayer?.stop();
  const allowed=motionAllowed()&&!document.hidden;
  stage.classList.toggle('motion-off',!allowed);stage.classList.toggle('background-off',config.motion.background===false);stage.classList.toggle('characters-off',config.motion.characters===false);
  display(current);
  if(!allowed||config.motion.characters===false)return;
  if(current===0)player().start();
  if(!fixed)timer=setTimeout(rotate,Math.max(3000,config.motion.intervalMs||12000));
 }
 function rotate(){
  if(!motionAllowed()||document.hidden||config.motion.characters===false)return;
  const next=1-current;
  // A failed or still-loading image never replaces a complete scene with blank space.
  if(ready(next)){
   current=next;if(current===0)player().start();display(current);
   if(current===1)fadeTimer=setTimeout(()=>perlicaPlayer?.stop(),config.motion.fadeMs||850);
  }
  timer=setTimeout(rotate,Math.max(3000,config.motion.intervalMs||12000));
 }
 layers.forEach(l=>l.style.transitionDuration=`${config.motion.fadeMs||850}ms`);
 // Decode both artwork scenes ahead of rotation, independently of the large CJK font.
 document.querySelectorAll('.character-poster,.amiya-scene img').forEach(img=>{if(img.decode)img.decode().then(()=>decodedImages.add(img)).catch(()=>{});else if(img.complete&&img.naturalWidth)decodedImages.add(img);else img.addEventListener('load',()=>decodedImages.add(img),{once:true});});
 renderContent();layout();optical();display(current);
 document.fonts.ready.then(()=>{optical();layout();stage.dataset.fontsReady='true';});
 document.fonts.addEventListener('loadingdone',()=>{optical();layout();});
 addEventListener('resize',layout);new ResizeObserver(layout).observe(document.querySelector('.notice'));
 reduced.addEventListener('change',resetMotion);document.addEventListener('visibilitychange',resetMotion);
 addEventListener('pagehide',()=>{clearTimeout(timer);clearTimeout(fadeTimer);perlicaPlayer?.stop();});addEventListener('pageshow',resetMotion);
 resetMotion();
})();

