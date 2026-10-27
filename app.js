// ============================================================
// Mate Apoyo · lógica de la app (alumnos y panel del profesor)
// ============================================================
(function(){
const $app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={pantalla:'cargando',alumnos:[],token:null,nombre:null,prog:{},pin:'',pinAlumno:null,pinMsg:'',
  mod:null,niv:null,j:null,profe:{verpin:false,jwt:null,resumen:[],det:null,errores:[],alumno:null,nuevos:null,msg:''}};
// ---------- Español: módulos construidos desde espanol.js ----------
const ESPD=window.ESP||{ORTO:[],PEPE:[],RONDAS:[],NIVELES:[]};
const NOMBRES_NIV=['Reconocer','Aplicar','Producir'],DESC_NIV=['Identifico y clasifico','Completo y corrijo','Creo y escribo'];
const MODULOS_ESP=[];
ESPD.ORTO.forEach(L=>MODULOS_ESP.push({id:'orto-'+L.id,esp:true,grupo:'orto',titulo:'Ortografía · '+L.nombre,corto:L.letra,reglas:L.reglas,
  niveles:[1,2,3].filter(n=>(L.niveles[n]||[]).length).map(n=>({n,nombre:NOMBRES_NIV[n-1],desc:DESC_NIV[n-1],preguntas:L.niveles[n]}))}));
ESPD.PEPE.forEach(F=>MODULOS_ESP.push({id:'pepe-'+F.folio,esp:true,grupo:'pepe',titulo:'Folio '+F.folio+' · '+F.tema,corto:String(F.folio),tema:F.tema,subtitulo:F.subtitulo,ronda:F.ronda,recordatorio:F.recordatorio,
  niveles:[1,2,3].filter(n=>(F.niveles[n]||[]).length).map(n=>({n,nombre:NOMBRES_NIV[n-1],desc:DESC_NIV[n-1],preguntas:F.niveles[n]}))}));
const mod=id=>window.MODULOS.concat(MODULOS_ESP).find(m=>m.id===id);
let tt;function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200);}
const store={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del(k){try{sessionStorage.removeItem(k)}catch(e){}}};
const lget=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lset=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

// ---------- API (Supabase) ----------
async function rpc(fn,args,jwt){
  const h={'apikey':CFG.KEY,'Content-Type':'application/json'};
  if(jwt)h['Authorization']='Bearer '+jwt;
  let r;
  try{r=await fetch(`${CFG.URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:h,body:JSON.stringify(args||{})});}
  catch(e){const er=new Error('sin_conexion');er.red=true;throw er;}
  let d=null;try{d=await r.json();}catch(e){}
  if(!r.ok){const er=new Error((d&&(d.message||d.error_description))||('error '+r.status));er.status=r.status;throw er;}
  return d;
}
async function loginProfe(email,password){
  let r;
  try{r=await fetch(`${CFG.URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{'apikey':CFG.KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})});}
  catch(e){throw new Error('sin_conexion');}
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error('credenciales');
  return d.access_token;
}
// cola de intentos sin enviar
function pend(){try{return JSON.parse(lget('mate_pend')||'[]')}catch(e){return[]}}
async function flushPend(){
  const p=pend();if(!p.length||!S.token)return;
  const resto=[];
  for(const x of p){
    try{await rpc('guardar_intento',{p_token:S.token,...x.a});}
    catch(e){ if(e.red) resto.push(x); else if(!/sesion_invalida/.test(e.message)) resto.push(x); }
  }
  lset('mate_pend',JSON.stringify(resto));
}

// ---------- utilidades de progreso ----------
const key=(m,n)=>m+':'+n;
const pr=(m,n)=>S.prog[key(m,n)];
const hecho=(m,n)=>!!(pr(m,n)&&pr(m,n).completado);
const abierto=(m,n)=>n===1||hecho(m,n-1);
const estrellasHtml=n=>`<span class="estrellas">${[1,2,3].map(i=>`<span class="${i<=n?'':'off'}">★</span>`).join('')}</span>`;
function resumenMod(m){const ls=m.niveles;let h=0,e=0;ls.forEach(l=>{if(hecho(m.id,l.n))h++;e+=(pr(m.id,l.n)||{}).estrellas||0;});return {h,tot:ls.length,e};}
async function cargarProg(){
  const rows=await rpc('mi_progreso',{p_token:S.token});
  S.prog={};(rows||[]).forEach(r=>S.prog[key(r.modulo,r.nivel)]=r);
}
function salir(){
  if(S.token){rpc('cerrar_sesion',{p_token:S.token}).catch(()=>{});}
  S.token=null;S.nombre=null;S.prog={};store.del('mate_token');store.del('mate_nombre');S.pantalla='login';render();cargarNombres();
}
function sesionCaida(){toast('Tu sesión terminó. Entra otra vez.');S.token=null;store.del('mate_token');S.pantalla='login';render();cargarNombres();}

