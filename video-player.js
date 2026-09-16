// Packed RGB + alpha H.264 player. Posters stay visible until media advances.
window.createQueueVideoPlayer = function (layer, options) {
 'use strict';
 const canvas=layer.querySelector('canvas'),video=document.createElement('video');
 video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;
 video.setAttribute('muted','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
 video.preload='auto';video.className='video-decoder';video.setAttribute('aria-hidden','true');video.tabIndex=-1;
 layer.append(video);
 let gl,program,texture,buffer,shaders=[],active=false,terminal=false,recovering=false,pendingReload=false,generation=0,raf=0,watch=0,retryTimer=0;
 let attempts=0,count=0,lastMedia=-1,lastDraw=0,lastProgress=0,started=0,confirmed=0,source=options.src;
 const startupMs=options.startupMs||10000,stallMs=options.stallMs||4000;
 function state(name,reason=''){layer.dataset.videoState=name;layer.dataset.videoReason=reason;}
 function hide(){layer.classList.remove('has-video');}
 function halt(){cancelAnimationFrame(raf);clearInterval(watch);clearTimeout(retryTimer);video.pause();generation++;}
 function init(){
  gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:false});
  if(!gl)throw Error('webgl-unavailable');
  const shader=(kind,src)=>{const s=gl.createShader(kind);shaders.push(s);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('shader');return s;};
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=vec2((p.x+1.0)*0.5,(1.0-p.y)*0.5);gl_Position=vec4(p,0.0,1.0);}'));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec2 uv; uniform sampler2D frame; void main(){vec3 c=texture2D(frame,vec2(uv.x*0.5,uv.y)).rgb;float a=texture2D(frame,vec2(0.5+uv.x*0.5,uv.y)).r;gl_FragColor=vec4(c*a,a);}'));
  gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('link');gl.useProgram(program);
  buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const p=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.viewport(0,0,canvas.width,canvas.height);
 }
 function failure(reason,recoverable=true){
  if(!active||terminal||recovering)return;
  recovering=true;halt();hide();state('poster',reason);
  if(recoverable&&attempts<1){
   attempts++;layer.dataset.retries=String(attempts);source=options.fallbackSrc||source;pendingReload=true;
   retryTimer=setTimeout(()=>{if(!active)return;recovering=false;begin();},750);
  }else{terminal=true;active=false;state('fallback',reason);video.removeAttribute('src');video.load();}
 }
 function draw(now){
  if(!active||terminal)return;
  if(video.readyState>=2&&Math.abs(video.currentTime-lastMedia)>.001&&now-lastDraw>=1000/30-2){
   try{
    if(gl.isContextLost())throw Error('context-lost');
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    if(gl.getError()!==gl.NO_ERROR)throw Error('compositor');
    lastMedia=video.currentTime;lastDraw=now;lastProgress=now;confirmed++;
    layer.dataset.frames=String(++count);layer.dataset.mediaTime=lastMedia.toFixed(3);
    if(confirmed>=2){
     if(!layer.dataset.firstFrameMs)layer.dataset.firstFrameMs=String(Math.round(now-started));
     layer.classList.add('has-video');state('playing');
    }
   }catch{failure('compositor-failed',false);return;}
  }
  raf=requestAnimationFrame(draw);
 }
 function begin(){
  if(!active||terminal)return;
  const token=++generation;if(pendingReload){pendingReload=false;video.src=source;video.load();}confirmed=0;lastMedia=-1;lastDraw=0;started=lastProgress=performance.now();hide();state('loading');
  watch=setInterval(()=>{
   if(!active||terminal)return;
   const now=performance.now();
   if(confirmed<2&&now-started>startupMs)failure('first-frame-timeout');
   else if(confirmed>=2&&now-lastProgress>stallMs)failure('frame-stalled');
  },250);
  // Do not await play(): on some devices it can remain pending indefinitely.
  try{const result=video.play();result?.catch(error=>{if(active&&token===generation)failure(error.name==='NotAllowedError'?'autoplay-rejected':'play-rejected',error.name!=='NotAllowedError');});}
  catch{failure('play-rejected',false);return;}
  raf=requestAnimationFrame(draw);
 }
 try{init();video.src=source;state('poster');}catch{terminal=true;state('fallback','webgl-unavailable');}
 video.addEventListener('error',()=>failure('media-error'));
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();failure('context-lost',false);});
 return {
  start(){if(terminal||active)return;active=true;begin();},
  stop(){active=false;recovering=false;halt();hide();if(!terminal)state('paused');},
  destroy(){active=false;terminal=true;halt();hide();video.removeAttribute('src');video.load();video.remove();if(gl&&!gl.isContextLost()){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));}},
 };
};
