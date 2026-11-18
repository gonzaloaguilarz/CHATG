const canvas=document.querySelector('#world'),ctx=canvas.getContext('2d');
let W,H,dpr,scroll=0,chapter=-1,path='op',night=0,mouse=0,mouseTarget=0;let years={1:2026,5:2026},balance='total',view='ring',shift='night',weights=Array(8).fill(0),focusX=.75,ratioNow=.255;let targetFrame=0,sceneAlpha=1,lastTime=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sections=[...document.querySelectorAll('.chapter')],label=document.querySelector('#viz-label');
const lerp=(a,b,t)=>a+(b-a)*t,clamp=x=>Math.max(0,Math.min(1,x));
const units=Array.from({length:1000},(_,i)=>({seed:((i*177+31)%997)/997}));
const blocks=Array.from({length:121},(_,i)=>({x:(i%11-5)*1.65,z:(Math.floor(i/11)-5)*1.65,seed:((i*713+31)%997)/997}));
let angle=.55,size=25,cx,cy;
function resize(){dpr=Math.min(devicePixelRatio,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}addEventListener('resize',resize);resize();
addEventListener('pointermove',e=>mouseTarget=(e.clientX/W-.5)*.12);
function project(x,y,z){return[cx+(x*Math.cos(angle)-z*Math.sin(angle))*size,cy+(x*Math.sin(angle)+z*Math.cos(angle))*size*.44-y*size]}
function poly(points,color,alpha=1){ctx.globalAlpha=alpha*sceneAlpha;ctx.beginPath();points.forEach((p,i)=>ctx[i?'lineTo':'moveTo'](...p));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.globalAlpha=sceneAlpha}
function cube(x,z,h,seed,opacity){let warm=seed>.72;const c=warm?['#9b663d','#69482f','#e5b57a']:['#38616c','#254854','#83a9ad'];const p=(a,b,d)=>project(a,b,d);poly([p(x,0,z),p(x+1,0,z),p(x+1,h,z),p(x,h,z)],c[0],opacity);poly([p(x+1,0,z),p(x+1,0,z+1),p(x+1,h,z+1),p(x+1,h,z)],c[1],opacity);poly([p(x,h,z),p(x+1,h,z),p(x+1,h,z+1),p(x,h,z+1)],c[2],opacity);
 for(let floor=.35;floor<h-.2;floor+=.57){for(let col=.16;col<.9;col+=.36){const lit=(Math.floor(floor*10)+Math.floor(seed*100)+Math.floor(col*10))%3;poly([p(x+col,floor,z-.005),p(x+col+.17,floor,z-.005),p(x+col+.17,floor+.23,z-.005),p(x+col,floor+.23,z-.005)],lit?'#efc586':'#17313e',opacity*(lit?.5+night*.45:.7));}}
 if(h<2.1){poly([p(x-.08,.55,z-.18),p(x+1.08,.55,z-.18),p(x+1.08,.8,z),p(x-.08,.8,z)],warm?'#e8af71':'#99b4ae',opacity);}
}
function box(x,y,z,w,h,d,colors){const p=(a,b,c)=>project(a,b,c);poly([p(x,y,z+d),p(x+w,y,z+d),p(x+w,y+h,z+d),p(x,y+h,z+d)],colors[0]);poly([p(x+w,y,z),p(x+w,y,z+d),p(x+w,y+h,z+d),p(x+w,y+h,z)],colors[1]);poly([p(x,y+h,z),p(x+w,y+h,z),p(x+w,y+h,z+d),p(x,y+h,z+d)],colors[2]);}
const gold=['#bc8353','#86603f','#efc28e'],blue=['#416f7a','#294c59','#8cb5b7'],paper=['#c7c3ae','#969c92','#f3ebd5'],dark=['#172c3a','#10212e','#345364'];
function text(t,x,y,font='14px Arial',color='#e8d1ad'){ctx.font=font;ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(t,x,y)}
function line(a,b,color,width=2){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()}
function desk(){box(-4,0,-2,8,.25,4,blue);for(const x of [-3.6,3.3])for(const z of [-1.6,1.3])box(x,-3,z,.25,3,.25,dark);}
function laptop(){box(-2,.25,-1,4,.17,2.5,dark);box(-2,.42,1.05,4,2.5,.14,dark);poly([project(-1.8,.65,1.20),project(1.8,.65,1.20),project(1.8,2.7,1.20),project(-1.8,2.7,1.20)],'#63919b');for(let i=0;i<4;i++)line(project(-1.45,1+i*.35,1.21),project(i%2?.5:1.4,1+i*.35,1.21),'#c2dbd2',2);for(let i=0;i<4;i++)for(let j=0;j<9;j++)box(-1.7+j*.36,.43,-.7+i*.35,.22,.025,.18,blue);}
function packages(){box(-3,.25,-.8,2.6,2.1,2.5,gold);box(.2,.25,-1,2.5,1.3,2.2,paper);box(.6,1.55,-.8,1.8,1.65,1.8,gold);box(-1.9,2.36,-.8,.35,.02,2.5,paper);box(1.3,3.21,-.8,.25,.02,1.8,paper);}
function toolsScene(){size*=1.4;desk();box(-3,.25,-1.1,3,1.25,2,gold);box(-2.2,1.5,-.5,1.3,.18,.35,dark);box(-2.2,1.5,-.5,.15,.55,.35,dark);box(-1,1.5,-.5,.15,.55,.35,dark);box(-2.2,2,-.5,1.35,.15,.35,dark);box(.5,.27,-.8,2.5,.1,2,paper);for(let i=0;i<4;i++)line(project(.8,.39,-.45+i*.38),project(2.65,.39,-.45+i*.38),'#7b989c',1.4);box(-.6,.3,1,3,.1,.17,blue);box(2.15,.3,.75,.5,.15,.7,blue);}
function city(time){poly([project(-10,0,-10),project(10,0,-10),project(10,0,10),project(-10,0,10)],'#152e39');for(let i=-5;i<=6;i++){let n=i*1.65-.35;line(project(n,0,-10),project(n,0,10),'#54717a',.5);line(project(-10,0,n),project(10,0,n),'#54717a',.5)}const sorted=[...blocks].sort((a,b)=>(a.x*Math.sin(angle)+a.z*Math.cos(angle))-(b.x*Math.sin(angle)+b.z*Math.cos(angle)));for(const b of sorted)cube(b.x,b.z,.9+b.seed*b.seed*5.6,b.seed,1);for(let i=0;i<14;i++){let t=((reduced?i*.83:time*.0003+i*.83)%18)-9;let p=project(t,.08,(i%5-2)*3.3-.35);ctx.fillStyle='#eecb8b';ctx.fillRect(p[0],p[1],3,2)}}
function grid(ratio){let cell=Math.min(W*(W<750?.021:.011),H*.023),ox=cx-20*cell,oy=cy-12.5*cell;for(let i=0;i<1000;i++){ctx.fillStyle=i<Math.round(ratio*1000)?'#efb774':'#3b5960';ctx.fillRect(ox+i%40*cell,oy+Math.floor(i/40)*cell,cell*.72,cell*.72)}text((ratio*100).toFixed(1).replace('.',',')+'%',cx,oy-28,(W<750?36:60)+'px Georgia');}
function bars(){let unit=Math.min(W*.0016,H*.00115),x0=cx-150*unit;let values=[[-157800,'Asalariados','#e6ad70'],[balance==='mono'?73100:31400,balance==='mono'?'Monotributo':'Independientes','#88b1b4']];values.forEach(([n,name,color],i)=>{let y=cy-70+i*125;let width=Math.abs(n)/157800*300*unit;ctx.fillStyle=color;ctx.fillRect(x0,y,width,38);text(name,x0+150*unit,y-17,'13px Arial');text((n>0?'+':'−')+Math.abs(n).toLocaleString('es-AR'),x0+150*unit,y+73,'28px Georgia')});}
function phoneScene(){size*=1.45;if(shift==='day'){desk();laptop();return}box(-1.8,-1.2,-.7,3.6,6,.35,dark);poly([project(-1.6,-.9,-.34),project(1.6,-.9,-.34),project(1.6,4.5,-.34),project(-1.6,4.5,-.34)],'#a4beb9');for(let i=0;i<3;i++){poly([project(-1.3,.1+i*1.25,-.33),project(1.3,.1+i*1.25,-.33),project(1.3,1+i*1.25,-.33),project(-1.3,1+i*1.25,-.33)],i%2?'#395f6c':'#e6b781');}box(2.2,-1.5,-1,2,1.4,2,gold);box(-4,-1.5,0,1.5,.8,1.5,paper);text('CONSULTAS · PEDIDOS · VENTAS',cx,cy+size*3,'11px Arial');}
function ring(r){let radius=Math.min(W*(W<750?.19:.12),H*.21);ctx.lineWidth=radius*.24;ctx.strokeStyle='#3b5960';ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#efb774';ctx.beginPath();ctx.arc(cx,cy,radius,-Math.PI/2,-Math.PI/2+Math.PI*2*r);ctx.stroke();text((r*100).toFixed(1).replace('.',',')+'%',cx,cy+12,(W<750?38:58)+'px Georgia');text('INFORMALES',cx,cy+43,'11px Arial');}
function door(){size*=1.4;box(-3,-2,-.5,.4,7,.6,blue);box(2.6,-2,-.5,.4,7,.6,blue);box(-3,4.6,-.5,6,.4,.6,blue);box(-3,-2,-.5,6,.15,3,paper);poly([project(-2.5,-1.9,-.6),project(2.5,-1.9,-.6),project(2.5,4.5,-.6),project(-2.5,4.5,-.6)],'#dfb782');line(project(-1.5,-1.8,-.7),project(-1.5,4.4,-.7),'#f3dca7',2);}

// Editorial diagrams. Equal-sized nodes do not encode statistical magnitudes.
function flatStory(key){
 const mobile=W<750, scale=Math.min(W*(mobile?.86:.41)/480,H*(mobile?.30:.51)/330);
 ctx.save();ctx.translate(cx,cy);ctx.scale(scale,scale);
 const ink='#f0e5cf',muted='#9ab6b8',gold='#efb774';
 const label=(t,x,y,n=16,c=ink)=>text(t,x,y,Math.max(n,mobile?15:0)+'px Arial',c);
 const card=(x,y,w,h,title,sub,active=true)=>{ctx.fillStyle=active?'#31545e':'#1b3641';ctx.strokeStyle=active?gold:'#567780';ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(x,y,w,h,12);ctx.fill();ctx.stroke();label(title,x+w/2,y+30,18,active?gold:muted);if(sub)label(sub,x+w/2,y+55,13,ink)};
 const arrow=(x,y,x2,y2)=>{line([x,y],[x2,y2],muted,2);let a=Math.atan2(y2-y,x2-x);line([x2,y2],[x2-9*Math.cos(a-.5),y2-9*Math.sin(a-.5)],muted,2);line([x2,y2],[x2-9*Math.cos(a+.5),y2-9*Math.sin(a+.5)],muted,2)};
 if(key==='op'){
  label('CON QUÉ SE EMPIEZA',0,-145,12,muted);
  card(-222,-110,140,75,'Formación','Saber hacer');card(-70,-110,140,75,'Contactos','Llegar a otros');card(82,-110,140,75,'Clientes','Encontrar demanda');
  [-152,0,152].forEach(x=>arrow(x,-25,x*.45,45));card(-160,55,320,75,'Un proyecto propio','Recursos para aprovechar una oportunidad');
 }
 if(key==='need'){
  label('CUANDO HAY MENOS MARGEN',0,-145,12,muted);
  card(-210,-110,420,72,'Gastos que no esperan','Necesidades del mes');arrow(0,-27,0,8);
  card(-210,20,420,72,'Conseguir un ingreso','Vender productos o prestar servicios');
  label('La urgencia condiciona el punto de partida',0,135,15,muted);
 }
 if(key==='day'){
  label('EL TRABAJO SE EXTIENDE',0,-130,12,muted);
  card(-220,-75,195,95,'Empleo','Primera jornada');arrow(-15,-30,25,-30);card(35,-75,185,95,'Otra actividad','Completar ingresos');
  label('Una secuencia, no un reparto de horas',0,90,15,muted);
 }
 if(key==='plan'){
  label('QUÉ PUEDE FAVORECER LA CONTRATACIÓN',0,-145,12,muted);
  card(-225,-110,215,100,'Santiago Poy','Ventas y mercados',lens==='poy');card(10,-110,215,100,'Roberto Larco','Reglas y pymes',lens==='larco');
  arrow(-115,0,-55,60);arrow(115,0,55,60);card(-180,70,360,75,'Más posibilidades de trabajar','Perspectivas de los entrevistados');
 }
 ctx.restore();
}

let lens='poy';let symbol='all';let renderKey='cover',pendingKey='cover',switchTime=0,lastSignature='';
function draw(time=0){if(document.hidden||document.body.classList.contains('reading')){lastTime=time;targetFrame=requestAnimationFrame(draw);return}const ease=1-Math.exp(-Math.max(16,time-lastTime)/170);lastTime=time;scroll=reduced?scrollY:lerp(scroll,scrollY,ease);let active=-1;sections.forEach((el,i)=>{if(scroll+H*.42>=el.offsetTop)active=i});if(active!==chapter){chapter=active;updateLabel()}
 const targetKey=chapter<0?'cover':chapter===0?'tools':chapter===1?'grid':chapter===2?'bars':chapter===3?path:chapter===4?shift:chapter===5?'informal':'plan';
 if(targetKey!==pendingKey){pendingKey=targetKey;switchTime=time}let age=time-switchTime;const fade=reduced?1:Math.min(1,Math.abs(age-120)/120);if(age>=120||reduced)renderKey=pendingKey;
 const signature=[renderKey,Math.round(scroll*10),W,H,dpr,years[1],years[5],balance,view,shift,path,symbol,lens].join('|');if(signature===lastSignature&&age>350&&Math.abs(scroll-scrollY)<.1){targetFrame=requestAnimationFrame(draw);return}lastSignature=signature;const left=['grid','op','need','informal'].includes(renderKey);focusX=left?.265:.745;
 ctx.globalAlpha=1;ctx.clearRect(0,0,W,H);let bg=ctx.createRadialGradient(W*focusX,H*.4,0,W*.5,H*.5,W*.85);bg.addColorStop(0,renderKey==='night'?'#283544':'#25454f');bg.addColorStop(1,'#091721');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 cx=W<750?W*.5:W*focusX;cy=H*(W<750?.245:renderKey==='tools'?.61:.49);size=Math.min(W*(W<750?.05:.025),H*.038);angle=.49+(reduced?0:Math.sin(scroll/2400)*.045);
 const isChart=['grid','bars','informal','op','need','day','plan'].includes(renderKey);if(window.labor3D)window.labor3D.render(isChart?null:renderKey,{width:W,height:H,dpr,centerX:cx,centerY:cy,angle,opacity:fade});
 ctx.save();ctx.globalAlpha=fade;
 if(renderKey==='grid')grid(years[1]===2025?.237:.255);if(renderKey==='bars')bars();if(renderKey==='informal'){let r=years[5]===2025?.624:.658;view==='ring'?ring(r):grid(r)}
 if(['op','need','day','plan'].includes(renderKey))flatStory(renderKey);
 if(!window.labor3D&&!isChart){sceneAlpha=1;if(renderKey==='tools')toolsScene();else if(renderKey==='night')phoneScene();else {desk();laptop();}}
 ctx.restore();document.querySelector('#progress').style.width=100*scroll/Math.max(1,document.body.scrollHeight-H)+'%';targetFrame=requestAnimationFrame(draw);
}
function updateLabel(){document.querySelector('#position').textContent=chapter<0?'INICIO':('0'+(chapter+1))+' / 07';const captions={
 '-1':'',0:'Un martillo de carpintero: aprender un oficio es una forma de construir una actividad propia.',3:path==='op'?'Formación, contactos y clientes: recursos que pueden abrir una oportunidad.':'La necesidad de cubrir gastos acorta el margen para esperar. Esquema de la interpretación de Poy.',4:shift==='night'?'Un teléfono con consultas: ofrecer, responder y vender prolonga el trabajo después del empleo.':'Una jornada de empleo puede continuar con otra actividad para completar ingresos. Secuencia conceptual, sin duración medida.',6:'Dos perspectivas sobre la contratación: Poy destaca las ventas; Larco, las reglas y el acompañamiento a las pymes.'};
 label.innerHTML=chapter===1?'CUENTAPROPISTAS / TOTAL DE OCUPADOS<br>II trimestre · '+years[1]:chapter===5?'INFORMALIDAD / CUENTAPROPISTAS<br>II trimestre · '+years[5]:chapter===2?'VARIACIÓN NETA · AGOSTO 2025–2026<br>Personas registradas · misma escala':captions[chapter]?(captions[chapter]+'<small>Ilustración conceptual basada en la nota</small>'):'';document.body.dataset.chapter=chapter;document.body.dataset.side=[1,3,5].includes(chapter)?'left':'right';}
 document.querySelectorAll('[data-year]').forEach(b=>b.onclick=()=>{let id=b.dataset.chart;years[id]=+b.dataset.year;document.querySelectorAll('[data-year]').forEach(c=>{if(c.dataset.chart===id)c.setAttribute('aria-pressed',c===b)});document.querySelector('#result'+id).textContent=years[id]+' · '+(id==='1'?(years[id]===2025?'23,7':'25,5')+'% de la población ocupada':(years[id]===2025?'62,4':'65,8')+'% de los cuentapropistas eran informales');updateLabel()});
 function group(name,fn){document.querySelectorAll('[data-'+name+']').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-'+name+']').forEach(c=>c.setAttribute('aria-pressed',c===b));fn(b.dataset[name]);updateLabel()})}
 group('path',v=>{path=v;document.querySelector('.choice').textContent=v==='op'?'Formación, herramientas y contactos: recursos para un proyecto propio.':'La urgencia de obtener ingresos deja menos margen para esperar resultados.'});
 group('balance',v=>{balance=v;document.querySelector('#balance-result').textContent='−157.800 asalariados · '+(v==='mono'?'+73.100 monotributistas':'+31.400 independientes')});group('view',v=>view=v);group('shift',v=>{shift=v;document.querySelector('#shift-result').textContent=v==='day'?'Un empleo que se mantiene, pero cuyos ingresos no alcanzan.':'Mostrar productos, responder consultas y preparar pedidos.'});
 document.querySelector('#next').onclick=()=>sections[Math.min(chapter+1,6)].scrollIntoView();document.querySelector('#prev').onclick=()=>chapter<=0?scrollTo({top:0,behavior:reduced?'auto':'smooth'}):sections[chapter-1].scrollIntoView();const reading=document.querySelector('#reading');const background=[...document.body.children].filter(el=>el!==reading&&el.tagName!=='SCRIPT');document.querySelector('#read').onclick=()=>{reading.hidden=false;background.forEach(el=>el.inert=true);document.body.classList.add('reading');document.querySelector('#closeRead').focus()};document.querySelector('#closeRead').onclick=()=>{reading.hidden=true;background.forEach(el=>el.inert=false);document.body.classList.remove('reading');lastSignature='';document.querySelector('#read').focus()};addEventListener('keydown',e=>{if(e.key==='Escape'&&!reading.hidden)document.querySelector('#closeRead').click();if(e.key==='Tab'&&!reading.hidden){e.preventDefault();document.querySelector('#closeRead').focus()}});
 if(!reduced&&'IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('visible',entry.isIntersecting)),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('animate');observer.observe(el)})}updateLabel();requestAnimationFrame(draw);

group('lens',v=>{lens=v;document.body.dataset.lens=v;document.querySelector('#lens-result').textContent=v==='poy'?'Poy pone el foco en las perspectivas de ventas de cada negocio.':'Larco enfatiza las reglas de contratación y el impulso a las pymes.'});document.body.dataset.lens='poy';