// ---------- vistas: alumno ----------
function top(extra='',hero=false){
  if(hero)return `<img class="hero" src="img/banner.jpg" alt="Prof. Pepe"><div class="top top-der">${extra}</div>`;
  return `<div class="top"><div class="marca"><img class="av" src="img/pepe.png" alt=""><img class="rot" src="img/pepe-texto.png" alt="Prof. Pepe"></div><div class="extra">${extra}</div></div>`;
}
function pie(){return `<div class="pie"><div class="logos"><img src="img/logo-crecer.png" alt="Centro Educativo Crecer"><img src="img/logo-ib.png" alt="IB World School"></div><div>Club de Repaso · Quinto Grado · ${esc(CFG.VERSION)}</div></div>`;}
function vCargando(){return `${top()}<div class="card"><p>Cargando…</p></div>`;}
function vLogin(){
  const l=S.alumnos;
  return `${top('',true)}<div class="club">Club de Repaso · Quinto Grado</div><h1>¡Hola! 👋</h1><p>Toca tu nombre para entrar.</p>
  ${S.errRed?`<div class="card"><p>No hay internet por ahora. Revisa tu conexión y toca el botón.</p><button class="btn" id="reint">Reintentar</button></div>`:''}
  <div class="grid g-nombres" id="nombres">${l.map(a=>`<button class="nombre" data-id="${esc(a.id)}" data-n="${esc(a.nombre)}">${esc(a.nombre)}</button>`).join('')}</div>
  ${(!l.length&&!S.errRed)?'<p>Todavía no hay alumnos registrados. Pide a tu profe que los agregue.</p>':''}
  <div class="acc-profe"><button class="enlace" id="irprofe">Soy el profe</button></div>`;
}
function vPin(){
  const pts=[0,1,2,3].map(i=>`<i class="${i<S.pin.length?'on':''}"></i>`).join('');
  return `${top('<button class="btn sec chico" id="atras">← Cambiar nombre</button>')}
  <h1>${esc(S.pinNombre)}</h1><p>Escribe tu PIN de 4 números.</p>
  <div class="pin-pts">${pts}</div><div class="msg casi">${esc(S.pinMsg)}</div>
  ${teclado(false)}`;
}
function teclado(conListo,punto){
  const k=n=>`<button data-k="${n}">${n}</button>`;
  if(punto)return `<div class="teclado" id="teclado">${[1,2,3,4,5,6,7,8,9].map(k).join('')}<button data-k="." aria-label="Punto decimal">.</button>${k(0)}<button class="bor" data-k="del" aria-label="Borrar">⌫</button><button class="listo ancho" data-k="ok" aria-label="Listo">✓ Listo</button></div>`;
  return `<div class="teclado" id="teclado">${[1,2,3,4,5,6,7,8,9].map(k).join('')}<button class="bor" data-k="del" aria-label="Borrar">⌫</button>${k(0)}${conListo?`<button class="listo" data-k="ok" aria-label="Listo">✓</button>`:'<span></span>'}</div>`;
}
function totalMate(){const ms=window.MODULOS;let h=0,t=0;ms.forEach(m=>{const r=resumenMod(m);h+=r.h;t+=r.tot;});return {h,t};}
function totalEsp(){let h=0,t=0;MODULOS_ESP.forEach(m=>{const r=resumenMod(m);h+=r.h;t+=r.tot;});return {h,t};}
function vMaterias(){
  const r=totalMate(),re=totalEsp();
  return `${top(`<span class="chip-user">${esc(S.nombre)}</span> <button class="btn sec chico" id="salir">Salir</button>`,true)}
  <div class="club">Club de Repaso · Quinto Grado</div>
  <h1>¡Hola, ${esc(S.nombre)}!</h1><p class="sub-h">¿Qué quieres practicar hoy? <span class="frase-hoy">${esc(S.fraseHoy||(S.fraseHoy=window.FX.frase('hola')))}</span></p>
  <div class="materias">
   <button class="materia mate" data-materia="mate"><div class="simb"><span>+</span><span>−</span><span>×</span><span>÷</span></div>
     <div class="mt">Matemáticas</div><div class="ms">Operaciones, decimales, medidas y geometría</div>
     <div class="mp"><i style="width:${r.t?r.h/r.t*100:0}%"></i></div><div class="mn">${r.h} de ${r.t} niveles</div></button>
   <button class="materia esp" data-materia="esp"><div class="simb"><span>A</span><span>a</span><span>✎</span></div>
     <div class="mt">Español</div><div class="ms">Ortografía y palabras</div>
     <div class="mp"><i style="width:${re.t?re.h/re.t*100:0}%"></i></div><div class="mn">${re.h} de ${re.t} niveles</div></button>
  </div>`;
}
function tileEsp(m){const r=resumenMod(m);return `<button class="tb ${r.h===r.tot?'hecho':''}" data-m="${m.id}"><div class="n">${esc(m.corto)}</div><div class="st">${'★'.repeat(Math.round(r.e/m.niveles.length))||'&nbsp;'}</div></button>`;}
function vEspanol(){
  const orto=MODULOS_ESP.filter(m=>m.grupo==='orto'),pepe=MODULOS_ESP.filter(m=>m.grupo==='pepe');
  const rondas=(ESPD.RONDAS||[]).map(R=>`<h3 class="ronda">${esc(R.nombre)} · ${esc(R.desc)}</h3>
   <div class="niveles dos">${pepe.filter(m=>m.ronda===R.n).map(m=>{const r=resumenMod(m);return `<button class="niv ${r.h===r.tot?'hecho':''}" data-m="${m.id}"><div class="num">${esc(m.corto)}</div><div><div class="nm">${esc(m.tema)}</div><div class="sub">${esc(m.subtitulo)} · ${r.h} de ${r.tot} niveles</div></div>${r.h?estrellasHtml(Math.round(r.e/m.niveles.length)):''}</button>`;}).join('')}</div>`).join('');
  return `${top(`<button class="btn sec chico" id="materias">← Materias</button>`)}
  <h1>Español</h1><p class="sub-h">Elige qué practicar hoy.</p>
  <h2>Ortografía: letras</h2>
  <div class="tablas">${orto.map(tileEsp).join('')}</div>
  <h2>Programa P.E.P.E.</h2>${rondas}`;
}
function tarjetaMod(m){const r=resumenMod(m);return `<button class="mod" data-m="${m.id}"><div class="ic">${m.icono}</div><div class="ti">${m.titulo}</div><div class="pr">${r.h} de ${r.tot} niveles</div><div class="prog"><i style="width:${r.h/r.tot*100}%"></i></div></button>`;}
function vHome(){
  const tablas=window.MODULOS.filter(m=>m.grupo==='tablas');
  const ops=window.MODULOS.filter(m=>m.grupo==='operaciones');
  const decs=window.MODULOS.filter(m=>m.grupo==='decimales'),meds=window.MODULOS.filter(m=>m.grupo==='medidas'),geo=window.MODULOS.filter(m=>m.grupo==='geometria');
  return `${top(`<button class="btn sec chico" id="materias">← Materias</button>`)}
  <h1>Matemáticas</h1><p class="sub-h">¿Qué practicamos hoy?</p>
  <h2>Tablas de multiplicar</h2>
  <div class="tablas">${tablas.map(m=>{const r=resumenMod(m);return `<button class="tb ${r.h===r.tot?'hecho':''}" data-m="${m.id}"><div class="n">${m.corto}</div><div class="st">${'★'.repeat(Math.round(r.e/m.niveles.length))||'&nbsp;'}</div></button>`;}).join('')}</div>
  <h2>Operaciones</h2>
  <div class="grid g-mod">${ops.map(tarjetaMod).join('')}</div>
  <h2>Decimales</h2>
  <div class="grid g-mod">${decs.map(tarjetaMod).join('')}</div>
  <h2>Medidas</h2>
  <div class="grid g-mod">${meds.map(tarjetaMod).join('')}</div>
  <h2>Geometría</h2>
  <div class="grid g-mod">${geo.map(tarjetaMod).join('')}</div>`;
}
function recuerdaEsp(m){
  if(m.grupo==='orto')return `<b>Recuerda las reglas:</b><ul class="reglas">${m.reglas.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`;
  return `<b>Recuerda:</b> ${esc(m.recordatorio)}`;
}
function vNiveles(){
  const m=mod(S.mod);
  return `${top(`<button class="btn sec chico" id="home">${m.esp?'← Español':'← Inicio'}</button>`)}
  <h1>${esc(m.titulo)}</h1>${m.esp?`<div class="recuerda">${recuerdaEsp(m)}</div><p>Completa cada nivel para abrir el siguiente.</p>`:`<p>Pasa cada nivel con ${CFG.UMBRAL} aciertos de ${CFG.TOTAL} para abrir el siguiente.</p>`}
  <div class="niveles">${m.niveles.map(l=>{const p=pr(m.id,l.n);const ab=abierto(m.id,l.n);const h=hecho(m.id,l.n);
    const nuevo=S.recien&&S.recien.m===m.id&&S.recien.n===l.n;
    return `<button class="niv ${h?'hecho':''} ${ab?'':'cerrado'} ${nuevo?'nuevo':''}" data-n="${l.n}" ${ab?'':'disabled'}><div class="num">${ab?(h?'✓':l.n):'🔒'}</div><div><div class="nm">${esc(l.nombre)}</div><div class="sub">${p?`Mejor: ${p.mejor} de ${p.total||CFG.TOTAL} · ${p.intentos} intento${p.intentos===1?'':'s'}`:(ab?'¡Listo para empezar!':'Pasa el nivel anterior')}</div></div>${h?estrellasHtml(p.estrellas):''}</button>`;}).join('')}</div>`;
}
function vIntro(){
  const m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);
  return `${top(`<button class="btn sec chico" id="volver">← Niveles</button>`)}
  <h1>${esc(m.titulo)} · Nivel ${l.n}</h1><h2 style="margin-top:4px">${esc(l.nombre)}</h2>
  ${m.esp?`<div class="recuerda">${recuerdaEsp(m)}</div><p>Son ${l.preguntas.length} ejercicios. Si te equivocas, verás la respuesta correcta para aprender. ¡Tú puedes!</p>`
  :`<div class="recuerda"><b>Recuerda:</b> ${esc(l.recuerda)}</div>
  <p>Son ${CFG.TOTAL} preguntas. Si fallas, puedes intentarlo otra vez y ver una pista. Para pasar necesitas ${CFG.UMBRAL} bien a la primera. Si no lo logras, practicas de nuevo con números nuevos.</p>`}
  <div class="fila-acc"><button class="btn ok" id="empezar">¡Empezar!</button></div>`;
}
function vis(p){
  const v=p.vis;
  if(v.tipo==='col'){const a=String(v.a),b=String(v.b);return `<div class="col"><div class="r"><span>${a}</span></div><div class="r"><span class="op">${v.op}</span><span>${b}</span></div><div class="raya"></div></div>`;}
  if(v.tipo==='poli')return window.svgPoli(v)+`<div class="q-linea q-peq">${esc(p.q)}</div>`;
  if(v.tipo==='poli3')return window.svgPoli3(v)+`<div class="q-linea q-peq">${esc(p.q)}</div>`;
  if(v.tipo==='esc'){return `<div class="esc">${v.sim.map((u,k)=>`<span class="${k===v.desde?'de':(k===v.hasta?'a':'')}">${u}</span>`).join('')}</div><div class="q-linea">${esc(p.q)}</div>`;}
  if(v.tipo==='div'){return `<div class="galera"><span class="dv">${v.divisor}</span><span class="dd">${v.dividendo}</span></div>`;}
  return `<div class="q-linea">${esc(p.q)}</div>`;
}
function vJuego(){
  const j=S.j,p=j.preguntas[j.i];
  const resp=j.respuesta===''?'?':esc(j.respuesta);
  const txtC=p.opciones?p.opciones[p.resp]:window.fmtNum(p.resp);
  const cls=(j.estado==='bien'?'bien':(j.estado==='casi'?'casi':''))+(j.anim==='bien'?' a-bien':(j.anim==='mal'?' a-mal':''));
  const pp=j.anim?' pop':'';
  let msg='';
  if(j.estado==='bien')msg=`<div class="msg bien${pp}">${esc(j.frase)} 🎉</div>`;
  else if(j.estado==='casi')msg=`<div class="msg casi${pp}">${esc(j.frase)}</div>`;
  else if(j.estado==='mostrar')msg=`<div class="msg casi${pp}">La respuesta es <b>${esc(txtC)}</b>. ${esc(j.frase)}</div>`;
  else msg=`<div class="msg">${j.i===0&&j.intento===1&&j.respuesta===''&&j.fraseIni?esc(j.fraseIni):'&nbsp;'}</div>`;
  const hasta=(j.i+((j.estado==='bien'||j.estado==='mostrar')?1:0))/j.preguntas.length*100,desde=j.pw==null?0:j.pw;j.pw=hasta;
  const mostrarPista=j.pista||j.estado==='casi'||j.estado==='mostrar';
  return `${top(`<button class="btn sec chico" id="abandonar">✕ Salir</button>`)}
  <div class="ver marcador"><span>Pregunta ${j.i+1} de ${j.preguntas.length}</span><span class="chip-m">⭐ ${j.aciertos}</span>${j.racha>=2?`<span class="chip-m fuego ${j.anim==='bien'?'bump':''}">🔥 ×${j.racha}</span>`:''}</div>
  <div class="prog run"><i data-from="${desde}" data-to="${hasta}" style="width:${desde}%"></i></div>
  <div class="q-box ${j.anim==='nueva'?'desliza':''}">${vis(p)}</div>
  ${p.opciones?'<div id="resp"></div>':`<div class="respuesta ${j.respuesta===''?'vacio':''} ${cls}" id="resp">${resp}</div>`}
  ${msg}
  ${mostrarPista?`<div class="pista">💡 ${esc(p.pista)}</div>`:''}
  ${j.estado==='mostrar'?`<div class="fila-acc"><button class="btn" id="sig">Siguiente →</button></div>`
   :(j.estado==='bien'?'':`${p.opciones?`<div class="opm ${j.anim==='mal'?'a-mal':''}">${p.opciones.map((o,i)=>`<button class="opmb ${j.estado==='casi'&&String(i)===j.primera?'no':''}" data-o="${i}" ${j.estado==='casi'&&String(i)===j.primera?'disabled':''}>${esc(o)}</button>`).join('')}</div>`:teclado(true,j.punto)}<div class="fila-acc"><button class="btn sec chico" id="pista">💡 Pista</button></div>`)}`;
}

