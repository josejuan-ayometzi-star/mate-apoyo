// ============================================================
// Mate Apoyo · lógica de la app (alumnos y panel del profesor)
// ============================================================
(function(){
const $app=document.getElementById('app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const S={pantalla:'cargando',alumnos:[],token:null,nombre:null,prog:{},pin:'',pinAlumno:null,pinMsg:'',
  mod:null,niv:null,j:null,profe:{jwt:null,resumen:[],det:null,errores:[],alumno:null,nuevos:null,msg:''}};
const mod=id=>window.MODULOS.find(m=>m.id===id);
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
function top(extra=''){return `<div class="top"><div class="ver">${esc(CFG.VERSION)}</div>${extra}</div>`;}
function vCargando(){return `${top()}<div class="card"><p>Cargando…</p></div>`;}
function vLogin(){
  const l=S.alumnos;
  return `${top()}<h1>¡Hola! 👋</h1><p>Toca tu nombre para entrar.</p>
  ${S.errRed?`<div class="card"><p>No hay internet por ahora. Revisa tu conexión y toca el botón.</p><button class="btn" id="reint">Reintentar</button></div>`:''}
  <div class="grid g-nombres" id="nombres">${l.map(a=>`<button class="nombre" data-id="${esc(a.id)}" data-n="${esc(a.nombre)}">${esc(a.nombre)}</button>`).join('')}</div>
  ${(!l.length&&!S.errRed)?'<p>Todavía no hay alumnos registrados. Pide a tu profe que los agregue.</p>':''}
  <div class="pie"><button class="enlace" id="irprofe">Soy el profe</button></div>`;
}
function vPin(){
  const pts=[0,1,2,3].map(i=>`<i class="${i<S.pin.length?'on':''}"></i>`).join('');
  return `${top('<button class="btn sec chico" id="atras">← Cambiar nombre</button>')}
  <h1>${esc(S.pinNombre)}</h1><p>Escribe tu PIN de 4 números.</p>
  <div class="pin-pts">${pts}</div><div class="msg casi">${esc(S.pinMsg)}</div>
  ${teclado(false)}`;
}
function teclado(conListo){
  const k=n=>`<button data-k="${n}">${n}</button>`;
  return `<div class="teclado" id="teclado">${[1,2,3,4,5,6,7,8,9].map(k).join('')}<button class="bor" data-k="del" aria-label="Borrar">⌫</button>${k(0)}${conListo?`<button class="listo" data-k="ok" aria-label="Listo">✓</button>`:'<span></span>'}</div>`;
}
function vHome(){
  const tablas=window.MODULOS.filter(m=>m.grupo==='tablas');
  const ops=window.MODULOS.filter(m=>m.grupo==='operaciones');
  return `${top(`<div><span class="chip-user">${esc(S.nombre)}</span> <button class="btn sec chico" id="salir">Salir</button></div>`)}
  <h1>¿Qué practicamos hoy?</h1>
  <h2>Tablas de multiplicar</h2>
  <div class="tablas">${tablas.map(m=>{const r=resumenMod(m);return `<button class="tb ${r.h===r.tot?'hecho':''}" data-m="${m.id}"><div class="n">${m.corto}</div><div class="st">${'★'.repeat(Math.round(r.e/m.niveles.length))||'&nbsp;'}</div></button>`;}).join('')}</div>
  <h2>Operaciones</h2>
  <div class="grid g-mod">${ops.map(m=>{const r=resumenMod(m);return `<button class="mod" data-m="${m.id}"><div class="ic">${m.icono}</div><div class="ti">${m.titulo}</div><div class="pr">${r.h} de ${r.tot} niveles</div><div class="prog"><i style="width:${r.h/r.tot*100}%"></i></div></button>`;}).join('')}</div>`;
}
function vNiveles(){
  const m=mod(S.mod);
  return `${top(`<button class="btn sec chico" id="home">← Inicio</button>`)}
  <h1>${esc(m.titulo)}</h1><p>Pasa cada nivel con ${CFG.UMBRAL} aciertos de ${CFG.TOTAL} para abrir el siguiente.</p>
  <div class="niveles">${m.niveles.map(l=>{const p=pr(m.id,l.n);const ab=abierto(m.id,l.n);const h=hecho(m.id,l.n);
    return `<button class="niv ${h?'hecho':''} ${ab?'':'cerrado'}" data-n="${l.n}" ${ab?'':'disabled'}><div class="num">${ab?(h?'✓':l.n):'🔒'}</div><div><div class="nm">${esc(l.nombre)}</div><div class="sub">${p?`Mejor: ${p.mejor} de ${CFG.TOTAL} · ${p.intentos} intento${p.intentos===1?'':'s'}`:(ab?'¡Listo para empezar!':'Pasa el nivel anterior')}</div></div>${h?estrellasHtml(p.estrellas):''}</button>`;}).join('')}</div>`;
}
function vIntro(){
  const m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);
  return `${top(`<button class="btn sec chico" id="volver">← Niveles</button>`)}
  <h1>${esc(m.titulo)} · Nivel ${l.n}</h1><h2 style="margin-top:4px">${esc(l.nombre)}</h2>
  <div class="recuerda"><b>Recuerda:</b> ${esc(l.recuerda)}</div>
  <p>Son ${CFG.TOTAL} preguntas. Si fallas, puedes intentarlo otra vez y ver una pista. Para pasar necesitas ${CFG.UMBRAL} bien a la primera. Si no lo logras, practicas de nuevo con números nuevos.</p>
  <div class="fila-acc"><button class="btn ok" id="empezar">¡Empezar!</button></div>`;
}
function vis(p){
  const v=p.vis;
  if(v.tipo==='col'){const a=String(v.a),b=String(v.b);return `<div class="col"><div class="r"><span>${a}</span></div><div class="r"><span class="op">${v.op}</span><span>${b}</span></div><div class="raya"></div></div>`;}
  if(v.tipo==='div'){return `<div class="galera"><span class="dv">${v.divisor}</span><span class="dd">${v.dividendo}</span></div>`;}
  return `<div class="q-linea">${esc(p.q)}</div>`;
}
function vJuego(){
  const j=S.j,p=j.preguntas[j.i];
  const resp=j.respuesta===''?'?':esc(j.respuesta);
  const cls=j.estado==='bien'?'bien':(j.estado==='casi'?'casi':'');
  let msg='';
  if(j.estado==='bien')msg=`<div class="msg bien pop">¡Muy bien! 🎉</div>`;
  else if(j.estado==='casi')msg=`<div class="msg casi pop">Casi… mira la pista y prueba otra vez 💪</div>`;
  else if(j.estado==='mostrar')msg=`<div class="msg casi pop">La respuesta es <b>${p.resp}</b>. ¡Sigue, tú puedes!</div>`;
  else msg='<div class="msg">&nbsp;</div>';
  const mostrarPista=j.pista||j.estado==='casi'||j.estado==='mostrar';
  return `${top(`<button class="btn sec chico" id="abandonar">✕ Salir</button>`)}
  <div class="ver" style="text-align:center">Pregunta ${j.i+1} de ${j.preguntas.length}</div>
  <div class="prog"><i style="width:${(j.i)/j.preguntas.length*100}%"></i></div>
  <div class="q-box">${vis(p)}</div>
  <div class="respuesta ${j.respuesta===''?'vacio':''} ${cls}" id="resp">${resp}</div>
  ${msg}
  ${mostrarPista?`<div class="pista">💡 ${esc(p.pista)}</div>`:''}
  ${j.estado==='mostrar'?`<div class="fila-acc"><button class="btn" id="sig">Siguiente →</button></div>`
   :(j.estado==='bien'?'':`${teclado(true)}<div class="fila-acc"><button class="btn sec chico" id="pista">💡 Pista</button></div>`)}`;
}
function vResultado(){
  const j=S.j,m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);const pasa=j.aciertos>=CFG.UMBRAL;
  const est=!pasa?0:(j.aciertos>=10?3:(j.aciertos===9?2:1));
  const fallos=j.detalle.filter(d=>!d.ok);
  const haySig=m.niveles.some(x=>x.n===S.niv+1);
  return `${top('')}
  <div class="res-gde">${pasa?'🎉':'💪'}</div>
  <h1 style="text-align:center">${pasa?'¡Lo lograste!':'¡Casi lo logras!'}</h1>
  <p style="text-align:center;font-size:22px">${j.aciertos} de ${CFG.TOTAL} bien a la primera</p>
  ${pasa?`<div class="res-est">${'★'.repeat(est)}${'☆'.repeat(3-est)}</div>`:`<p style="text-align:center">Con otra práctica lo logras. Los números van a cambiar.</p>`}
  ${fallos.length?`<h2>Para repasar</h2>${fallos.map(f=>`<div class="fall">${esc(f.q.replace('?',f.c).replace('□',f.c))}${/[+−×÷]/.test(f.q)&&!/[=]/.test(f.q)?' = '+esc(f.c):''}</div>`).join('')}`:''}
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
  const P=S.profe,r=P.resumen;
  return `${top(`<button class="btn sec chico" id="salirp">Salir</button>`)}<h1>Avance del grupo</h1>
  <div class="fila-acc" style="justify-content:flex-start;margin-bottom:12px">
   <button class="btn chico" id="nuevos">+ Agregar alumnos</button><button class="btn sec chico" id="act">↻ Actualizar</button></div>
  ${P.nuevos?vNuevos():''}
  <table class="t"><thead><tr><th>Alumno</th><th>Niveles ✓</th><th>★</th><th>Intentos</th><th>Última vez</th><th>Estado</th></tr></thead><tbody>
  ${r.map(a=>`<tr class="fila" data-id="${esc(a.alumno_id)}"><td><b>${esc(a.nombre)}</b></td><td>${a.niveles_completados}</td><td>${a.estrellas}</td><td>${a.intentos}</td><td>${ago(a.ultima_actividad)}</td><td>${etiqueta(a)}</td></tr>`).join('')}
  </tbody></table>${r.length?'':'<p>Aún no hay alumnos. Usa "Agregar alumnos".</p>'}`;
}
function vNuevos(){
  const n=S.profe.nuevos;
  if(n.resultado){return `<div class="card" style="margin-bottom:14px"><h2 style="margin-top:0">PINes asignados</h2><p>Anótalos o imprímelos ahora: después ya no se pueden ver (solo cambiarlos).</p>
   <table class="t"><thead><tr><th>Alumno</th><th>PIN</th><th>Estado</th></tr></thead><tbody>${n.resultado.map(x=>`<tr><td>${esc(x.nombre)}</td><td><b>${esc(x.pin)}</b></td><td>${x.ok?'<span class="etq ok">Creado</span>':'<span class="etq alerta">'+esc(x.err)+'</span>'}</td></tr>`).join('')}</tbody></table>
   <div class="fila-acc" style="justify-content:flex-start;margin-top:10px"><button class="btn sec chico" id="cerrarn">Cerrar</button><button class="btn chico" id="imprimir">Imprimir</button></div></div>`;}
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
  ${P.det.map(d=>{const m=mod(d.modulo);return `<tr><td>${esc(m?m.titulo:d.modulo)}</td><td>${d.nivel}</td><td>${d.completado?'<span class="etq ok">Pasado</span>':'<span class="etq gris">En práctica</span>'}</td><td>${d.mejor}/${CFG.TOTAL}</td><td>${d.estrellas}</td><td>${d.intentos}</td></tr>`;}).join('')}
  </tbody></table>${P.det.length?'':'<p>Todavía no ha practicado.</p>'}
  <h2>Errores más frecuentes</h2>
  ${P.errores.length?`<table class="t"><thead><tr><th>Tema</th><th>Pregunta</th><th>Veces</th><th>Contestó</th><th>Correcta</th></tr></thead><tbody>${P.errores.map(e=>{const m=mod(e.modulo);return `<tr><td>${esc(m?m.titulo:e.modulo)}</td><td>${esc(e.pregunta)}</td><td>${e.veces}</td><td>${esc(e.ultima_respuesta??'')}</td><td>${esc(e.correcta)}</td></tr>`;}).join('')}</tbody></table>`:'<p>Sin errores registrados.</p>'}
  <h2>Cambiar PIN</h2>
  <div class="card"><div class="fila-form"><div><label>Nuevo PIN (4 números)</label><input type="text" id="npin" inputmode="numeric" maxlength="4"></div><div></div><button class="btn" id="cpin">Guardar PIN</button></div></div>`;
}

