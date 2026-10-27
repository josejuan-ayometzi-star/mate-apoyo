// ============================================================
// Mate Apoyo · efectos: sonidos, confeti, animaciones y frases de ánimo
// (todo generado con código: sin archivos de audio)
// ============================================================
(function(){
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const lget=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lset=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let sonidoOn=lget('mate_sonido')!=='0';
let ctx=null;
function ac(){try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();}if(ctx.state==='suspended')ctx.resume();return ctx;}catch(e){return null;}}
function nota(f,t0,dur,tipo,vol){
  const c=ac();if(!c)return;tipo=tipo||'sine';vol=vol||.16;
  const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;
  o.type=tipo;o.frequency.setValueAtTime(f,t);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+dur+.05);
}
const SON={
  tap:()=>nota(700,0,.05,'triangle',.06),
  clic:()=>nota(520,0,.07,'triangle',.07),
  bien:()=>{nota(523,0,.12);nota(659,.09,.12);nota(784,.18,.26)},
  racha:()=>{[523,659,784,1047,1319].forEach((f,i)=>nota(f,i*.07,.16,'sine',.15))},
  mal:()=>{nota(311,0,.16,'sine',.11);nota(247,.13,.26,'sine',.11)},
  estrella:n=>{nota(784+(n||0)*196,0,.1,'triangle',.13);nota(1175+(n||0)*196,.07,.3,'sine',.12)},
  nivel:()=>{[[523,0],[523,.12],[523,.24],[659,.36],[784,.52],[659,.66],[784,.78],[1047,.92]].forEach(([f,t])=>nota(f,t,.2,'triangle',.14))},
  triste:()=>{nota(392,0,.22,'sine',.1);nota(349,.2,.22,'sine',.1);nota(330,.4,.4,'sine',.1)},
  abrir:()=>{[523,784,1047].forEach((f,i)=>nota(f,i*.08,.2,'triangle',.11))},
};
function sonido(n,a){if(!sonidoOn||reduce&&0)return;try{(SON[n]||function(){})(a);}catch(e){}}

// ---------- vibración ----------
function vibrar(p){try{if(navigator.vibrate)navigator.vibrate(p);}catch(e){}}

// ---------- confeti ----------
const COLORES=['#ec5923','#fba92b','#0a8143','#1f2d86','#771d39','#ffd166','#4a1a6b','#ffffff'];
function confeti(o){
  if(reduce)return;o=o||{};
  const n=o.n||80,W=innerWidth,H=innerHeight;
  const cv=document.createElement('canvas');cv.className='fx-confeti';cv.width=W;cv.height=H;document.body.appendChild(cv);
  const g=cv.getContext('2d');
  const x0=o.x==null?W/2:o.x,y0=o.y==null?H*.35:o.y,ab=o.abanico||Math.PI*1.1;
  const P=Array.from({length:n},()=>{const a=-Math.PI/2+(Math.random()-.5)*ab,v=(o.fuerza||11)*(.5+Math.random());
    return {x:x0,y:y0,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:Math.random()*6,vr:(Math.random()-.5)*.4,w:6+Math.random()*8,h:4+Math.random()*6,c:COLORES[Math.floor(Math.random()*COLORES.length)],circ:Math.random()<.25};});
  const t0=performance.now();
  (function f(t){
    const dt=t-t0;g.clearRect(0,0,W,H);let vivo=false;
    P.forEach(p=>{p.vy+=.32;p.vx*=.992;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;if(p.y<H+20){vivo=true;
      g.save();g.translate(p.x,p.y);g.rotate(p.r);g.fillStyle=p.c;g.globalAlpha=Math.max(0,1-dt/3200);
      if(p.circ){g.beginPath();g.arc(0,0,p.w/2.4,0,6.3);g.fill();}else g.fillRect(-p.w/2,-p.h/2,p.w,p.h);g.restore();}});
    if(vivo&&dt<3400)requestAnimationFrame(f);else cv.remove();
  })(t0);
}
function lluvia(emoji,n){ // lluvia de emojis (para premios grandes)
  if(reduce)return;n=n||16;
  for(let i=0;i<n;i++){const s=document.createElement('span');s.className='fx-lluvia';s.textContent=emoji[i%emoji.length];
    s.style.left=Math.random()*100+'vw';s.style.animationDelay=Math.random()*1.2+'s';s.style.fontSize=(24+Math.random()*26)+'px';s.style.animationDuration=(2.2+Math.random()*1.6)+'s';
    document.body.appendChild(s);setTimeout(()=>s.remove(),5000);}
}
function flotar(texto,el){
  if(reduce)return;const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0,height:0};
  const s=document.createElement('div');s.className='fx-flota';s.textContent=texto;
  s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top+r.height/2)+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),1300);
}
function centro(sel){const e=document.querySelector(sel);if(!e)return {x:innerWidth/2,y:innerHeight*.35};const r=e.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}