// ---------- Español: juego ----------
const normE=t=>String(t).toLowerCase().replace(/[.,;:!¡?¿]/g,'').normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
function descQ(q){
  if(q.tipo==='choice'||q.tipo==='fill')return ((q.pregunta||'')+' '+(q.palabra&&q.palabra!=='?'?q.palabra:'')).trim();
  if(q.tipo==='classify')return q.instr+': '+q.fichas.map(f=>f.w).join(', ');
  if(q.tipo==='correct')return q.instr+': '+q.frase;
  if(q.tipo==='transform')return q.instr+': '+q.origen;
  return q.instr||'';
}
function corrQ(q){
  if(q.tipo==='choice'||q.tipo==='fill')return q.opciones[q.correcta];
  if(q.tipo==='classify')return q.fichas.map(f=>f.w+' → '+q.cajas[f.caja]).join(', ');
  if(q.tipo==='correct')return q.correcciones.join(' · ');
  if(q.tipo==='transform')return q.destino;
  if(q.tipo==='write')return (q.ejemplos&&q.ejemplos[0])||'';
  return '';
}
function prepararQ(){
  const j=S.je,q=j.qs[j.i];
  j.fase='resp';j.msg='';j.ok=null;j.sel=[];j.sel1=null;j.colocadas=[];j.fallo=false;j.elegida=null;
  j.orden=q.tipo==='classify'?q.fichas.map((f,i)=>i).sort(()=>Math.random()-.5):null;
}
function empezarEsp(){
  const m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);
  S.noGuardado=false;S.je={qs:l.preguntas,i:0,aciertos:0,detalle:[],racha:0,pw:0,anim:'nueva'};
  prepararQ();S.pantalla='juegoesp';render();S.je.anim=null;
}
function finQ(ok,dado,msg){
  const j=S.je,q=j.qs[j.i];
  if(ok)j.aciertos++;
  j.detalle.push({q:descQ(q),c:corrQ(q),d:String(dado??''),ok});
  j.racha=ok?(j.racha||0)+1:0;
  j.fase='fin';j.ok=ok;j.msg=msg+(ok?'':`<span class="frase-animo">${window.FX.frase('mostrar')}</span>`);
  j.anim=ok?'bien':'mal';render();j.anim=null;
  const F=window.FX;F.sonido(ok?(j.racha>=3?'racha':'bien'):'mal');
  if(ok){const c=F.centro('.fb');F.confeti({n:j.racha>=3?80:30,x:c.x,y:c.y-60,fuerza:j.racha>=3?13:9});F.flotar(j.racha>=3?'🔥 ×'+j.racha:'+1 ⭐',$app.querySelector('.fb'));}else F.vibrar(100);
}
function vJuegoEsp(){
  const j=S.je,q=j.qs[j.i],fin=j.fase==='fin';let c='';
  const hastaE=(j.i+(fin?1:0))/j.qs.length*100,desdeE=j.pw==null?0:j.pw;j.pw=hastaE;
  const instr=t=>`<div class="q-instr">${esc(t)}</div>`;
  if(q.tipo==='choice'||q.tipo==='fill'){
    c=instr(q.pregunta||q.instr)+(q.palabra&&q.palabra!=='?'?`<div class="q-word">${esc(q.palabra)}</div>`:'')+
      `<div class="opts ${q.opciones.length===3?'c3':'c2'}">${q.opciones.map((o,i)=>`<button class="opt ${fin?(i===q.correcta?'ok':(i===j.elegida?'no':'')):''}" data-op="${i}" ${fin?'disabled':''}>${esc(o)}</button>`).join('')}</div>`;
  }else if(q.tipo==='classify'){
    c=instr(q.instr.replace(/^Arrastra/,'Lleva'))+`<div class="ayuda">Toca una palabra y luego toca su caja</div>
      <div class="pool">${j.orden.filter(i=>!j.colocadas.includes(i)).map(i=>`<button class="chip ${j.sel1===i?'sel':''}" data-f="${i}">${esc(q.fichas[i].w)}</button>`).join('')}</div>
      <div class="bins ${j.anim==='mal'?'a-mal':''}">${q.cajas.map((cj,b)=>`<button class="bin" data-b="${b}"><h4>${esc(cj)}</h4>${j.colocadas.filter(i=>q.fichas[i].caja===b).map(i=>`<span class="in">${esc(q.fichas[i].w)}</span>`).join('')}</button>`).join('')}</div>`;
  }else if(q.tipo==='correct'){
    const errs=new Set(q.errores.map(normE));
    c=instr(q.instr)+`<div class="ayuda">${esc(q.ayuda||'Toca las palabras que están mal')}</div><div class="frase">${q.frase.split(' ').map((w,i)=>{
      let k='';if(fin){const e=errs.has(normE(w)),m=j.sel.includes(i);k=e&&m?'ok':(e?'miss':(m?'no':''));}else if(j.sel.includes(i))k='sel';
      return `<span class="pal ${k}" data-i="${i}">${esc(w)}</span>`;}).join(' ')}</div>`+(fin?'':`<div class="fila-acc"><button class="btn" id="revisar">Revisar</button></div>`);
  }else if(q.tipo==='transform'){
    c=instr(q.instr)+`<div class="q-word">${esc(q.origen)} <small>→ ?</small></div><div class="inp-wrap"><input type="text" id="tIn" placeholder="Escribe aquí…" autocomplete="off" autocapitalize="off" spellcheck="false" ${fin?'disabled':''} value="${esc(j.dado||'')}">
      ${fin?'':`<div class="ayuda">💡 ${esc(q.pista||'')}</div><div class="fila-acc"><button class="btn" id="revisar">Revisar</button></div>`}</div>`;
  }else if(q.tipo==='write'){
    c=instr(q.instr)+`<div class="inp-wrap"><textarea id="wIn" rows="3" placeholder="Escribe tu respuesta…" ${fin?'disabled':''}>${esc(j.dado||'')}</textarea>${fin?'':`<div class="fila-acc"><button class="btn" id="revisar">Listo</button></div>`}</div>`;
  }else{ // checklist
    c=instr(q.instr)+`<div class="chk-list">${(q.items||[]).map((it,i)=>`<button class="chk ${j.sel.includes(i)?'on':''}" data-i="${i}" ${fin?'disabled':''}><span class="box">✓</span><span>${esc(it)}</span></button>`).join('')}</div>`+(fin?'':`<div class="fila-acc"><button class="btn" id="revisar">Terminar</button></div>`);
  }
  return `${top(`<button class="btn sec chico" id="abandonar">✕ Salir</button>`)}
  <div class="ver marcador"><span>Ejercicio ${j.i+1} de ${j.qs.length}</span><span class="chip-m">⭐ ${j.aciertos}</span>${j.racha>=2?`<span class="chip-m fuego ${j.anim==='bien'?'bump':''}">🔥 ×${j.racha}</span>`:''}</div>
  <div class="prog run"><i data-from="${desdeE}" data-to="${hastaE}" style="width:${desdeE}%"></i></div>
  <div class="q-box esp ${j.anim==='nueva'?'desliza':''}">${c}</div>
  <div class="fb ${j.ok===true?'ok':(j.ok===false?'no':'')} ${j.anim&&j.fase==='fin'?'pop':''}">${j.msg||'&nbsp;'}</div>
  ${fin?`<div class="fila-acc"><button class="btn" id="sigesp">${j.i+1>=j.qs.length?'Terminar ✓':'Siguiente →'}</button></div>`:''}`;
}
function bindEsp(){
  const j=S.je,q=j.qs[j.i];
  on('#abandonar',()=>{if(confirm('¿Quieres salir? Este intento no se guardará.')){S.pantalla='niveles';render();}});
  on('#sigesp',()=>{j.i++;if(j.i>=j.qs.length){terminarEsp();return;}prepararQ();j.anim='nueva';render();j.anim=null;});
  if(j.fase==='fin')return;
  if(q.tipo==='choice'||q.tipo==='fill'){
    $app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.op);j.elegida=i;const ok=i===q.correcta;
      finQ(ok,q.opciones[i],ok?'¡Muy bien! 🎉':'Casi… la respuesta correcta está en verde 💪');});
  }else if(q.tipo==='classify'){
    $app.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{j.sel1=j.sel1===Number(b.dataset.f)?null:Number(b.dataset.f);j.msg='';render();});
    $app.querySelectorAll('.bin').forEach(b=>b.onclick=()=>{
      if(j.sel1===null){j.msg='Primero toca una palabra';j.ok=null;render();return;}
      if(q.fichas[j.sel1].caja===Number(b.dataset.b)){
        j.colocadas.push(j.sel1);j.sel1=null;j.ok=null;
        if(j.colocadas.length===q.fichas.length){finQ(!j.fallo,j.fallo?'con errores':'bien',j.fallo?'¡Terminaste de clasificar! 🎉':'¡Clasificaste todas! 🎉');}
        else{j.msg='¡Bien!';render();window.FX.sonido('bien');}
      }else{j.fallo=true;j.msg='Esa va en la otra caja. '+window.FX.frase('casi').replace(/ 💪/,'');j.ok=null;j.sel1=null;j.anim='mal';render();j.anim=null;window.FX.sonido('mal');window.FX.vibrar(80);}
    });
  }else if(q.tipo==='correct'){
    $app.querySelectorAll('.pal').forEach(el=>el.onclick=()=>{const i=Number(el.dataset.i);j.sel=j.sel.includes(i)?j.sel.filter(x=>x!==i):[...j.sel,i];render();});
    on('#revisar',()=>{
      const errs=new Set(q.errores.map(normE)),pals=q.frase.split(' ');
      let ok=0,mal=0;pals.forEach((w,i)=>{const e=errs.has(normE(w)),m=j.sel.includes(i);if(e&&m)ok++;else if(!e&&m)mal++;});
      const todo=ok===q.errores.length&&mal===0;
      finQ(todo,pals.filter((w,i)=>j.sel.includes(i)).join(' '),todo?`¡Perfecto! 🎉 Se escribe: <b>${esc(q.oracion||q.correcciones.join(' · '))}</b>`:`Encontraste ${ok} de ${q.errores.length}. Lo correcto es: <b>${esc(q.oracion||q.correcciones.join(' · '))}</b>`);});
  }else if(q.tipo==='transform'){
    const go=()=>{const v=$app.querySelector('#tIn').value.trim();if(!v)return;j.dado=v;const ok=normE(v)===normE(q.destino);
      finQ(ok,v,ok?`¡Muy bien! 🎉 Se escribe: <b>${esc(q.destino)}</b>`:`Casi… la respuesta es: <b>${esc(q.destino)}</b>`);};
    on('#revisar',go);const t=$app.querySelector('#tIn');if(t)t.onkeydown=e=>{if(e.key==='Enter')go();};
  }else if(q.tipo==='write'){
    on('#revisar',()=>{const v=$app.querySelector('#wIn').value.trim();
      if(v.length<3){j.msg='Escribe un poco más';j.ok=null;render();return;}
      j.dado=v;const ok=q.validar?normE(v).includes(normE(q.validar)):true;const ej=q.ejemplos&&q.ejemplos.length?` Ejemplo: <b>${esc(q.ejemplos[0])}</b>`:'';
      finQ(ok,v,ok?`¡Muy bien! 🎉${ej}`:`Buen intento. Recuerda incluir «${esc(q.validar)}».${ej}`);});
  }else{
    $app.querySelectorAll('.chk').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.i);j.sel=j.sel.includes(i)?j.sel.filter(x=>x!==i):[...j.sel,i];render();});
    on('#revisar',()=>finQ(true,String(j.sel.length),'¡Bien revisado! Revisar tu trabajo te hace mejor escritor.'));
  }
}
async function terminarEsp(){
  const j=S.je,total=j.qs.length,pct=total?j.aciertos/total:0,est=pct>=.9?3:(pct>=.6?2:1);
  S.j={esp:true,aciertos:j.aciertos,total,detalle:j.detalle,est};
  const k=key(S.mod,S.niv),a=S.prog[k]||{modulo:S.mod,nivel:S.niv,completado:false,estrellas:0,mejor:0,intentos:0};
  S.prog[k]={...a,completado:true,estrellas:Math.max(a.estrellas,est),mejor:Math.max(a.mejor,j.aciertos),intentos:a.intentos+1,total};
  const args={p_modulo:S.mod,p_nivel:S.niv,p_aciertos:j.aciertos,p_total:total,p_detalle:j.detalle};
  S.pantalla='resultado';render();celebrar(true,est);
  try{await rpc('guardar_intento',{p_token:S.token,...args});}
  catch(e){
    if(/sesion_invalida/.test(e.message)){sesionCaida();return;}
    const p=pend();p.push({a:args});lset('mate_pend',JSON.stringify(p));S.noGuardado=true;render();
  }
}
function vResultado(){
  const j=S.j,m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);const esp=!!j.esp;const pasa=esp?true:j.aciertos>=CFG.UMBRAL;
  const est=esp?j.est:(!pasa?0:(j.aciertos>=10?3:(j.aciertos===9?2:1)));
  const fallos=j.detalle.filter(d=>!d.ok);
  if(S.resKey!==j){S.resKey=j;S.fraseRes=window.FX.frase(esp?'esp':(!pasa?'noPasa':(est===3?'pasa3':'pasa')));}
  const haySig=m.niveles.some(x=>x.n===S.niv+1);
  return `${top('')}
  <div class="res-gde">${pasa?'🎉':'💪'}</div>
  <h1 style="text-align:center">${esp?(est===3?'¡Excelente!':est===2?'¡Bien hecho!':'¡Terminaste!'):(pasa?'¡Lo lograste!':'¡Casi lo logras!')}</h1>
  <p style="text-align:center;font-size:22px">${j.aciertos} de ${esp?j.total:CFG.TOTAL} bien${esp?'':' a la primera'}</p>
  ${pasa?`<div class="res-est">${[0,1,2].map(i=>`<span class="e ${i<est?'on':'off'}" style="--i:${i}">★</span>`).join('')}</div>`:''}
  <div class="res-msg">${esc(S.fraseRes||'')}</div>
  ${fallos.length?`<h2>Para repasar</h2>${fallos.map(f=>esp?`<div class="fall">${esc(f.q)}<br><b>Respuesta: ${esc(f.c||'—')}</b></div>`:`<div class="fall">${/¿/.test(f.q)?esc(f.q)+' <b>Respuesta: '+esc(f.c)+'</b>':esc(f.q.replace('?',f.c).replace('□',f.c))}${!/¿/.test(f.q)&&/[+−×÷]/.test(f.q)&&!/[=]/.test(f.q)?' = '+esc(f.c):''}</div>`).join('')}`:''}
  <div class="fila-acc" style="margin-top:16px">
   ${pasa&&haySig?`<button class="btn ok" id="siguiente">Siguiente nivel →</button>`:''}
   <button class="btn ${pasa?'sec':'nar'}" id="otra">${pasa?'Practicar otra vez':'Intentar con números nuevos'}</button>
   <button class="btn sec" id="volver">Ver niveles</button>
  </div>
  ${S.noGuardado?'<p class="ver" style="text-align:center">Sin internet: tu resultado se enviará cuando haya conexión.</p>':''}`;
}

