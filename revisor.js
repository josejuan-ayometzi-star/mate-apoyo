/* Revisor de cuentos · pantalla del alumno.
   PRIVACIDAD: el cuento y la revisión viven SOLO en variables de esta función (memoria de la página).
   No se usa localStorage, sessionStorage, cookies ni console.log con el texto. Al salir o cambiar de alumno, parar() lo borra. */
(function(){
const GEN=[
 ['aventura','Aventura','Un viaje o una misión llena de riesgos y descubrimientos'],
 ['misterio','Misterio','Un secreto o un robo que se resuelve con pistas'],
 ['cienciaficcion','Ciencia ficción','Inventos, tecnología, espacio y futuro'],
 ['humor','Humor','Situaciones graciosas, enredos y personajes chistosos'],
 ['realista','Realista','Vida diaria, con problemas que podrían ser reales'],
 ['terror','Terror suave o suspenso','Emoción y un poco de miedo, sin violencia'],
 ['historico','Histórico','Ocurre en una época del pasado'],
 ['leyenda','Leyenda o mito','Explica cómo nació algo con la tradición'],
 ['fabula','Fábula','Animales que actúan como personas y dejan una enseñanza'],
 ['deportivo','Deportivo','Una competencia, un equipo o un reto deportivo'],
 ['fantasia','Fantasía','Magia, criaturas y mundos imaginarios']];
const PARTES=[
 {id:'inicio',nombre:'Inicio',color:'#FFF2B3',guia:'Presenta a tus personajes, el lugar y el tiempo en que ocurre la historia.'},
 {id:'desarrollo',nombre:'Desarrollo',color:'#C9E4F5',guia:'Cuenta el problema y lo que intentan hacer los personajes para resolverlo.'},
 {id:'cierre',nombre:'Cierre',color:'#D5EBD0',guia:'Cuenta cómo se resuelve el problema y cómo termina la historia.'}];
const TIPOS={ortografia:'Ortografía',puntuacion:'Puntuación',redaccion:'Redacción',estructura:'Estructura',genero:'Género'};
const ENC={si:['Va muy bien con el género','si'],en_parte:['Va bien, pero se puede reforzar el género','par'],todavia_no:['Todavía no se nota el género','no']};
const MAX=9000;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const palabras=t=>(t.trim().match(/\S+/g)||[]).length;

const CSS=`
#rv{--tinta:#1f2421;--gris:#5d6a65;--linea:#d6c8a4;--azul:#1f2d86;--verde:#0a8143;--nar:#ec5923;--vino:#a1233f;
 display:flex;flex-direction:column;gap:12px;color:var(--tinta);font-family:'Trebuchet MS','Segoe UI',system-ui,sans-serif;font-size:17px;line-height:1.45;text-align:left;width:100%}
#rv *{box-sizing:border-box}
#rv p{color:inherit;font-size:inherit;line-height:inherit;margin:0}
#rv h2,#rv h3{color:var(--tinta);font-family:var(--letra);margin:0}
#rv .rv-card{background:#fbf6ea;border:2px solid var(--linea);border-radius:16px;padding:14px 16px}
#rv .rv-pasos{display:flex;gap:8px;flex-wrap:wrap}
#rv .rv-paso{flex:1 1 90px;text-align:center;font-weight:800;font-size:14px;padding:7px 6px;border-radius:999px;background:#e9dfc4;color:var(--gris)}
#rv .rv-paso.on{background:var(--azul);color:#fff}
#rv label.rv-l{color:var(--tinta);display:block;font-weight:800;margin:0 0 6px}
#rv .rv-ayuda{color:var(--gris);font-size:14.5px;margin-top:4px}
#rv input.rv-in{width:100%;font:600 20px 'Trebuchet MS',system-ui,sans-serif;padding:12px 14px;border-radius:12px;border:2px solid var(--linea);background:#fff;color:var(--tinta);-webkit-user-select:text;user-select:text}
#rv .rv-gens{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
#rv button{font:700 16px 'Trebuchet MS',system-ui,sans-serif;border-radius:12px;padding:12px 16px;min-height:48px;cursor:pointer;border:2px solid var(--linea);background:#fff;color:var(--tinta);-webkit-tap-highlight-color:transparent}
#rv button.rv-g{text-align:left;padding:10px 12px;display:flex;flex-direction:column;gap:2px;background:#fffdf6}
#rv button.rv-g b{font-size:17px}#rv button.rv-g span{font-size:13.5px;font-weight:500;color:var(--gris)}
#rv button.rv-g.on{border-color:var(--azul);background:#e6e9ff;box-shadow:0 0 0 2px var(--azul) inset}
#rv button.rv-pri{background:var(--verde);border-color:var(--verde);color:#fff}
#rv button.rv-nar{background:var(--nar);border-color:var(--nar);color:#fff}
#rv button:disabled{opacity:.45;cursor:default}
#rv button:focus-visible,#rv input:focus-visible,#rv textarea:focus-visible{outline:3px solid var(--nar);outline-offset:2px}
#rv .rv-acc{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
#rv .rv-tabs{display:flex;gap:6px;align-items:flex-end}
#rv .rv-tab{flex:1;border-radius:12px 12px 0 0!important;border-bottom:0!important;min-height:50px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;padding:6px 8px!important;}
#rv .rv-tab small{font-weight:600;font-size:12px;color:var(--gris)}
#rv .rv-tab.on{min-height:58px;font-weight:900;box-shadow:0 -3px 0 var(--azul) inset}
#rv .rv-marco{padding:12px;border-radius:0 0 14px 14px;border:2px solid var(--linea);margin-top:-2px}
#rv .rv-guia{font-weight:700;margin:0 0 10px!important}
#rv textarea.rv-hoja{display:block;width:100%;min-height:360px;resize:vertical;border:0;border-left:4px solid #d9534f;border-radius:8px;padding:5px 14px 5px 22px;
 font:22px/34px 'Trebuchet MS',system-ui,sans-serif;color:#1f2421;background-color:#fffef8;background-attachment:local;
 background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 33px,#b9d4ea 33px,#b9d4ea 34px);-webkit-user-select:text;user-select:text}
#rv .rv-cont{color:var(--gris);font-weight:700;font-size:14.5px}
#rv .rv-aviso{padding:10px 14px;border-radius:12px;font-weight:700;background:#fff3d6;border:2px solid #e8c36a}
#rv .rv-aviso.mal{background:#fde4e4;border-color:#d98a8a;color:#7a1f1f}
#rv .rv-carga{text-align:center;padding:30px 16px}
#rv .rv-giro{width:44px;height:44px;border:5px solid #e9dfc4;border-top-color:var(--nar);border-radius:50%;margin:0 auto 12px;animation:rvg 1s linear infinite}
@keyframes rvg{to{transform:rotate(360deg)}}
#rv ul.rv-bien{margin:6px 0 0;padding-left:22px}
#rv .rv-gen{display:inline-block;font-weight:800;border-radius:999px;padding:5px 12px;font-size:15px}
#rv .rv-gen.si{background:#d5ebd0;color:#0a5a2d}#rv .rv-gen.par{background:#fff2b3;color:#6b4e00}#rv .rv-gen.no{background:#dfe6f0;color:#2b3f66}
#rv .rv-pt{padding:7px 12px;border-radius:10px;font-weight:800;margin-top:6px}
#rv .rv-sug{background:#fff;border:2px solid var(--linea);border-radius:14px;padding:12px 14px;margin-top:8px;display:flex;flex-direction:column;gap:6px}
#rv .rv-sug.hecha{opacity:.55;background:#f3f1e8}
#rv .rv-tipo{align-self:flex-start;font-size:13px;font-weight:800;padding:3px 10px;border-radius:999px;background:#e6e9ff;color:var(--azul)}
#rv .rv-frag{font-style:italic;background:#fff2b3;padding:2px 6px;border-radius:6px}
#rv .rv-nuevo{font-weight:800;color:var(--verde)}
#rv .rv-chk{display:flex;gap:8px;align-items:center;font-weight:700;min-height:44px}
#rv .rv-chk input{width:26px;height:26px}
#rv .rv-conf{position:fixed;inset:0;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;z-index:50}
#rv .rv-conf>div{background:#fbf6ea;border-radius:18px;padding:20px;max-width:460px;width:100%;display:flex;flex-direction:column;gap:12px}
@media(max-width:600px){#rv textarea.rv-hoja{font-size:20px;min-height:300px}}
@media(prefers-reduced-motion:reduce){#rv .rv-giro{animation:none}}`;

function iniciar(root,ctx){
  let ST={paso:1,titulo:'',gens:[],idea:'',parte:'inicio',txt:{inicio:'',desarrollo:'',cierre:''},rev:null,hechas:{},cargando:false,msg:null,restantes:null,ctrl:null,conf:null};
  const q=s=>root.querySelector(s);
  const todo=()=>PARTES.reduce((s,p)=>s+ST.txt[p.id].length,0);
  const hayTexto=()=>!!(ST.titulo.trim()||ST.idea.trim()||todo());
  const PASOS=['Mi cuento','Escribo','Revisión'];
  const cab=()=>`<div class="rv-pasos">${PASOS.map((n,i)=>`<div class="rv-paso ${ST.paso===i+1?'on':''}">${i+1}. ${n}</div>`).join('')}</div>`;
  const conf=()=>ST.conf?`<div class="rv-conf"><div><h3>¿Quieres salir?</h3><p>Tu cuento <b>no se guarda</b> en ningún lugar. Si sales, se borra de la pantalla. ¿Ya lo copiaste?</p>
    <div class="rv-acc"><button id="rvcopiar2">Copiar mi cuento</button><button class="rv-nar" id="rvsalir">Salir y borrar</button><button class="rv-pri" id="rvseguir">Seguir aquí</button></div><p class="rv-ayuda" id="rvcm"></p></div></div>`:'';

  function paso1(){
    root.innerHTML=`${cab()}<div class="rv-card"><h2>Hola, ${esc(String(ctx.nombre||'escritor').replace(/\.$/,''))}. ¡Vamos a revisar tu cuento!</h2>
      <p class="rv-ayuda">Aquí no se guarda nada: tu cuento se queda solo en esta pantalla. Te daré sugerencias, pero tú decides qué cambiar.</p></div>
     <div class="rv-card"><label class="rv-l" for="rvtit">El título de tu cuento</label><input class="rv-in" id="rvtit" maxlength="120" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="true" lang="es-MX" value="${esc(ST.titulo)}"></div>
     <div class="rv-card"><label class="rv-l">¿De qué género es? <span class="rv-ayuda">Elige uno, o hasta dos si quieres mezclarlos.</span></label>
      <div class="rv-gens" id="rvgens">${GEN.map(g=>`<button type="button" class="rv-g ${ST.gens.includes(g[0])?'on':''}" data-g="${g[0]}" aria-pressed="${ST.gens.includes(g[0])}"><b>${g[1]}</b><span>${g[2]}</span></button>`).join('')}</div>
      <p class="rv-aviso" id="rvgm" hidden style="margin-top:10px">Solo puedes elegir hasta dos géneros. Toca uno elegido para quitarlo.</p></div>
     <div class="rv-card"><label class="rv-l" for="rvidea">La idea de tu cuento en una oración <span class="rv-ayuda">(si quieres)</span></label><input class="rv-in" id="rvidea" maxlength="300" autocomplete="off" autocorrect="off" spellcheck="true" lang="es-MX" value="${esc(ST.idea)}"></div>
     <div class="rv-acc"><button class="rv-pri" id="rvsig">Empezar a escribir →</button><span class="rv-ayuda" style="color:#efe8d6" id="rvfalta"></span></div>${conf()}`;
    const falta=()=>{const m=[];if(!ST.titulo.trim())m.push('el título');if(!ST.gens.length)m.push('un género');q('#rvsig').disabled=!!m.length;q('#rvfalta').textContent=m.length?'Falta: '+m.join(' y ')+'.':'';};
    q('#rvtit').addEventListener('input',e=>{ST.titulo=e.target.value;falta();});
    q('#rvidea').addEventListener('input',e=>{ST.idea=e.target.value;});
    q('#rvgens').addEventListener('click',e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=b.dataset.g;
      if(ST.gens.includes(g))ST.gens=ST.gens.filter(x=>x!==g);else if(ST.gens.length<2)ST.gens.push(g);else{q('#rvgm').hidden=false;return;}
      root.querySelectorAll('[data-g]').forEach(x=>{const on=ST.gens.includes(x.dataset.g);x.classList.toggle('on',on);x.setAttribute('aria-pressed',on);});q('#rvgm').hidden=true;falta();});
    q('#rvsig').addEventListener('click',()=>{ST.paso=2;pinta();});
    falta();enlazaConf();
  }

  function textoCompleto(){return [ST.titulo.trim(),...PARTES.map(p=>ST.txt[p.id].trim()).filter(Boolean)].filter(Boolean).join('\n\n');}
  async function copiar(){const t=textoCompleto();if(!t)return 'Todavía no hay nada que copiar.';
    try{await navigator.clipboard.writeText(t);return '¡Listo! Tu cuento está copiado.';}catch(e){}
    try{const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,t.length);const ok=document.execCommand('copy');ta.remove();return ok?'¡Listo! Tu cuento está copiado.':'No pude copiar. Mantén tocado el texto y elige Copiar.';}catch(e){return 'No pude copiar. Mantén tocado el texto y elige Copiar.';}}

  function paso2(){
    const P=PARTES.find(p=>p.id===ST.parte);
    root.innerHTML=`${cab()}<div class="rv-card"><b>${esc(ST.titulo||'Mi cuento')}</b> <span class="rv-ayuda">· ${ST.gens.map(g=>GEN.find(x=>x[0]===g)[1]).join(' + ')}</span>
      <button type="button" id="rvdatos" style="margin-left:8px;min-height:40px;padding:6px 12px">Cambiar</button></div>
     <div><div class="rv-tabs" role="tablist">${PARTES.map(p=>`<button type="button" role="tab" class="rv-tab ${p.id===ST.parte?'on':''}" data-p="${p.id}" aria-selected="${p.id===ST.parte}" style="background:${p.color}">${p.nombre}<small id="rvw-${p.id}">${palabras(ST.txt[p.id])} palabras</small></button>`).join('')}</div>
      <div class="rv-marco" style="background:${P.color}"><p class="rv-guia">${esc(P.guia)}</p>
      <textarea class="rv-hoja" id="rvta" lang="es-MX" spellcheck="true" autocorrect="off" autocapitalize="off" autocomplete="off" aria-label="Escribe tu ${P.nombre.toLowerCase()}" placeholder="Escribe aquí tu ${P.nombre.toLowerCase()}...">${esc(ST.txt[ST.parte])}</textarea>
      <div class="rv-acc" style="margin-top:8px"><span class="rv-cont" id="rvcont"></span></div></div></div>
     ${ST.msg?`<div class="rv-aviso ${ST.msg.mal?'mal':''}" role="status">${esc(ST.msg.t)}</div>`:''}
     <div class="rv-acc"><button class="rv-pri" id="rvrev">Revisar mi cuento</button><button id="rvcopiar">Copiar mi cuento</button><span class="rv-ayuda" style="color:#efe8d6" id="rvres">${ST.restantes!=null?`Te quedan ${ST.restantes} ${ST.restantes===1?'revisión':'revisiones'} hoy.`:''}</span></div>${conf()}`;
    ST.msg=null;
    const ta=q('#rvta');
    const cuenta=()=>{const t=todo();q('#rvcont').textContent=`${palabras(ST.txt[ST.parte])} palabras en esta parte · ${t.toLocaleString('es-MX')} de ${MAX.toLocaleString('es-MX')} letras en total`;q('#rvw-'+ST.parte).textContent=palabras(ST.txt[ST.parte])+' palabras';q('#rvrev').disabled=t<20;};
    ta.addEventListener('input',()=>{ST.txt[ST.parte]=ta.value;cuenta();});
    root.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{ST.parte=b.dataset.p;paso2();}));
    q('#rvdatos').addEventListener('click',()=>{ST.paso=1;pinta();});
    q('#rvcopiar').addEventListener('click',async()=>{const m=await copiar();ST.msg=null;q('#rvres').textContent=m;});
    q('#rvrev').addEventListener('click',revisar);
    cuenta();enlazaConf();
  }

  async function revisar(){
    if(todo()>MAX){ST.msg={t:'Tu cuento es muy largo para revisarlo de una vez (máximo 9,000 letras). Revisa una parte a la vez.',mal:true};paso2();return;}
    ST.paso=3;ST.cargando=true;ST.rev=null;ST.hechas={};pinta();
    const ctrl=new AbortController();ST.ctrl=ctrl;const lim=setTimeout(()=>ctrl.abort('tiempo'),65000);
    let r,d=null;
    try{
      r=await fetch('/api/revisar-cuento',{method:'POST',headers:{'Content-Type':'application/json'},signal:ctrl.signal,cache:'no-store',
        body:JSON.stringify({token:ctx.token,titulo:ST.titulo,generos:ST.gens,idea:ST.idea,inicio:ST.txt.inicio,desarrollo:ST.txt.desarrollo,cierre:ST.txt.cierre})});
      try{d=await r.json();}catch(e){}
    }catch(e){
      clearTimeout(lim);if(!ST||ST.ctrl!==ctrl)return;ST.cargando=false;
      if(ctrl.signal.reason==='detenido'){ST.paso=2;ST.msg={t:'Detuve la revisión. Tu cuento sigue aquí.'};pinta();return;}
      ST.error='No pude terminar la revisión; tu cuento no se perdió. Intenta otra vez.';pinta();return;}
    clearTimeout(lim);if(!ST||ST.ctrl!==ctrl)return;ST.cargando=false;ST.ctrl=null;
    if(d&&d.ok&&d.revision){ST.rev=d.revision;ST.restantes=d.restantes;ST.error=null;pinta();return;}
    if(d&&d.codigo==='sesion'){ctx.sesionCaida&&ctx.sesionCaida();return;}
    ST.error=(d&&d.error)||'No pude terminar la revisión; tu cuento no se perdió. Intenta otra vez.';
    if(d&&(d.codigo==='muy_largo'||d.codigo==='vacio'||d.codigo==='genero')){ST.paso=2;ST.msg={t:ST.error,mal:true};ST.error=null;}
    pinta();
  }

  function paso3(){
    if(ST.cargando){
      root.innerHTML=`${cab()}<div class="rv-card rv-carga"><div class="rv-giro"></div><h3>Estoy leyendo tu cuento…</h3><p class="rv-ayuda">Puede tardar unos segundos. Tu cuento no se guarda en ningún lugar.</p><div class="rv-acc" style="justify-content:center;margin-top:12px"><button id="rvdetener">Detener</button></div></div>`;
      q('#rvdetener').addEventListener('click',()=>{if(ST.ctrl)ST.ctrl.abort('detenido');});return;}
    if(!ST.rev){
      root.innerHTML=`${cab()}<div class="rv-aviso mal" role="alert">${esc(ST.error||'No pude terminar la revisión; tu cuento no se perdió. Intenta otra vez.')}</div><div class="rv-acc"><button class="rv-pri" id="rvvolver">Volver a mi cuento</button></div>`;
      q('#rvvolver').addEventListener('click',()=>{ST.paso=2;ST.error=null;pinta();});return;}
    const R=ST.rev,e=ENC[R.genero.encaja]||ENC.en_parte,sug=R.sugerencias||[];
    const grupos=PARTES.map(p=>({p,items:sug.map((s,i)=>({s,i})).filter(x=>x.s.parte===p.id)})).filter(g=>g.items.length);
    root.innerHTML=`${cab()}
     <div class="rv-card"><h2>Lo que vi en tu cuento</h2><p style="margin-top:6px">${esc(R.resumen)}</p></div>
     ${R.lo_bueno.length?`<div class="rv-card" style="background:#eaf6e6"><h3>Lo que va muy bien</h3><ul class="rv-bien">${R.lo_bueno.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
     <div class="rv-card"><h3>¿Se nota el género?</h3><p style="margin:8px 0"><span class="rv-gen ${e[1]}">${e[0]}</span></p>${R.genero.comentario?`<p>${esc(R.genero.comentario)}</p>`:''}
      ${R.genero.preguntas.length?`<p style="margin-top:8px;font-weight:800">Para pensar:</p><ul class="rv-bien">${R.genero.preguntas.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>
     <div class="rv-card"><h3>Sugerencias <span class="rv-cont" id="rvlist"></span></h3>
      ${sug.length?'':'<p style="margin-top:6px">No encontré nada importante por cambiar. ¡Buen trabajo!</p>'}
      ${grupos.map(g=>`<div class="rv-pt" style="background:${g.p.color}">${g.p.nombre}</div>${g.items.map(({s,i})=>`<div class="rv-sug" id="rvs${i}">
        <span class="rv-tipo">${TIPOS[s.tipo]}</span>
        ${s.fragmento?`<p>En tu texto dice: <span class="rv-frag">${esc(s.fragmento)}</span></p>`:''}
        ${s.cambio?`<p>Así quedaría: <span class="rv-nuevo">${esc(s.cambio)}</span></p>`:''}
        <p>${esc(s.por_que)}</p>
        <div class="rv-acc">${s.ubicado?`<button type="button" data-ver="${i}">Mostrar en mi texto</button>`:''}<label class="rv-chk"><input type="checkbox" data-hecha="${i}" ${ST.hechas[i]?'checked':''}> Ya lo arreglé</label></div></div>`).join('')}`).join('')}</div>
     ${R.reto?`<div class="rv-card" style="background:#fff2b3"><h3>Tu reto</h3><p style="margin-top:6px">${esc(R.reto)}</p></div>`:''}
     ${ST.restantes!=null?`<p class="rv-ayuda" style="color:#efe8d6">Te quedan ${ST.restantes} ${ST.restantes===1?'revisión':'revisiones'} hoy.</p>`:''}
     <div class="rv-acc"><button class="rv-pri" id="rvvolver">Volver a mi cuento</button><button id="rvcopiar">Copiar mi cuento</button><span class="rv-ayuda" style="color:#efe8d6" id="rvres"></span></div>${conf()}`;
    const marca=()=>{const n=sug.length,k=Object.values(ST.hechas).filter(Boolean).length;const c=q('#rvlist');if(c&&n)c.textContent=`· ${k} de ${n} listas`;
      sug.forEach((s,i)=>{const el=q('#rvs'+i);if(el)el.classList.toggle('hecha',!!ST.hechas[i]);});};
    root.querySelectorAll('[data-hecha]').forEach(c=>c.addEventListener('change',()=>{ST.hechas[c.dataset.hecha]=c.checked;marca();}));
    root.querySelectorAll('[data-ver]').forEach(b=>b.addEventListener('click',()=>mostrar(sug[+b.dataset.ver])));
    q('#rvvolver').addEventListener('click',()=>{ST.paso=2;pinta();});
    q('#rvcopiar').addEventListener('click',async()=>{q('#rvres').textContent=await copiar();});
    marca();enlazaConf();
  }

  function mostrar(s){
    ST.parte=s.parte;ST.paso=2;pinta();
    const ta=q('#rvta'),t=ta.value;let i=t.indexOf(s.fragmento);if(i<0)i=t.toLowerCase().indexOf(s.fragmento.toLowerCase());
    if(i<0){const m=document.createElement('div');m.className='rv-aviso';m.textContent='Ya no encuentro ese pedacito. Quizá ya lo cambiaste.';q('#rvrev').parentNode.before(m);return;}
    ta.focus();ta.setSelectionRange(i,i+s.fragmento.length);
    // desplaza la hoja hasta el fragmento
    try{const cs=getComputedStyle(ta),m=document.createElement('div');m.style.cssText=`position:absolute;visibility:hidden;white-space:pre-wrap;word-wrap:break-word;width:${ta.clientWidth}px;font:${cs.font};padding:${cs.padding};box-sizing:border-box`;
      m.textContent=t.slice(0,i);document.body.appendChild(m);const y=m.offsetHeight;m.remove();ta.scrollTop=Math.max(0,y-ta.clientHeight/2);}catch(e){}
    ta.scrollIntoView({block:'center',behavior:'smooth'});
  }

  function enlazaConf(){
    const c=q('#rvcopiar2');if(c)c.addEventListener('click',async()=>{q('#rvcm').textContent=await copiar();});
    const s=q('#rvsalir');if(s)s.addEventListener('click',()=>{const f=ST.conf;ST.conf=null;if(f)f();});
    const k=q('#rvseguir');if(k)k.addEventListener('click',()=>{ST.conf=null;pinta();});
  }
  function pinta(){(ST.paso===1?paso1:ST.paso===2?paso2:paso3)();}
  pinta();
  return{
    pedirSalida(hacer){if(!hayTexto()){hacer();return;}ST.conf=hacer;pinta();},
    parar(){if(ST&&ST.ctrl){try{ST.ctrl.abort('detenido');}catch(e){}}ST=null;try{root.innerHTML='';}catch(e){}}
  };
}
let activa=null;
window.REVISOR={
  css:CSS,
  html:()=>`<style id="rv-css">${CSS}</style><div id="rv"></div>`,
  iniciar(root,ctx){this.parar();activa=iniciar(root,ctx);},
  pedirSalida(f){if(activa)activa.pedirSalida(f);else f();},
  parar(){if(activa){activa.parar();activa=null;}}
};
})();
