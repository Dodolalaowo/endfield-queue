(() => {
 'use strict';
 const config=window.QUEUE_CONTENT, stage=document.querySelector('.canvas');
 const params=new URLSearchParams(location.search), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layers=[...document.querySelectorAll('.character-layer')];
 const fixed=['male','female'].includes(params.get('character'))?params.get('character'):null;
 let current=fixed==='female'?1:0, timer=0, fadeTimer=0;
 const frames=new Map();
 const fields={event:'.event',headerNote:'.header-note',title:'.title',label:'.label',dayLabel:'.day-label text',day:'.day-value text',number:'.number text',status:'.status span',noticeTag:'.notice-tag',noticeMain:'.notice-main',noticeSub:'.notice-sub'};
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
  const mobile=params.get('view')==='mobile'||(params.get('view')!=='tv'&&innerWidth<config.layout.breakpoint);
  stage.classList.toggle('mobile',mobile);
  const notice=document.querySelector('.notice');
  const width=mobile?360:1920,height=Math.max(mobile?640:1080,notice.offsetTop+notice.offsetHeight+(mobile?15:48));
  stage.style.height=`${height}px`;
  const scale=mobile?Math.min(innerWidth/width,config.layout.mobileMaxScale):Math.min(innerWidth/width,innerHeight/height);
  stage.style.transform=`scale(${scale})`;stage.style.left=`${Math.max(0,(innerWidth-width*scale)/2)}px`;
  stage.style.top=`${mobile?0:Math.max(0,(innerHeight-height*scale)/2)}px`;
  document.body.style.minHeight=`${Math.max(innerHeight,height*scale)}px`;
 }
 function motionAllowed(){return config.motion.enabled!==false&&params.get('motion')!=='off'&&!reduced.matches;}
 function makePlayer(layer){
  const canvas=layer.querySelector('canvas');
  const gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true});
  if(!gl){layer.dataset.videoState='poster';return null;}
  const shader=(kind,source)=>{const s=gl.createShader(kind);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader unavailable');return s;};
  let video,program;
  try{
   program=gl.createProgram();
   gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){ uv=vec2((p.x+1.0)*0.5,(1.0-p.y)*0.5);gl_Position=vec4(p,0.0,1.0); }'));
   gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec2 uv; uniform sampler2D frame; void main(){vec3 c=texture2D(frame,vec2(uv.x*0.5,uv.y)).rgb;float a=texture2D(frame,vec2(0.5+uv.x*0.5,uv.y)).r;gl_FragColor=vec4(c*a,a);}'));
   gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Video compositor unavailable');gl.useProgram(program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
   const pos=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
   const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
   video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.preload='metadata';video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.style.display='none';video.src=config.assets[layer.dataset.character];layer.append(video);
  }catch{layer.dataset.videoState='poster';return null;}
  let running=false,request=0,last=0,count=0,broken=false;
  function schedule(){if(!running)return;request=video.requestVideoFrameCallback?video.requestVideoFrameCallback(draw):requestAnimationFrame(draw);}
  function stop(){running=false;video.pause();if(video.cancelVideoFrameCallback)video.cancelVideoFrameCallback(request);else cancelAnimationFrame(request);}
  function fail(){broken=true;stop();layer.classList.remove('has-video');layer.dataset.videoState='poster';}
  function draw(time){
   if(!running)return;
   if(video.readyState>=2&&time-last>=(stage.classList.contains('mobile')?48:28)){
    try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);layer.classList.add('has-video');layer.dataset.videoState='playing';layer.dataset.frames=String(++count);last=time;}catch{fail();return;}
   }schedule();
  }
  async function start(){if(broken||running)return;running=true;try{await video.play();if(running)schedule();else video.pause();}catch{fail();}}
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();fail();});video.addEventListener('error',fail);
  return{start,stop};
 }
 function player(index){if(!frames.has(index))frames.set(index,makePlayer(layers[index]));return frames.get(index);}
 function display(index){layers.forEach((layer,i)=>layer.classList.toggle('is-active',i===index));stage.dataset.character=layers[index].dataset.character;}
 function resetMotion(){
  clearTimeout(timer);clearTimeout(fadeTimer);for(const p of frames.values())p?.stop();
  const allowed=motionAllowed()&&!document.hidden;
  stage.classList.toggle('motion-off',!allowed);stage.classList.toggle('background-off',config.motion.background===false);
  if(!allowed||config.motion.characters===false){layers.forEach(l=>l.classList.remove('has-video'));display(current);return;}
  display(current);player(current)?.start();if(!fixed)timer=setTimeout(rotate,Math.max(3000,config.motion.intervalMs||12000));
 }
 function rotate(){
  if(!motionAllowed()||document.hidden)return;
  const old=current;current=1-current;player(current)?.start();display(current);
  fadeTimer=setTimeout(()=>frames.get(old)?.stop(),config.motion.fadeMs||850);
  timer=setTimeout(rotate,Math.max(3000,config.motion.intervalMs||12000));
 }
 layers.forEach(l=>l.style.transitionDuration=`${config.motion.fadeMs||850}ms`);
 renderContent();layout();optical();display(current);
 document.fonts.ready.then(()=>{optical();layout();stage.dataset.fontsReady='true';});
 document.fonts.addEventListener('loadingdone',()=>{optical();layout();});
 addEventListener('resize',layout);new ResizeObserver(layout).observe(document.querySelector('.notice'));
 reduced.addEventListener('change',resetMotion);document.addEventListener('visibilitychange',resetMotion);addEventListener('pagehide',()=>{clearTimeout(timer);clearTimeout(fadeTimer);frames.forEach(p=>p?.stop());});addEventListener('pageshow',resetMotion);
 resetMotion();
})();