// ---------- vistas: profesor ----------
function ago(f){if(!f)return '—';const d=(Date.now()-new Date(f).getTime())/86400000;if(d<1/24)return 'hace minutos';if(d<1)return 'hoy';if(d<2)return 'ayer';return `hace ${Math.floor(d)} días`;}
function etiqueta(r){
  const d=r.ultima_actividad?(Date.now()-new Date(r.ultima_actividad).getTime())/86400000:null;
  if(d===null)return '<span class="etq gris">Sin empezar</span>';
  if(r.intentos>=4&&r.intentos>r.niveles_completados*2.5)return '<span class="etq alerta">Se está atorando</span>';
  if(d>=5)return '<span class="etq alerta">Sin actividad</span>';
  return '<span class="etq ok">Avanzando</span>';
}
function vProfeLogin(){
  return `${top('<button class="btn sec chico" id="atras">← Alumnos</button>')}<h1>Panel del profe</h1>
  <div class="card"><label>Correo</label><input type="email" id="pe" autocomplete="username" autocapitalize="off">
  <label>Contraseña</label><input type="password" id="pp" autocomplete="current-password">
  <div class="msg casi">${esc(S.profe.msg)}</div><button class="btn" id="entrarp">Entrar</button></div>`;
}
function vProfePanel(){
  const P=S.profe,all=P.resumen,r=all.filter(a=>a.activo!==false),bajas=all.filter(a=>a.activo===false);
  const sinpin=r.filter(a=>!a.pin).length;
  return `${top(`<button class="btn sec chico" id="salirp">Salir</button>`)}<h1>Avance del grupo</h1>
  <div class="fila-acc solo-pantalla" style="justify-content:flex-start;margin-bottom:12px">
   <button class="btn chico" id="nuevos">+ Agregar alumnos</button><button class="btn sec chico" id="act">↻ Actualizar</button>
   <button class="btn sec chico" id="verpin">${P.verpin?'🙈 Ocultar PINes':'👁 Mostrar PINes'}</button>
   <button class="btn sec chico" id="listapin">🖨 Lista de PINes</button></div>
  ${sinpin?`<div class="card solo-pantalla" style="margin-bottom:12px"><p><b>${sinpin} alumno${sinpin===1?'':'s'} sin PIN visible</b> (se crearon antes de esta versión). Abre cada alumno y escribe su PIN actual para guardarlo, o genera PINes nuevos para ${sinpin===1?'ese alumno':'todos ellos'}.</p>
   <button class="btn nar chico" id="pinfalt">Generar PINes nuevos</button></div>`:''}
  ${P.nuevos?vNuevos():''}
  <table class="t solo-pantalla"><thead><tr><th>Alumno</th>${P.verpin?'<th>PIN</th>':''}<th>Niveles ✓</th><th>★</th><th>Intentos</th><th>Última vez</th><th>Estado</th></tr></thead><tbody>
  ${r.map(a=>`<tr class="fila" data-id="${esc(a.alumno_id)}"><td><b>${esc(a.nombre)}</b></td>${P.verpin?`<td><b>${esc(a.pin||'—')}</b></td>`:''}<td>${a.niveles_completados}</td><td>${a.estrellas}</td><td>${a.intentos}</td><td>${ago(a.ultima_actividad)}</td><td>${etiqueta(a)}</td></tr>`).join('')}
  </tbody></table>${r.length?'':'<p>Aún no hay alumnos. Usa "Agregar alumnos".</p>'}
  ${bajas.length?`<h2 class="solo-pantalla">Dados de baja</h2><table class="t solo-pantalla"><tbody>${bajas.map(a=>`<tr class="fila" data-id="${esc(a.alumno_id)}"><td>${esc(a.nombre)}</td><td>${a.niveles_completados} niveles ✓</td><td><span class="etq gris">Baja</span></td></tr>`).join('')}</tbody></table>`:''}`;
}
function vNuevos(){
  const n=S.profe.nuevos;
  if(n.resultado){return `<div class="card" style="margin-bottom:14px"><h2 style="margin-top:0">${n.lista?'Lista de PINes':'PINes asignados'}</h2><p class="solo-pantalla">${n.lista?'Imprime esta lista y recórtala para entregar cada PIN.':'Quedan guardados: puedes verlos cuando quieras con "Mostrar PINes".'}</p>
   <table class="t"><thead><tr><th>Alumno</th><th>PIN</th>${n.lista?'':'<th>Estado</th>'}</tr></thead><tbody>${n.resultado.map(x=>`<tr><td>${esc(x.nombre)}</td><td><b>${esc(x.pin)}</b></td>${n.lista?'':`<td>${x.ok?'<span class="etq ok">Creado</span>':'<span class="etq alerta">'+esc(x.err)+'</span>'}</td>`}</tr>`).join('')}</tbody></table>
   <div class="fila-acc solo-pantalla" style="justify-content:flex-start;margin-top:10px"><button class="btn sec chico" id="cerrarn">Cerrar</button><button class="btn chico" id="imprimir">Imprimir</button></div></div>`;}
  return `<div class="card" style="margin-bottom:14px"><h2 style="margin-top:0">Agregar alumnos</h2>
  <p>Escribe uno por renglón. Solo el nombre (y la inicial del apellido si se repite), por ejemplo <b>Ana M.</b>. Si no pones PIN, se asigna uno de 4 números. También puedes escribir <b>Ana M., 1234</b>.</p>
  <textarea id="lista" rows="7" style="width:100%;font-size:19px;padding:10px;border:3px solid var(--linea);border-radius:14px;font-family:inherit;user-select:text;-webkit-user-select:text"></textarea>
  <div class="fila-acc" style="justify-content:flex-start;margin-top:10px"><button class="btn ok chico" id="crearn">Crear</button><button class="btn sec chico" id="cerrarn">Cancelar</button></div></div>`;
}
function vProfeDetalle(){
  const P=S.profe,a=P.alumno;
  return `${top(`<button class="btn sec chico" id="volverp">← Grupo</button>`)}<h1>${esc(a.nombre)}</h1>
  <h2>Niveles</h2>
  <table class="t"><thead><tr><th>Tema</th><th>Nivel</th><th>Estado</th><th>Mejor</th><th>★</th><th>Intentos</th></tr></thead><tbody>
  ${P.det.map(d=>{const m=mod(d.modulo);return `<tr><td>${esc(m?m.titulo:d.modulo)}</td><td>${d.nivel}</td><td>${d.completado?'<span class="etq ok">Pasado</span>':'<span class="etq gris">En práctica</span>'}</td><td>${d.mejor}/${d.total||CFG.TOTAL}</td><td>${d.estrellas}</td><td>${d.intentos}</td></tr>`;}).join('')}
  </tbody></table>${P.det.length?'':'<p>Todavía no ha practicado.</p>'}
  <h2>Errores más frecuentes</h2>
  ${P.errores.length?`<table class="t"><thead><tr><th>Tema</th><th>Pregunta</th><th>Veces</th><th>Contestó</th><th>Correcta</th></tr></thead><tbody>${P.errores.map(e=>{const m=mod(e.modulo);return `<tr><td>${esc(m?m.titulo:e.modulo)}</td><td>${esc(e.pregunta)}</td><td>${e.veces}</td><td>${esc(e.ultima_respuesta??'')}</td><td>${esc(e.correcta)}</td></tr>`;}).join('')}</tbody></table>`:'<p>Sin errores registrados.</p>'}
  <h2>Datos del alumno</h2>
  <div class="card"><label>Nombre</label><input type="text" id="nnombre" value="${esc(a.nombre)}">
   <div class="fila-acc" style="justify-content:flex-start;margin-bottom:14px"><button class="btn chico" id="cnombre">Guardar nombre</button></div>
   <div class="fila-form"><div><label>PIN (4 números)${a.pin?` · actual: <b>${esc(a.pin)}</b>`:' · no guardado'}</label><input type="text" id="npin" inputmode="numeric" maxlength="4" value="${esc(a.pin||'')}"></div><div></div><button class="btn" id="cpin">Guardar PIN</button></div></div>
  <h2>Baja del grupo</h2>
  <div class="card"><p>${a.activo===false?'Este alumno está dado de baja: ya no aparece en la lista de entrada, pero se conserva su historial.':'Si el alumno se va del grupo, dalo de baja: deja de aparecer en la lista de entrada y se conserva su historial.'}</p>
   <div class="fila-acc" style="justify-content:flex-start">
   <button class="btn ${a.activo===false?'ok':'nar'} chico" id="cbaja">${a.activo===false?'Reactivar alumno':'Dar de baja'}</button>
   <button class="btn sec chico" id="celim">Eliminar definitivamente</button></div></div>`;
}