// ---------- frases de ánimo ----------
const F={
 bien:['¡Muy bien!','¡Excelente!','¡Eso es!','¡Así se hace!','¡Correcto!','¡Lo lograste!','¡Qué bien piensas!','¡Genial!','¡Buenísimo!','¡Bien por ti!'],
 racha:['¡Estás en llamas!','¡Imparable!','¡Qué racha tan increíble!','¡Eres un crack!','¡No hay quien te pare!','¡Pura concentración!'],
 casi:['¡Casi! Mira la pista y prueba otra vez 💪','Equivocarse es parte de aprender. ¡Inténtalo de nuevo!','Respira hondo… ¡tú puedes! Revisa con calma.','¡Estás cerca! Fíjate bien en la pista.','Cada intento te hace más fuerte. ¡Otra vez!','Los errores son pasos del camino. ¡Sigue!','Tranquilo, tú puedes. Lee la pista con calma.','¡No te rindas! La respuesta está cerca.'],
 mostrar:['Ahora ya sabes cómo se hace. ¡La próxima es tuya!','Así se aprende. ¡Sigue adelante!','No pasa nada, cada error te acerca al acierto.','¡Gracias a este error, ahora sabes más!','Los campeones también se equivocan. ¡Vamos con la siguiente!','Respira y sigue: ¡tú puedes con la que sigue!'],
 pasa:['¡Lo lograste! Tu esfuerzo valió la pena.','¡Eres increíble! Sigue avanzando.','¡Qué orgullo! Tu práctica da resultados.','¡Misión cumplida! ¿Vamos por el siguiente reto?'],
 pasa3:['¡PERFECTO! ¡Eres una estrella! ⭐','¡Sin errores! ¡Qué gran trabajo!','¡Increíble! ¡Eres un campeón o campeona de las matemáticas!'],
 noPasa:['¡Casi lo logras! Los campeones practican una y otra vez. Vas a poder.','Un tropiezo no es el final: ¡es práctica! Vuelve a intentarlo, ya sabes más que antes.','No te desanimes. Mira lo que hay que repasar y regresa más fuerte. ¡Tú puedes!','Cada intento te acerca a la meta. ¡Respira, repasa y vuelve a la carga!'],
 esp:['¡Qué buen trabajo con las palabras!','¡Sigue escribiendo cada día mejor!','¡Tu ortografía va creciendo!'],
 inicio:['¡Vamos! Un error es solo una pista para aprender.','Despacio y con calma: ¡tú puedes!','Lee con atención, piensa y responde. ¡Adelante!','¡Hoy vas a superar tu mejor marca!'],
 hola:['Hoy es un buen día para aprender algo nuevo.','Equivocarse también es aprender. ¡Vamos!','Un pasito cada día te lleva muy lejos.','¡Tú puedes con todo lo que te propongas!','Cada práctica te hace más fuerte.']
};
const ult={};
function frase(tipo){const a=F[tipo]||[''];let i;do{i=Math.floor(Math.random()*a.length);}while(a.length>1&&ult[tipo]===i);ult[tipo]=i;return a[i];}

// ---------- fondo con símbolos flotantes ----------
function fondo(){
  const t=document.getElementById('tablero');if(!t||reduce)return;
  const d=document.createElement('div');d.id='fondo';d.setAttribute('aria-hidden','true');
  const sim=['+','−','×','÷','=','π','★','%','½','7','3','9','A','ñ','✎','□'];
  for(let i=0;i<18;i++){const s=document.createElement('span');s.textContent=sim[i%sim.length];
    s.style.left=(3+Math.random()*94)+'%';s.style.fontSize=(22+Math.random()*34)+'px';
    s.style.animationDuration=(16+Math.random()*18)+'s';s.style.animationDelay=(-Math.random()*30)+'s';d.appendChild(s);}
  t.insertBefore(d,t.firstChild);
}

// ---------- barras de progreso con animación ----------
function post(raiz){
  raiz.querySelectorAll('i[data-to]').forEach(i=>{
    const to=i.dataset.to,from=i.dataset.from;
    if(from!==to){void i.offsetWidth;setTimeout(()=>{i.style.width=to+'%';},40);}
  });
}

// ---------- botón de sonido ----------
function boton(){
  const b=document.createElement('button');b.id='btn-sonido';b.type='button';
  const pinta=()=>{b.textContent=sonidoOn?'🔊':'🔇';b.setAttribute('aria-label',sonidoOn?'Quitar sonido':'Poner sonido');b.title=sonidoOn?'Sonido activado':'Sonido apagado';};
  pinta();
  b.addEventListener('click',e=>{e.stopPropagation();sonidoOn=!sonidoOn;lset('mate_sonido',sonidoOn?'1':'0');pinta();if(sonidoOn)sonido('bien');});
  document.body.appendChild(b);
}

// ---------- ondas al tocar + sonido de toque ----------
function onda(x,y){
  if(reduce)return;const s=document.createElement('span');s.className='fx-onda';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);setTimeout(()=>s.remove(),600);
}
document.addEventListener('pointerdown',e=>{
  const t=e.target.closest&&e.target.closest('button,.opt,.chip,.bin,.pal,.chk,.nombre');
  if(!t||t.id==='btn-sonido'||t.disabled)return;
  onda(e.clientX,e.clientY);
  if(t.closest('#teclado'))sonido('tap');
  else if(t.matches('.opt,.chip,.bin,.pal,.chk'))sonido('tap');
  else sonido('clic');
},true);

function init(){fondo();boton();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();

window.FX={sonido,confeti,lluvia,flotar,frase,vibrar,post,centro,reduce};
})();
