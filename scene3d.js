/* Opaque 3D geometry. WebGL depth testing resolves visibility per pixel. */
(()=>{
 const surface=document.createElement('canvas');surface.id='objects3d';surface.setAttribute('aria-hidden','true');document.querySelector('#world').after(surface);
 const gl=surface.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});
 const fallback=gl?null:surface.getContext('2d');
 if(!gl&&!fallback){window.labor3D=null;return;}
 if(gl){
 const shader=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s};
 const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,'attribute vec3 position; attribute vec3 color; varying vec3 vColor; void main(){gl_Position=vec4(position,1.0);vColor=color;}'));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,'precision mediump float; varying vec3 vColor; void main(){gl_FragColor=vec4(vColor,1.0);}'));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);for(const [name,offset] of [['position',0],['color',12]]){let a=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,3,gl.FLOAT,false,24,offset)}gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.BLEND);
 }
 const C={wood:'#b7865b',edge:'#243e49',teal:'#54848b',metal:'#afc1bc',paper:'#e9dfc7',gold:'#dfa460',screen:'#173846',ink:'#315562',cream:'#f4ebd7'};
 let faces=[];
 const rgb=(s,k)=>{let n=parseInt(s.slice(1),16);return[(n>>16&255)/255*k,(n>>8&255)/255*k,(n&255)/255*k]};
 const face=(points,color,k=1)=>faces.push({p:points,c:rgb(color,k)});
 function box(x,y,z,w,h,d,color){let p=(a,b,c)=>[a,b,c];face([p(x,y,z+d),p(x+w,y,z+d),p(x+w,y+h,z+d),p(x,y+h,z+d)],color,.84);face([p(x+w,y,z),p(x+w,y,z+d),p(x+w,y+h,z+d),p(x+w,y+h,z)],color,.63);face([p(x,y+h,z),p(x+w,y+h,z),p(x+w,y+h,z+d),p(x,y+h,z+d)],color,1);face([p(x,y,z),p(x,y+h,z),p(x,y+h,z+d),p(x,y,z+d)],color,.7);face([p(x,y,z),p(x+w,y,z),p(x+w,y+h,z),p(x,y+h,z)],color,.74);}
 function cylinder(x,y,z,r,h,color){for(let i=0;i<24;i++){let a=i*Math.PI/12,b=(i+1)*Math.PI/12;let p=[x+Math.cos(a)*r,y,z+Math.sin(a)*r],q=[x+Math.cos(b)*r,y,z+Math.sin(b)*r];face([p,q,[q[0],y+h,q[2]],[p[0],y+h,p[2]]],color,.72+.15*Math.cos(a));face([[x,y+h,z],[p[0],y+h,p[2]],[q[0],y+h,q[2]]],color);}}
 function desk(){for(let x of [-4.25,3.9])for(let z of [-1.9,1.65])box(x,-3.2,z,.34,3.2,.34,C.edge);box(-4.6,0,-2.25,9.2,.32,4.8,C.wood);box(-4.35,-.65,-2.05,8.7,.6,.2,C.edge);box(-4.35,-.65,2.1,8.7,.6,.2,C.edge);}
 function laptop(x=-2,y=.33,z=-1.8,scale=1){const b=(a,c,d,w,h,l,col)=>box(x+a*scale,y+c*scale,z+d*scale,w*scale,h*scale,l*scale,col);b(0,0,0,3.9,.16,2.65,C.metal);b(.15,.16,.12,3.6,2.55,.18,C.edge);b(.32,.36,.305,3.26,2.12,.035,C.screen);b(.55,1.98,.35,2.7,.09,.025,C.teal);b(.55,1.65,.35,1.8,.08,.025,C.paper);b(.55,1.36,.35,2.3,.08,.025,C.paper);b(.55,.71,.35,.65,.37,.025,C.gold);b(1.35,.71,.35,1.8,.08,.025,C.teal);for(let i=0;i<4;i++)for(let j=0;j<10;j++)b(.32+j*.32,.17,.65+i*.26,.23,.035,.17,C.ink);b(1.3,.17,1.92,1.3,.018,.42,C.ink);b(1.55,2.55,.32,.18,.06,.025,C.metal);}
 function toolbox(x=-3.5,y=.33,z=-.5,s=1){const b=(a,c,d,w,h,l,col)=>box(x+a*s,y+c*s,z+d*s,w*s,h*s,l*s,col);b(0,0,0,2.8,1.2,1.65,C.gold);b(-.05,1.2,-.05,2.9,.22,1.75,C.wood);b(.75,1.42,.6,.16,.5,.3,C.edge);b(1.9,1.42,.6,.16,.5,.3,C.edge);b(.75,1.91,.6,1.31,.16,.3,C.edge);b(.4,.85,1.66,.23,.5,.045,C.metal);b(2.2,.85,1.66,.23,.5,.045,C.metal);b(.12,.18,1.66,2.56,.08,.04,C.wood);}
 function notebook(x=.8,y=.33,z=.3){box(x,y,z,2.2,.12,1.65,C.ink);box(x+.06,y+.12,z+.04,2.08,.055,1.54,C.paper);for(let i=0;i<5;i++)box(x+.25,y+.18,z+.26+i*.22,1.6,.012,.025,C.teal);box(x-.2,y+.12,z+.05,.08,.08,1.5,C.gold);}
 function parcel(x,y,z,w,h,d){box(x,y,z,w,h,d,C.wood);box(x+w*.43,y+h+.012,z,w*.13,.018,d,C.paper);box(x+w*.43,y,z+d+.012,w*.13,h,.018,C.paper);box(x+w*.66,y+h*.28,z+d+.035,w*.25,h*.35,.018,C.cream);for(let i=0;i<5;i++)box(x+w*.69+i*w*.035,y+h*.34,z+d+.058,w*.015,h*.2,.012,C.ink);}
 function mug(x,y,z){cylinder(x,y,z,.32,.65,C.teal);cylinder(x,y+.65,z,.25,.008,C.edge);box(x+.28,y+.15,z-.08,.27,.12,.16,C.teal);box(x+.48,y+.15,z-.08,.1,.38,.16,C.teal);box(x+.28,y+.49,z-.08,.27,.12,.16,C.teal);}
 function chair(){box(.5,-1.25,-4.4,2.2,.25,1.8,C.teal);box(.5,-1,-4.5,2.2,2.2,.23,C.teal);cylinder(1.6,-3.2,-3.5,.13,1.95,C.metal);box(.6,-3.15,-3.7,2,.12,.25,C.edge);box(1.48,-3.15,-4.5,.25,.12,2,C.edge);}
 function agenda(){desk();box(-3.8,.33,-1.25,4,.15,2.9,C.ink);box(-3.7,.48,-1.15,1.84,.07,2.7,C.paper);box(-1.78,.48,-1.15,1.84,.07,2.7,C.cream);for(let row=0;row<4;row++)for(let col=0;col<3;col++)box(-3.45+col*.5,.56,-.7+row*.47,.35,.015,.29,row===2&&col===1?C.gold:C.teal);for(let i=0;i<6;i++)box(-1.51,.56,-.75+i*.34,1.3,.01,.025,C.teal);for(let i=0;i<6;i++)cylinder(-1.82,.53,-.91+i*.43,.06,.08,C.metal);notebook(1,.33,.1);mug(2.65,.33,-1.2);}
 function phone(){box(-1.55,-1.8,-.2,3.1,6,.32,C.edge);box(-1.37,-1.57,.135,2.74,5.51,.035,C.paper);box(-.3,3.71,.18,.6,.09,.02,C.edge);box(-1.1,3.16,.18,2.15,.19,.02,C.ink);box(-1.1,2.6,.18,1.4,.1,.02,C.teal);for(let i=0;i<3;i++){let y=1.48-i*.95;box(-1.12,y,.18,2.24,.71,.025,i===1?C.teal:C.gold);box(-.93,y+.42,.21,1.45,.055,.012,C.paper);box(-.93,y+.23,.21,1.05,.04,.012,C.paper);}box(-.45,-1.35,.18,.9,.05,.02,C.ink);parcel(2,-1.8,.2,2,1.6,1.9);parcel(-3.9,-1.8,.8,1.6,1.1,1.5);}

 function transform(fn,tx=0,ty=0,tz=0,rz=0,scale=1){const begin=faces.length;fn();for(let i=begin;i<faces.length;i++)faces[i].p=faces[i].p.map(([x,y,z])=>[(x*Math.cos(rz)-y*Math.sin(rz))*scale+tx,(x*Math.sin(rz)+y*Math.cos(rz))*scale+ty,z*scale+tz]);}
 function beam(a,b,r,color){const v=b.map((n,i)=>n-a[i]),l=Math.hypot(...v),u=v.map(n=>n/l),ref=Math.abs(u[1])<.9?[0,1,0]:[1,0,0];let n=[u[1]*ref[2]-u[2]*ref[1],u[2]*ref[0]-u[0]*ref[2],u[0]*ref[1]-u[1]*ref[0]],nl=Math.hypot(...n);n=n.map(x=>x/nl);let q=[u[1]*n[2]-u[2]*n[1],u[2]*n[0]-u[0]*n[2],u[0]*n[1]-u[1]*n[0]];const p=(base,t)=>base.map((x,i)=>x+r*(Math.cos(t)*n[i]+Math.sin(t)*q[i]));for(let j=0;j<16;j++){let t=j*Math.PI/8,t2=(j+1)*Math.PI/8;face([p(a,t),p(a,t2),p(b,t2),p(b,t)],color,.7+.2*Math.cos(t));face([b,p(b,t),p(b,t2)],color);}}
 function hammer(){
 // Familiar carpenter's hammer: slender handle, compact steel head and tapered claw.
 box(-.12,0,-.11,.24,3.5,.22,C.wood);
 box(-.15,.05,-.14,.30,.85,.28,C.ink);
 box(-.48,3.23,-.24,.86,.48,.48,C.metal);
 beam([-.48,3.47,0],[-.82,3.47,0],.26,C.metal);
 for(const z of [-.18,.08]){face([[.35,3.7,z],[.95,3.47,z],[1.12,3.13,z],[.65,3.38,z]],C.metal);face([[.35,3.7,z+.1],[.95,3.47,z+.1],[1.12,3.13,z+.1],[.65,3.38,z+.1]],C.metal,.7);}
}
 function clock(){beam([0,0,-.18],[0,0,.12],2.1,C.gold);beam([0,0,.13],[0,0,.16],1.9,C.paper);for(let i=0;i<12;i++){let a=i*Math.PI/6;beam([Math.sin(a)*1.58,Math.cos(a)*1.58,.2],[Math.sin(a)*1.77,Math.cos(a)*1.77,.2],.035,C.ink)}beam([0,0,.25],[.8,.8,.25],.065,C.ink);beam([0,0,.27],[-.9,.2,.27],.045,C.ink);beam([0,0,.29],[0,0,.32],.13,C.gold);}
 function receipt(){box(-1.2,0,-.12,2.4,4.3,.18,C.paper);box(-.95,3.72,.08,1.9,.17,.025,C.ink);for(let i=0;i<5;i++)box(-.93,3.18-i*.43,.08,i%2?1.2:1.8,.07,.025,C.teal);box(-.93,.72,.08,1.8,.04,.025,C.ink);box(.05,.37,.08,.8,.12,.025,C.gold);for(let i=0;i<8;i++)box(-1.2+i*.3,-.13,-.12,.17,.13,.18,C.paper);}
 function bench(){box(-4.3,-.55,-1.7,8.6,.55,3.9,C.wood);box(-4.3,-.65,-1.7,8.6,.1,3.9,C.edge);}
 function rule(){box(-3.9,.03,1.55,7.6,.08,.3,C.paper);for(let i=0;i<30;i++)box(-3.7+i*.24,.115,1.56,.018,.012,i%5===0?.22:.12,C.ink);}
 function practical(){bench();transform(hammer,-1.6,.02,-.1,-.40,.95);toolbox(.25,.02,-1.1,.95);rule();beam([-3.2,.1,.8],[-2,.1,.8],.09,C.metal);box(-3.6,.01,.65,.5,.22,.3,C.gold);}
 function badge(){box(-.9,0,-.1,1.8,2.5,.2,C.paper);box(-.9,2.1,.11,1.8,.4,.025,C.teal);beam([0,1.42,.14],[0,1.42,.16],.29,C.gold);box(-.5,.55,.14,1,.43,.025,C.ink);box(-.6,.25,.14,1.2,.05,.025,C.teal);beam([-.5,2.51,0],[0,3.5,0],.06,C.gold);beam([0,3.5,0],[.5,2.51,0],.06,C.gold);}
 function fork(){box(-.8,-.35,1.3,1.6,.25,2.6,C.paper);face([[-.8,-.1,1.3],[.8,-.1,1.3],[3.3,-.1,-1.3],[1.7,-.1,-1.3]],C.teal);face([[-.8,-.1,1.3],[.8,-.1,1.3],[-1.7,-.1,-1.3],[-3.3,-.1,-1.3]],C.gold);box(-4,-.35,-3,3.2,.25,2.3,C.gold);box(1.1,-.35,-3,3.2,.25,2.3,C.teal);box(-.9,-.35,-2.6,2,.25,.6,C.paper);toolbox(-3.6,-.09,-2.7,.85);transform(badge,2.7,-.08,-2.1,0,.85);}
 const cache={};function build(key){if(cache[key])return cache[key];faces=[];
 if(key==='cover'){desk();laptop(-.15,.33,-1.8,.96);toolbox(-3.8,.33,.15,.85);}
 if(key==='tools')transform(hammer,0,0,0,-.23,1);
 if(key==='night'){box(-1.55,-1.8,-.2,3.1,6,.32,C.edge);box(-1.37,-1.57,.135,2.74,5.51,.035,C.paper);box(-.3,3.71,.18,.6,.09,.02,C.edge);for(let i=0;i<3;i++){let y=1.48-i*.95;box(-1.12,y,.18,2.24,.71,.025,i===1?C.teal:C.gold);box(-.93,y+.42,.21,1.45,.055,.012,C.paper);box(-.93,y+.23,.21,1.05,.04,.012,C.paper);}}
 return cache[key]=faces;
 }
 let lastW=0,lastH=0;
 window.labor3D={surface,render(key,opt){
  const {width:W,height:H,dpr,centerX,centerY,stageHeight,angle,opacity}=opt;
  surface.style.opacity=opacity;surface.style.visibility=key?'visible':'hidden';if(!key)return;
  const w=Math.round(W*dpr),h=Math.round(H*dpr);
  if(w!==lastW||h!==lastH){surface.width=w;surface.height=h;lastW=w;lastH=h;}
  const geometry=build(key),ca=Math.cos(angle),sa=Math.sin(angle);
  const project=p=>[p[0]*ca-p[2]*sa,(p[0]*sa+p[2]*ca)*.44-p[1],p[0]*sa+p[2]*ca+p[1]*.44];
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  const projected=geometry.map(f=>({p:f.p.map(p=>{const q=project(p);minX=Math.min(minX,q[0]);maxX=Math.max(maxX,q[0]);minY=Math.min(minY,q[1]);maxY=Math.max(maxY,q[1]);return q;}),c:f.c}));
  if(!projected.length)return;
  const maxWidth=W*(stageHeight?.83:.43),maxHeight=stageHeight?(stageHeight-56)*.73:H*(key==='tools'?.30:.58);
  const scale=Math.min(maxWidth/(maxX-minX),maxHeight/(maxY-minY));
  const mx=(minX+maxX)/2,my=(minY+maxY)/2;
  if(gl){
   gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clearDepth(1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
   const data=[];for(const f of projected)for(let i=1;i<f.p.length-1;i++)for(const q of [f.p[0],f.p[i],f.p[i+1]])data.push(((q[0]-mx)*scale+centerX)/W*2-1,1-((q[1]-my)*scale+centerY)/H*2,-q[2]/40,...f.c);
   gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.drawArrays(gl.TRIANGLES,0,data.length/6);
  }else{
   // Painter fallback: same scene geometry and framing; opacity belongs to the canvas, never to individual faces.
   fallback.setTransform(dpr,0,0,dpr,0,0);fallback.globalAlpha=1;fallback.clearRect(0,0,W,H);
   const depth=f=>f.p.reduce((sum,p)=>sum+p[2],0)/f.p.length;
   projected.sort((a,b)=>depth(a)-depth(b));
   for(const f of projected){fallback.beginPath();f.p.forEach((p,i)=>fallback[i?'lineTo':'moveTo']((p[0]-mx)*scale+centerX,(p[1]-my)*scale+centerY));fallback.closePath();fallback.fillStyle='rgb('+f.c.map(v=>Math.round(Math.max(0,Math.min(1,v))*255)).join(',')+')';fallback.fill();}
  }
 },inspect(){return {renderer:gl?'webgl':'canvas2d',depthTest:gl?gl.isEnabled(gl.DEPTH_TEST):false,error:gl?gl.getError():0,scenes:Object.keys(cache)}}};
})();