// ---------- render + eventos ----------
function render(){
  const p=S.pantalla;
  const v={cargando:vCargando,login:vLogin,pin:vPin,materias:vMaterias,espanol:vEspanol,home:vHome,niveles:vNiveles,intro:vIntro,juego:vJuego,juegoesp:vJuegoEsp,resultado:vResultado,profelogin:vProfeLogin,profepanel:vProfePanel,profedet:vProfeDetalle}[p];
  const cambio=S.ultPantalla!==p;S.ultPantalla=p;
  $app.className=cambio?'nueva':'';
  $app.innerHTML=v()+((p==='juego'||p==='juegoesp')?'':pie());bind();
  window.FX.post($app);
  if(cambio){window.scrollTo(0,0);if(p==='niveles'&&S.recien){window.FX.sonido('abrir');}S.recien=null;}
}
const on=(sel,fn)=>{const e=$app.querySelector(sel);if(e)e.addEventListener('click',fn);return e;};
function bind(){
  const p=S.pantalla;
  if(p==='login'){
    $app.querySelectorAll('.nombre').forEach(b=>b.onclick=()=>{S.pinAlumno=b.dataset.id;S.pinNombre=b.dataset.n;S.pin='';S.pinMsg='';S.pantalla='pin';render();});
    on('#reint',cargarNombres);
    on('#irprofe',()=>{location.hash='#profe';rutear();});
  }
  if(p==='pin'){
    on('#atras',()=>{S.pantalla='login';render();});
    $app.querySelectorAll('#teclado button').forEach(b=>b.onclick=()=>teclaPin(b.dataset.k));
  }
  if(p==='materias'){
    on('#salir',salir);
    $app.querySelectorAll('[data-materia]').forEach(b=>b.onclick=()=>{S.pantalla=b.dataset.materia==='mate'?'home':'espanol';render();});
  }
  if(p==='espanol'){
    on('#materias',()=>{S.pantalla='materias';render();});
    $app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{S.mod=b.dataset.m;S.pantalla='niveles';render();});
  }
  if(p==='home'){
    on('#materias',()=>{S.pantalla='materias';render();});
    $app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{S.mod=b.dataset.m;S.pantalla='niveles';render();});
  }
  if(p==='niveles'){
    on('#home',()=>{S.pantalla=mod(S.mod).esp?'espanol':'home';render();});
    $app.querySelectorAll('.niv:not(.cerrado)').forEach(b=>b.onclick=()=>{S.niv=Number(b.dataset.n);S.pantalla='intro';render();});
  }
  if(p==='intro'){
    on('#volver',()=>{S.pantalla='niveles';render();});
    on('#empezar',empezar);
  }
  if(p==='juegoesp')bindEsp();
  if(p==='juego'){
    on('#abandonar',()=>{if(confirm('¿Quieres salir? Este intento no se guardará.')){S.pantalla='niveles';render();}});
    $app.querySelectorAll('#teclado button').forEach(b=>b.onclick=()=>teclaJ(b.dataset.k));
    $app.querySelectorAll('.opmb').forEach(b=>b.onclick=()=>{const j=S.j;if(j.estado==='bien'||j.estado==='mostrar')return;j.respuesta=b.dataset.o;comprobar();});
    on('#pista',()=>{S.j.pista=true;render();});
    on('#sig',siguiente);
  }
  if(p==='resultado'){
    on('#siguiente',()=>{S.niv=S.niv+1;S.pantalla='intro';render();});
    on('#otra',empezar);
    on('#volver',()=>{S.pantalla='niveles';render();});
  }
  if(p==='profelogin'){
    on('#atras',()=>{location.hash='';rutear();});
    on('#entrarp',async()=>{
      const e=$app.querySelector('#pe').value.trim(),pw=$app.querySelector('#pp').value;
      S.profe.msg='Entrando…';render();
      try{S.profe.jwt=await loginProfe(e,pw);S.profe.msg='';await cargarResumen();S.pantalla='profepanel';render();}
      catch(er){S.profe.msg=er.message==='sin_conexion'?'No hay internet.':'Correo o contraseña incorrectos.';render();}
    });
  }
  if(p==='profepanel'){
    on('#salirp',()=>{S.profe.jwt=null;location.hash='';rutear();});
    on('#act',async()=>{await cargarResumen();render();toast('Actualizado');});
    on('#verpin',()=>{S.profe.verpin=!S.profe.verpin;render();});
    on('#listapin',()=>{const l=S.profe.resumen.filter(a=>a.activo!==false&&a.pin).map(a=>({nombre:a.nombre,pin:a.pin,ok:true}));
      if(!l.length){toast('Todavía no hay PINes guardados.');return;}S.profe.nuevos={resultado:l,lista:true};render();window.scrollTo(0,0);});
    on('#pinfalt',async()=>{
      if(!confirm('Se cambiará el PIN de los alumnos que no tienen PIN visible. Si ya les diste uno, dejará de servir. ¿Continuar?'))return;
      try{const res=await rpc('profe_pines_faltantes',{},S.profe.jwt)||[];await cargarResumen();
        S.profe.nuevos={resultado:res.map(x=>({nombre:x.nombre,pin:x.pin,ok:true})),lista:true};render();window.scrollTo(0,0);}
      catch(e){toast('No se pudo. ¿Ya corriste el SQL 03 en Supabase?');}
    });
    on('#nuevos',()=>{S.profe.nuevos={};render();});
    on('#cerrarn',async()=>{S.profe.nuevos=null;await cargarResumen();render();});
    on('#crearn',crearAlumnos);
    on('#imprimir',()=>window.print());
    $app.querySelectorAll('tr.fila').forEach(tr=>tr.onclick=()=>abrirAlumno(tr.dataset.id));
  }
  if(p==='profedet'){
    on('#volverp',async()=>{await cargarResumen();S.pantalla='profepanel';render();});
    on('#cpin',async()=>{
      const v=$app.querySelector('#npin').value.trim();
      if(!/^\d{4}$/.test(v)){toast('El PIN debe tener 4 números.');return;}
      try{await rpc('profe_cambiar_pin',{p_id:S.profe.alumno.alumno_id,p_pin:v},S.profe.jwt);S.profe.alumno.pin=v;toast('PIN guardado: '+v);render();}
      catch(e){toast('No se pudo guardar el PIN.');}
    });
    on('#cnombre',async()=>{
      const v=$app.querySelector('#nnombre').value.trim();if(!v){toast('Escribe un nombre.');return;}
      try{await rpc('profe_renombrar',{p_id:S.profe.alumno.alumno_id,p_nombre:v},S.profe.jwt);S.profe.alumno.nombre=v;toast('Nombre guardado');render();}
      catch(e){toast(/unique|duplicate/i.test(e.message)?'Ya existe un alumno con ese nombre.':'No se pudo guardar el nombre.');}
    });
    on('#cbaja',async()=>{
      const a=S.profe.alumno,nuevo=a.activo===false;
      if(!nuevo&&!confirm('¿Dar de baja a '+a.nombre+'? Ya no podrá entrar, pero se conserva su historial.'))return;
      try{await rpc('profe_activar',{p_id:a.alumno_id,p_activo:nuevo},S.profe.jwt);await cargarResumen();S.pantalla='profepanel';render();toast(nuevo?'Alumno reactivado':'Alumno dado de baja');}
      catch(e){toast('No se pudo. ¿Ya corriste el SQL 03 en Supabase?');}
    });
    on('#celim',async()=>{
      const a=S.profe.alumno;
      if(!confirm('¿Eliminar DEFINITIVAMENTE a '+a.nombre+' y todo su progreso? Esto no se puede deshacer.'))return;
      try{await rpc('profe_eliminar',{p_id:a.alumno_id},S.profe.jwt);await cargarResumen();S.pantalla='profepanel';render();toast('Alumno eliminado');}
      catch(e){toast('No se pudo eliminar.');}
    });
  }
}
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA'].includes((document.activeElement||{}).tagName))return;
  const k=e.key;
  if(S.pantalla==='pin'){if(/^\d$/.test(k))teclaPin(k);else if(k==='Backspace')teclaPin('del');}
  else if(S.pantalla==='juego'){if(/^\d$/.test(k))teclaJ(k);else if((k==='.'||k===',')&&S.j&&S.j.punto)teclaJ('.');else if(k==='Backspace')teclaJ('del');else if(k==='Enter'){S.j.estado==='mostrar'?siguiente():teclaJ('ok');}}
});