// ---------- render + eventos ----------
function render(){
  const p=S.pantalla;
  const v={cargando:vCargando,login:vLogin,pin:vPin,home:vHome,niveles:vNiveles,intro:vIntro,juego:vJuego,resultado:vResultado,profelogin:vProfeLogin,profepanel:vProfePanel,profedet:vProfeDetalle}[p];
  $app.innerHTML=v();bind();
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
  if(p==='home'){
    on('#salir',salir);
    $app.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{S.mod=b.dataset.m;S.pantalla='niveles';render();});
  }
  if(p==='niveles'){
    on('#home',()=>{S.pantalla='home';render();});
    $app.querySelectorAll('.niv:not(.cerrado)').forEach(b=>b.onclick=()=>{S.niv=Number(b.dataset.n);S.pantalla='intro';render();});
  }
  if(p==='intro'){
    on('#volver',()=>{S.pantalla='niveles';render();});
    on('#empezar',empezar);
  }
  if(p==='juego'){
    on('#abandonar',()=>{if(confirm('¿Quieres salir? Este intento no se guardará.')){S.pantalla='niveles';render();}});
    $app.querySelectorAll('#teclado button').forEach(b=>b.onclick=()=>teclaJ(b.dataset.k));
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
      try{await rpc('profe_cambiar_pin',{p_id:S.profe.alumno.alumno_id,p_pin:v},S.profe.jwt);toast('PIN cambiado: '+v);$app.querySelector('#npin').value='';}
      catch(e){toast('No se pudo cambiar el PIN.');}
    });
  }
}
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA'].includes((document.activeElement||{}).tagName))return;
  const k=e.key;
  if(S.pantalla==='pin'){if(/^\d$/.test(k))teclaPin(k);else if(k==='Backspace')teclaPin('del');}
  else if(S.pantalla==='juego'){if(/^\d$/.test(k))teclaJ(k);else if(k==='Backspace')teclaJ('del');else if(k==='Enter'){S.j.estado==='mostrar'?siguiente():teclaJ('ok');}}
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
        await flushPend();await cargarProg();S.pantalla='home';render();}
      else{S.pin='';S.pinMsg=r.error==='bloqueado'?'Espera 5 minutos o pide ayuda a tu profe.':'Ese PIN no es. Intenta otra vez.';render();}
    }catch(e){S.pin='';S.pinMsg=e.red?'No hay internet.':'Algo falló. Intenta otra vez.';render();}
  }
}
function empezar(){
  const m=mod(S.mod),l=m.niveles.find(x=>x.n===S.niv);
  S.noGuardado=false;
  S.j={preguntas:l.gen(),i:0,intento:1,aciertos:0,detalle:[],respuesta:'',estado:'esperando',pista:false,primera:null};
  S.pantalla='juego';render();
}
function teclaJ(k){
  const j=S.j;if(j.estado==='bien'||j.estado==='mostrar')return;
  if(k==='del'){j.respuesta=j.respuesta.slice(0,-1);if(j.estado==='casi')j.estado='casi';render();return;}
  if(k==='ok'){comprobar();return;}
  if(j.respuesta.length<6)j.respuesta+=k;render();
}
function comprobar(){
  const j=S.j,p=j.preguntas[j.i];if(j.respuesta==='')return;
  const ok=Number(j.respuesta)===p.resp;
  if(ok){
    j.detalle.push({q:p.q,c:String(p.resp),d:j.primera??j.respuesta,ok:j.intento===1});
    if(j.intento===1)j.aciertos++;
    j.estado='bien';render();setTimeout(siguiente,850);
  }else if(j.intento===1){
    j.primera=j.respuesta;j.intento=2;j.estado='casi';j.respuesta='';render();
  }else{
    j.detalle.push({q:p.q,c:String(p.resp),d:j.primera,ok:false});
    j.estado='mostrar';render();
  }
}
function siguiente(){
  const j=S.j;if(!j||S.pantalla!=='juego')return;
  if(j.estado!=='bien'&&j.estado!=='mostrar')return;
  j.i++;j.intento=1;j.respuesta='';j.estado='esperando';j.pista=false;j.primera=null;
  if(j.i>=j.preguntas.length){terminar();return;}
  render();
}
async function terminar(){
  const j=S.j,pasa=j.aciertos>=CFG.UMBRAL,est=!pasa?0:(j.aciertos>=10?3:(j.aciertos===9?2:1));
  const k=key(S.mod,S.niv),a=S.prog[k]||{modulo:S.mod,nivel:S.niv,completado:false,estrellas:0,mejor:0,intentos:0};
  S.prog[k]={...a,completado:a.completado||pasa,estrellas:Math.max(a.estrellas,est),mejor:Math.max(a.mejor,j.aciertos),intentos:a.intentos+1};
  const args={p_modulo:S.mod,p_nivel:S.niv,p_aciertos:j.aciertos,p_total:CFG.TOTAL,p_detalle:j.detalle};
  S.pantalla='resultado';render();
  try{await rpc('guardar_intento',{p_token:S.token,...args});}
  catch(e){
    if(/sesion_invalida/.test(e.message)){sesionCaida();return;}
    const p=pend();p.push({a:args});lset('mate_pend',JSON.stringify(p));S.noGuardado=true;render();
  }
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
  S.profe.nuevos={resultado:res};render();
}

// ---------- arranque ----------
async function rutear(){
  if(location.hash==='#profe'){S.pantalla=S.profe.jwt?'profepanel':'profelogin';render();return;}
  const t=store.get('mate_token');
  if(t){
    S.token=t;S.nombre=store.get('mate_nombre')||'';
    try{await cargarProg();S.pantalla='home';render();return;}catch(e){S.token=null;store.del('mate_token');}
  }
  S.pantalla='cargando';render();cargarNombres();
}
window.addEventListener('hashchange',rutear);
rutear();
if('serviceWorker' in navigator){/* sin modo sin conexión en la versión 1 */}
window.__S=S;
})();