// ---------- acciones: alumno ----------
async function cargarNombres(){
  S.errRed=false;
  try{S.alumnos=await rpc('lista_alumnos');}catch(e){S.errRed=true;S.alumnos=[];}
  if(S.pantalla==='login'||S.pantalla==='cargando'){S.pantalla='login';render();}
}
async function teclaPin(k){
  if(k==='del')S.pin=S.pin.slice(0,-1);else if(S.pin.length<4)S.pin+=k;
  S.pinMsg='';render();
  if(S.pin.length===4){
    try{
      const r=await rpc('login_alumno',{p_id:S.pinAlumno,p_pin:S.pin});
      if(r.ok){S.token=r.token;S.nombre=r.nombre;store.set('mate_token',r.token);store.set('mate_nombre',r.nombre);
        await flushPend();await cargarProg();S.pantalla='materias';render();}
      else{S.pin='';S.pinMsg=r.error==='bloqueado'?'Espera 5 minutos o pide ayuda a tu profe.':'Ese PIN no es. Intenta otra vez.';render();}
    }catch(e){S.pin='';S.pinMsg=e.red?'No hay internet.':'Algo falló. Intenta otra vez.';render();}
  }
}
function empezar(){
  const m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);
  if(m.esp){empezarEsp();return;}
  S.noGuardado=false;
  S.j={punto:!!m.punto,preguntas:l.gen(),i:0,intento:1,aciertos:0,racha:0,detalle:[],respuesta:'',estado:'esperando',pista:false,primera:null,anim:'nueva',fraseIni:window.FX.frase('inicio')};
  S.pantalla='juego';render();S.j.anim=null;
}
function teclaJ(k){
  const j=S.j;if(j.estado==='bien'||j.estado==='mostrar')return;
  if(k==='del'){j.respuesta=j.respuesta.slice(0,-1);if(j.estado==='casi')j.estado='casi';render();return;}
  if(k==='ok'){comprobar();return;}
  if(k==='.'){if(j.respuesta.includes('.'))return;if(j.respuesta==='')j.respuesta='0';}
  if(j.respuesta.length<8)j.respuesta+=k;render();
}
const txtC=(p,r)=>p.opciones?p.opciones[r]:window.fmtNum(r);
const txtR=(p,r)=>p.opciones?p.opciones[Number(r)]:r;
function comprobar(){
  const j=S.j,p=j.preguntas[j.i];if(j.respuesta==='')return;
  const ok=Math.abs(Number(j.respuesta)-p.resp)<1e-9;
  if(ok){
    j.detalle.push({q:p.det||p.q,c:txtC(p,p.resp),d:txtR(p,j.primera??j.respuesta),ok:j.intento===1});
    if(j.intento===1)j.aciertos++;
    if(j.intento===1)j.racha++;else j.racha=0;
    const gran=j.racha>=3;
    j.frase=gran?window.FX.frase('racha'):window.FX.frase('bien');
    j.estado='bien';j.anim='bien';render();j.anim=null;
    const c=window.FX.centro('#resp');
    window.FX.sonido(gran?'racha':'bien');
    window.FX.confeti({n:gran?90:34,x:c.x,y:c.y,fuerza:gran?13:9});
    window.FX.flotar(j.intento===1?'+1 ⭐':'¡Bien!',$app.querySelector('#resp'));
    setTimeout(siguiente,gran?1100:900);
  }else if(j.intento===1){
    j.primera=j.respuesta;j.intento=2;j.estado='casi';j.respuesta='';j.racha=0;j.frase=window.FX.frase('casi');
    j.anim='mal';render();j.anim=null;window.FX.sonido('mal');window.FX.vibrar(80);
  }else{
    j.detalle.push({q:p.det||p.q,c:txtC(p,p.resp),d:txtR(p,j.primera),ok:false});
    j.racha=0;j.frase=window.FX.frase('mostrar');
    j.estado='mostrar';j.anim='mal';render();j.anim=null;window.FX.sonido('mal');window.FX.vibrar(120);
  }
}
function siguiente(){
  const j=S.j;if(!j||S.pantalla!=='juego')return;
  if(j.estado!=='bien'&&j.estado!=='mostrar')return;
  j.i++;j.intento=1;j.respuesta='';j.estado='esperando';j.pista=false;j.primera=null;
  if(j.i>=j.preguntas.length){terminar();return;}
  j.anim='nueva';render();j.anim=null;
}
async function terminar(){
  const j=S.j,pasa=j.aciertos>=CFG.UMBRAL,est=!pasa?0:(j.aciertos>=10?3:(j.aciertos===9?2:1));
  const k=key(S.mod,S.niv),a=S.prog[k]||{modulo:S.mod,nivel:S.niv,completado:false,estrellas:0,mejor:0,intentos:0};
  S.prog[k]={...a,completado:a.completado||pasa,estrellas:Math.max(a.estrellas,est),mejor:Math.max(a.mejor,j.aciertos),intentos:a.intentos+1};
  const args={p_modulo:S.mod,p_nivel:S.niv,p_aciertos:j.aciertos,p_total:CFG.TOTAL,p_detalle:j.detalle};
  S.pantalla='resultado';render();celebrar(pasa,est);
  try{await rpc('guardar_intento',{p_token:S.token,...args});}
  catch(e){
    if(/sesion_invalida/.test(e.message)){sesionCaida();return;}
    const p=pend();p.push({a:args});lset('mate_pend',JSON.stringify(p));S.noGuardado=true;render();
  }
}
// fiesta al terminar un nivel
function celebrar(pasa,est){
  const F=window.FX;
  if(pasa){
    const m=mod(S.mod);if(m&&m.niveles.some(x=>x.n===S.niv+1))S.recien={m:S.mod,n:S.niv+1};
    setTimeout(()=>F.sonido('nivel'),150);
    F.confeti({n:110,x:innerWidth*.25,y:innerHeight*.55,fuerza:15,abanico:1.2});F.confeti({n:110,x:innerWidth*.75,y:innerHeight*.55,fuerza:15,abanico:1.2});
    for(let i=0;i<est;i++)setTimeout(()=>F.sonido('estrella',i),600+i*500);
    if(est===3)setTimeout(()=>{F.lluvia(['⭐','🌟','✨'],18);F.confeti({n:140,y:innerHeight*.3,fuerza:16,abanico:2.4});},1700);
  }else{F.sonido('triste');F.vibrar(150);}
}

// ---------- acciones: profe ----------
async function cargarResumen(){
  try{S.profe.resumen=await rpc('profe_resumen',{},S.profe.jwt)||[];}
  catch(e){if(e.status===401||/JWT|no_autorizado/i.test(e.message)){S.profe.msg='Tu sesión terminó o la cuenta no es de profesor.';S.profe.jwt=null;S.pantalla='profelogin';}else toast('No se pudo cargar el avance.');}
}
async function abrirAlumno(id){
  const a=S.profe.resumen.find(x=>x.alumno_id===id);S.profe.alumno=a;
  try{S.profe.det=await rpc('profe_detalle',{p_id:id},S.profe.jwt)||[];S.profe.errores=await rpc('profe_errores',{p_id:id},S.profe.jwt)||[];S.pantalla='profedet';render();}
  catch(e){toast('No se pudo abrir al alumno.');}
}
async function crearAlumnos(){
  const txt=$app.querySelector('#lista').value;
  const lineas=txt.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!lineas.length){toast('Escribe al menos un nombre.');return;}
  const usados=new Set(),res=[];
  for(const l of lineas){
    let nombre=l,pin='';
    const m=l.match(/^(.*?)[,;]\s*(\d{4})$/);
    if(m){nombre=m[1].trim();pin=m[2];}
    if(!pin)pin=String(Math.floor(1000+Math.random()*9000));
    try{await rpc('profe_crear_alumno',{p_nombre:nombre,p_pin:pin},S.profe.jwt);res.push({nombre,pin,ok:true});}
    catch(e){res.push({nombre,pin,ok:false,err:/unique|duplicate/i.test(e.message)?'Ya existe ese nombre':'No se pudo crear'});}
  }
  try{await cargarResumen();}catch(e){}
  S.profe.nuevos={resultado:res};render();
}

// ---------- arranque ----------
async function rutear(){
  if(location.hash==='#profe'){S.pantalla=S.profe.jwt?'profepanel':'profelogin';render();return;}
  const t=store.get('mate_token');
  if(t){
    S.token=t;S.nombre=store.get('mate_nombre')||'';
    try{await cargarProg();S.pantalla='materias';render();return;}catch(e){S.token=null;store.del('mate_token');}
  }
  S.pantalla='cargando';render();cargarNombres();
}
window.addEventListener('hashchange',rutear);
rutear();
if('serviceWorker' in navigator){/* sin modo sin conexión en la versión 1 */}
window.__S=S;
})();
