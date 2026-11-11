/* Saltos en la recta · herramienta interactiva (−20 a 20) · se usa desde la pantalla "recta" de app.js */
(function(){
const CSS=`#rc{
  --paper:#f3e9d2; --surface:#fbf6ea; --ink:#1f2421; --muted:#5d6a65;
  --rule:#2a2f2c; --soft:#f1dfb8; --hair:#d6c8a4;
  --neg:#1f2d86; --pos:#0a8143; --accent:#ec5923; --accent-ink:#a73a10;
  --wash:rgba(31,45,134,.09); --ok:#0a8143; --no:#a1233f; --on-accent:#ffffff;
  --fdisplay:var(--letra); --fui:'Trebuchet MS','Segoe UI',system-ui,sans-serif;
  display:flex; flex-direction:column; gap:10px; color:var(--ink); font-family:var(--fui);
  font-size:16px; line-height:1.45; width:100%; text-align:left;
}
#rc p{color:inherit; font-size:inherit; line-height:inherit; margin:0}
#rc *{-webkit-user-select:none; user-select:none}
#rc #ej{-webkit-user-select:text; user-select:text}
#rc .rc-controls{padding-right:66px}
/* ---- cabecera + captura ---- */
#rc .rc-top{display:flex; align-items:center; gap:14px; flex-wrap:wrap}
#rc .rc-brand{flex:0 1 auto; min-width:0}
#rc .rc-brand h1{
  font-family:var(--fdisplay); font-weight:700; font-size:clamp(19px,2.3vw,25px);
  margin:0; letter-spacing:-.01em; white-space:nowrap;
}
#rc .rc-entry{
  flex:1 1 320px; min-width:0; display:flex; align-items:center; gap:7px; flex-wrap:wrap;
  background:var(--surface); border:1.5px solid var(--hair); border-radius:13px; padding:8px 10px;
}
#rc .rc-entry .rc-lab{font:700 11px/1 var(--fui); letter-spacing:.08em; text-transform:uppercase; color:var(--accent-ink); flex:none}
#rc #ej{
  flex:1 1 130px; min-width:110px; font:700 20px/1 var(--fui); font-variant-numeric:tabular-nums;
  letter-spacing:.02em; padding:10px 12px; border-radius:9px; border:1.5px solid var(--hair);
  background:var(--paper); color:var(--ink); min-height:46px;
}
#rc #ej::placeholder{color:var(--muted); opacity:.6; font-weight:600}
#rc .rc-signo{font:700 19px/1 var(--fui); padding:0 15px; min-width:48px; min-height:46px; flex:none}
#rc .rc-hint{font-size:11.5px; color:var(--muted); flex:1 1 100%; margin:0; padding-left:2px}

/* ---- tarjeta de la operación ---- */
#rc .rc-card{
  background:var(--surface); border:1.5px solid var(--hair); border-radius:14px;
  padding:12px 16px; display:flex; align-items:center; gap:16px; flex-wrap:wrap;
}
#rc .rc-op{
  font-family:var(--fdisplay); font-weight:700; letter-spacing:-.02em;
  font-size:clamp(26px,4.6vw,40px); line-height:1; font-variant-numeric:tabular-nums;
  white-space:nowrap;
}
#rc .rc-op .rc-res{color:var(--accent)}
#rc .rc-op .rc-blank{color:var(--muted); opacity:.5}
#rc .rc-task{flex:1 1 220px; min-width:0}
#rc .rc-task .rc-step{font:700 11px/1 var(--fui); letter-spacing:.09em; text-transform:uppercase; color:var(--accent-ink)}
#rc .rc-task .rc-say{margin:5px 0 0; font-size:15px}
#rc .rc-count{
  font-variant-numeric:tabular-nums; font-weight:700; font-size:14px;
  padding:7px 12px; border-radius:999px; background:var(--soft); color:var(--muted);
  white-space:nowrap;
}
#rc .rc-count.izq{background:var(--wash); color:var(--neg)}
#rc .rc-count.der{background:var(--wash); color:var(--pos)}

/* ---- la recta ---- */
#rc .rc-board{
  flex:none; height:clamp(210px,34vh,300px); background:var(--surface);
  border:1.5px solid var(--hair); border-radius:14px; position:relative; overflow:hidden;
  touch-action:none; -webkit-user-select:none; user-select:none; cursor:grab;
}
#rc .rc-board.dragging{cursor:grabbing}
#rc .rc-board.off{opacity:.45; cursor:default}
#rc .rc-board svg{display:block; width:100%; height:100%}
#rc .rc-axis{stroke:var(--rule); stroke-width:2.5; stroke-linecap:round}
#rc .rc-num{fill:var(--muted); font-family:var(--fui); font-weight:500; font-variant-numeric:tabular-nums}
#rc .rc-guia{stroke:var(--hair); stroke-width:1}
#rc .rc-num.cero{fill:var(--accent); font-weight:700}
#rc .rc-zona{fill:var(--wash)}
#rc .rc-zlabel{fill:var(--muted); font:600 10.5px/1 var(--fui); letter-spacing:.06em; text-transform:uppercase; opacity:.85}
#rc .rc-hop{fill:none; stroke-width:2.4; stroke-linecap:round}
#rc .rc-ficha-ini circle{fill:var(--surface); stroke:var(--rule); stroke-width:2.5}
#rc .rc-ficha-ini text{fill:var(--ink); font:700 14px/1 var(--fui); font-variant-numeric:tabular-nums}
#rc .rc-ficha circle{stroke:var(--surface); stroke-width:3}
#rc .rc-ficha text{fill:var(--on-accent); font:700 14px/1 var(--fui); font-variant-numeric:tabular-nums}
#rc .rc-meta{font:600 11px/1 var(--fui)}

/* ---- aviso ---- */
#rc .rc-say-bar{
  min-height:46px; display:flex; align-items:center; gap:10px;
  border-radius:12px; padding:10px 14px; font-size:14.5px;
  background:var(--surface); border:1.5px solid var(--hair);
}
#rc .rc-say-bar.bien{border-color:var(--ok); color:var(--ok); font-weight:600}
#rc .rc-say-bar.casi{border-color:var(--accent); color:var(--accent-ink)}
#rc .rc-say-bar.mal{border-color:var(--no); color:var(--no)}
#rc .rc-dot{width:9px; height:9px; border-radius:50%; background:currentColor; flex:none}

/* ---- controles ---- */
#rc .rc-controls{display:flex; align-items:center; gap:8px; flex-wrap:wrap}
#rc button{
  font:600 14px/1 var(--fui); border-radius:11px; padding:12px 16px; cursor:pointer;
  border:1.5px solid var(--hair); background:var(--surface); color:var(--ink);
  -webkit-tap-highlight-color:transparent; min-height:46px;
}
#rc button.rc-primary{background:var(--accent); border-color:var(--accent); color:var(--on-accent)}
#rc #rc button:disabled{opacity:.38; cursor:default}
#rc #rc button:focus-visible,#rc input:focus-visible{outline:3px solid var(--accent); outline-offset:2px}
#rc .rc-nudge{display:inline-flex; gap:0; border:1.5px solid var(--hair); border-radius:11px; overflow:hidden}
#rc .rc-nudge button{border:0; border-radius:0; padding:12px 17px; font-size:17px; background:var(--surface)}
#rc .rc-nudge button+button{border-left:1.5px solid var(--hair)}
#rc .rc-spacer{flex:1 1 auto}

@media (max-width:620px){
  #rc #ej{flex:1 1 100%}
  #rc .rc-signo{flex:1 1 auto}
  #rc #armar{flex:2 1 auto}
  #rc .rc-board{height:clamp(170px,30vh,240px)}
  #rc .rc-card{padding:10px 13px; gap:10px}
  #rc .rc-brand h1{font-size:19px}
  #rc .rc-say-bar{font-size:13.5px}
  #rc button{padding:11px 13px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;
const HTML=`<div id="rc">
<div class="rc-top">
    
    <form class="rc-entry" id="entry">
      <span class="rc-lab">Escribe el ejercicio</span>
      <input id="ej" type="text" value="−2 − 5" autocomplete="off" autocapitalize="off"
             autocorrect="off" spellcheck="false" aria-label="Escribe el ejercicio">
      <button type="button" class="rc-signo" id="bMenos" aria-label="Insertar el signo menos">&minus;</button>
      <button type="button" class="rc-signo" id="bMas" aria-label="Insertar el signo más">+</button>
      <button type="submit" class="rc-primary" id="armar">Armar</button>
      <p class="rc-hint">Un número, el signo &minus; o +, y otro número. La recta va del &minus;20 al 20.</p>
    </form>
  </div>

  <div class="rc-card">
    <div class="rc-op" id="op" aria-live="polite"></div>
    <div class="rc-task">
      <div class="rc-step" id="paso"></div>
      <p class="rc-say" id="instr"></p>
    </div>
    <div class="rc-count" id="count" aria-live="polite" hidden></div>
  </div>

  <div class="rc-board" id="board">
    <svg id="svg" aria-hidden="true"></svg>
  </div>

  <div class="rc-say-bar" id="bar"><span class="rc-dot"></span><span id="barTxt"></span></div>

  <div class="rc-controls">
    <div class="rc-nudge" role="group" aria-label="Mover un paso">
      <button type="button" id="izq" aria-label="Un paso a la izquierda">&#9664;</button>
      <button type="button" id="der" aria-label="Un paso a la derecha">&#9654;</button>
    </div>
    <button type="button" id="otra">Repetir</button>
    <button type="button" id="pista">Ver el salto</button>
    <span class="rc-spacer"></span>
    <button type="button" class="rc-primary" id="nuevo">Otro ejercicio</button>
  </div>
</div>`;
function iniciar(root){
  "use strict";
  var SVGNS = "http://www.w3.org/2000/svg";
  var MEN = "−";
  var LIM = 20;                      // la recta va del -20 al 20
  function PAD(){ return (board.clientWidth || 600) < 640 ? 13 : 22; }

  function sg(n){ return n < 0 ? MEN + Math.abs(n) : String(n); }

  var S = { a:-2, op:"-", b:5, fase:"inicio", ini:null, cur:0, anim:null, chequeo:null };

  var board   = root.querySelector("#board");
  var svg     = root.querySelector("#svg");
  var elOp    = root.querySelector("#op");
  var elPaso  = root.querySelector("#paso");
  var elInstr = root.querySelector("#instr");
  var elCount = root.querySelector("#count");
  var elBar   = root.querySelector("#bar");
  var elBarTxt= root.querySelector("#barTxt");
  var elPista = root.querySelector("#pista");
  var elOtra  = root.querySelector("#otra");
  var elNuevo = root.querySelector("#nuevo");
  var elIzq   = root.querySelector("#izq");
  var elDer   = root.querySelector("#der");
  var inEj    = root.querySelector("#ej");

  function RES(){ return S.op === "-" ? S.a - S.b : S.a + S.b; }

  // ---- escala fija -20 .. 20 ----
  function paso(){
    var w = board.clientWidth || 600;
    return (w - 2 * PAD()) / (2 * LIM);
  }
  function X(v){ return PAD() + (v + LIM) * paso(); }
  function valAt(px){
    var v = (px - PAD()) / paso() - LIM;
    return Math.max(-LIM, Math.min(LIM, Math.round(v)));
  }

  // ---- dibujo ----
  function el(n, at, txt){
    var e = document.createElementNS(SVGNS, n);
    for (var k in at) if (at.hasOwnProperty(k)) e.setAttribute(k, at[k]);
    if (txt != null) e.textContent = txt;
    return e;
  }

  function dibuja(){
    var w = board.clientWidth || 600, h = board.clientHeight || 180;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var p = paso();
    // todos los números llevan su etiqueta, de 1 en 1, sin saltarse ninguno:
    // si no caben en un renglón, los impares bajan a un segundo renglón con su guía.
    var fsUna = Math.min(12, (p - 3) / 1.77);
    var escalon = fsUna < 9.6;
    var fsNum = escalon ? Math.max(7.5, Math.min(11.5, (2 * p - 3) / 1.77)) : Math.max(8.5, fsUna);
    var ejeY = Math.round(h * (escalon ? 0.45 : 0.5));

    // franja de los negativos
    var bandaAlto = Math.min(136, Math.max(94, h - 34));
    var bandaY = Math.max(8, ejeY - Math.round(bandaAlto * 0.56));
    var x0 = Math.max(5, X(-LIM) - 16), x1 = X(0);
    svg.appendChild(el("rect", {x:x0, y:bandaY, width:Math.max(0, x1 - x0),
      height:bandaAlto, rx:10, "class":"rc-zona"}));
    if (x1 - x0 > 110)
      svg.appendChild(el("text", {x:x0 + 12, y:bandaY + 17, "class":"rc-zlabel"}, "bajo el cero"));

    // rayitas y números
    for (var v = -LIM; v <= LIM; v++){
      var x = X(v), cero = (v === 0);
      var lejos = escalon && (v % 2 !== 0);
      var alto = cero ? 15 : (v % 5 === 0 ? 10 : 6);
      svg.appendChild(el("line", {x1:x, y1:ejeY - alto, x2:x, y2:ejeY + alto,
        stroke:cero ? "var(--accent)" : "var(--hair)", "stroke-width":cero ? 3 : 1.3}));
      if (lejos)
        svg.appendChild(el("line", {x1:x, y1:ejeY + alto, x2:x, y2:ejeY + 35, "class":"rc-guia"}));
      svg.appendChild(el("text", {x:x, y:ejeY + (lejos ? 45 : 28), "text-anchor":"middle",
        style:"font-size:" + fsNum.toFixed(1) + "px",
        "class":"rc-num" + (cero ? " rc-cero" : "")}, sg(v)));
    }

    svg.appendChild(el("line", {x1:X(-LIM) - 10, y1:ejeY, x2:X(LIM) + 10, y2:ejeY, "class":"rc-axis"}));

    var desde = (S.fase === "inicio") ? null : S.ini;
    if (desde !== null && S.cur !== desde) pintaSaltos(desde, S.cur, ejeY, p);
    if (desde !== null) ficha(X(desde), ejeY, sg(desde), true);

    var col = S.cur < 0 ? "var(--neg)" : (S.cur > 0 ? "var(--pos)" : "var(--accent)");
    ficha(X(S.cur), ejeY, sg(S.cur), false, col);
  }

  function pintaSaltos(a, b, ejeY, p){
    var n = Math.abs(b - a), dir = b > a ? 1 : -1;
    var col = dir > 0 ? "var(--pos)" : "var(--neg)";
    var g = el("g", {});
    if (n <= 12 && p > 15){
      for (var k = 0; k < n; k++){
        var xa = X(a + dir * k), xb = X(a + dir * (k + 1));
        var r = Math.abs(xb - xa) / 2, cy = ejeY - 13;
        g.appendChild(el("path", {
          d:"M " + xa + " " + cy + " A " + r + " " + Math.min(r * 1.3, 30) + " 0 0 " + (dir > 0 ? 1 : 0) + " " + xb + " " + cy,
          "class":"rc-hop", stroke:col}));
      }
    } else {
      var x1 = X(a), x2 = X(b), mx = (x1 + x2) / 2, alto = Math.min(54, 18 + n * 1.5);
      g.appendChild(el("path", {
        d:"M " + x1 + " " + (ejeY - 13) + " Q " + mx + " " + (ejeY - 13 - alto) + " " + x2 + " " + (ejeY - 13),
        "class":"rc-hop", stroke:col, "stroke-width":3}));
      g.appendChild(el("text", {x:mx, y:ejeY - 21 - alto / 1.6, "text-anchor":"middle",
        "class":"rc-meta", fill:col}, n + " pasos"));
    }
    var xf = X(b), d2 = dir > 0 ? 1 : -1;
    g.appendChild(el("path", {
      d:"M " + xf + " " + (ejeY - 7) + " L " + (xf - d2 * 8) + " " + (ejeY - 19) + " L " + (xf + d2 * 2) + " " + (ejeY - 20) + " Z",
      fill:col}));
    svg.appendChild(g);
  }

  function ficha(x, ejeY, txt, esIni, col){
    var g = el("g", {"class":esIni ? "rc-ficha-ini" : "rc-ficha"});
    var c = el("circle", {cx:x, cy:ejeY, r:esIni ? 14 : 17});
    if (!esIni) c.setAttribute("fill", col);
    g.appendChild(c);
    g.appendChild(el("text", {x:x, y:ejeY + 5, "text-anchor":"middle"}, txt));
    svg.appendChild(g);
  }

  // ---- textos ----
  function pinta(){
    var r = RES();
    var html = '<span>' + sg(S.a) + '</span> <span>' + (S.op === "-" ? MEN : "+") + '</span> <span>' + S.b + '</span> <span>=</span> ';
    html += (S.fase === "listo") ? '<span class="rc-res">' + sg(r) + '</span>' : '<span class="rc-blank">?</span>';
    elOp.innerHTML = html;

    if (S.fase === "inicio"){
      elPaso.textContent = "Paso 1 de 2";
      elInstr.textContent = "Arrastra la ficha hasta el " + sg(S.a) + ".";
      elPista.disabled = true;
    } else if (S.fase === "mover"){
      elPaso.textContent = "Paso 2 de 2";
      elInstr.textContent = "Ahora recorre " + S.b + " " + (S.b === 1 ? "lugar" : "lugares") +
        " hacia la " + (S.op === "-" ? "izquierda" : "derecha") + ".";
      elPista.disabled = false;
    } else {
      elPaso.textContent = "Resuelto";
      elInstr.textContent = cierre();
      elPista.disabled = true;
    }
    var fin = (S.fase === "listo");
    elIzq.disabled = fin; elDer.disabled = fin;
    board.classList.toggle("rc-off", fin);
    contador();
    dibuja();
  }

  function cierre(){
    var r = RES();
    if ((S.a > 0 && r < 0) || (S.a < 0 && r > 0)) return "Cruzaste el cero, por eso el resultado cambia de lado.";
    if (r === 0) return "Caíste justo en el cero: ni positivo ni negativo.";
    if (S.a < 0 && r < 0 && S.op === "-") return "Seguiste bajando: quedaste todavía más lejos del cero.";
    if (S.a < 0 && r < 0) return "Subiste hacia el cero, pero no alcanzaste a pasarlo.";
    return "Te quedaste del mismo lado del cero.";
  }

  function contador(){
    if (S.fase !== "mover" || S.cur === S.ini){ elCount.hidden = true; return; }
    var n = Math.abs(S.cur - S.ini), der = S.cur > S.ini;
    elCount.hidden = false;
    elCount.className = "rc-count " + (der ? "rc-der" : "rc-izq");
    elCount.textContent = n + " " + (n === 1 ? "paso" : "pasos") + " a la " + (der ? "derecha" : "izquierda");
  }

  function aviso(txt, clase){
    elBarTxt.textContent = txt;
    elBar.className = "rc-say-bar" + (clase ? " rc-" + clase : "");
  }

  // ---- leer lo que escribió el alumno ----
  function leer(txt){
    var t = String(txt).replace(/[−–—]/g, "-").replace(/\s+/g, " ").trim();
    var m = t.match(/^([+-]?)\s*(\d{1,3})\s*([+-])\s*(\d{1,3})$/);
    if (!m) return {error:"Escríbelo así: un número, el signo " + MEN + " o +, y otro número. Por ejemplo " + MEN + "2 " + MEN + " 5."};
    var a = parseInt(m[2], 10) * (m[1] === "-" ? -1 : 1);
    var op = m[3];
    var b = parseInt(m[4], 10);
    if (Math.abs(a) > LIM)
      return {error:"La recta llega del " + MEN + "20 al 20. Empieza en un número de ese tramo."};
    var r = op === "-" ? a - b : a + b;
    if (Math.abs(r) > LIM)
      return {error:"El resultado sería " + sg(r) + " y eso se sale de la recta. Usa números más chicos."};
    return {a:a, op:op, b:b};
  }

  // ---- interacción con la recta ----
  var arrastrando = false;
  function cx(e){ return e.clientX - board.getBoundingClientRect().left; }

  board.addEventListener("pointerdown", function(e){
    if (S.fase === "listo") return;
    pararAnim(); pararCheq();
    arrastrando = true;
    board.classList.add("rc-dragging");
    try { board.setPointerCapture(e.pointerId); } catch (err) {}
    mueve(e);
  });
  board.addEventListener("pointermove", function(e){ if (arrastrando) mueve(e); });
  board.addEventListener("pointerup", suelta);
  board.addEventListener("pointercancel", suelta);

  function mueve(e){
    e.preventDefault();
    var v = valAt(cx(e));
    if (v !== S.cur){ S.cur = v; contador(); dibuja(); }
  }
  function suelta(e){
    if (!arrastrando) return;
    arrastrando = false;
    board.classList.remove("rc-dragging");
    try { board.releasePointerCapture(e.pointerId); } catch (err) {}
    revisa();
  }

  // ---- paso a paso con los botones ----
  function pararCheq(){ if (S.chequeo){ clearTimeout(S.chequeo); S.chequeo = null; } }
  function empuja(d){
    if (S.fase === "listo") return;
    pararAnim(); pararCheq();
    var v = Math.max(-LIM, Math.min(LIM, S.cur + d));
    if (v === S.cur) return;
    S.cur = v; contador(); dibuja();
    S.chequeo = setTimeout(function(){ S.chequeo = null; revisa(); }, 850);
  }
  elIzq.addEventListener("click", function(){ empuja(-1); });
  elDer.addEventListener("click", function(){ empuja(1); });

  // ---- revisión ----
  function revisa(){
    var r = RES();
    if (S.fase === "inicio"){
      if (S.cur === S.a){
        S.ini = S.a; S.fase = "mover";
        aviso("Bien, ahí empieza. Ahora haz el recorrido.", "bien");
        pinta();
      } else {
        var d = Math.abs(S.cur - S.a);
        aviso("Esa es la casilla del " + sg(S.cur) + ". El " + sg(S.a) + " está " + d + " " +
              (d === 1 ? "lugar" : "lugares") + " a la " + (S.cur > S.a ? "izquierda" : "derecha") + ".", "casi");
        dibuja();
      }
      return;
    }
    if (S.fase !== "mover") return;

    if (S.cur === r){
      S.fase = "listo";
      aviso("Correcto: " + sg(S.a) + " " + (S.op === "-" ? MEN : "+") + " " + S.b + " = " + sg(r) + ".", "bien");
      pinta();
      return;
    }
    var dados = S.cur - S.ini, quiere = r - S.ini;
    if (dados === 0){
      aviso("Todavía no te has movido. Arrastra la ficha o usa las flechas.", "casi");
    } else if ((dados > 0) !== (quiere > 0)){
      aviso("Ese lado no. " + (quiere < 0 ? "Restar te mueve hacia la izquierda." : "Sumar te mueve hacia la derecha."), "mal");
    } else {
      var faltan = Math.abs(quiere) - Math.abs(dados);
      aviso(faltan > 0
        ? "Vas bien, pero te " + (faltan === 1 ? "falta 1 paso" : "faltan " + faltan + " pasos") + "."
        : "Te pasaste por " + Math.abs(faltan) + " " + (Math.abs(faltan) === 1 ? "paso" : "pasos") + ".", "casi");
    }
    contador(); dibuja();
  }

  // ---- ver el salto ----
  function pararAnim(){ if (S.anim){ clearInterval(S.anim); S.anim = null; } }
  elPista.addEventListener("click", function(){
    if (S.fase !== "mover") return;
    pararAnim(); pararCheq();
    var r = RES(), dir = r > S.ini ? 1 : -1;
    S.cur = S.ini; dibuja();
    aviso("Mira: un paso a la vez.", "casi");
    S.anim = setInterval(function(){
      if (S.cur === r){
        pararAnim();
        S.fase = "listo";
        aviso("Así queda: " + sg(S.a) + " " + (S.op === "-" ? MEN : "+") + " " + S.b + " = " + sg(r) +
              ". Ahora escribe otro y hazlo tú.", "casi");
        pinta();
        return;
      }
      S.cur += dir; contador(); dibuja();
    }, 260);
  });

  // ---- arranque de un ejercicio ----
  function arma(a, op, b, nuevo){
    pararAnim(); pararCheq();
    S.a = a; S.op = op; S.b = b;
    S.fase = "inicio"; S.ini = null; S.cur = 0;
    aviso(nuevo ? "Listo. Coloca la ficha donde empieza la operación."
                : "Coloca la ficha donde empieza la operación.");
    pinta();
  }

  root.querySelector("#entry").addEventListener("submit", function(e){
    e.preventDefault();
    var leido = leer(inEj.value);
    if (leido.error){ aviso(leido.error, "mal"); inEj.focus(); return; }
    inEj.value = sg(leido.a) + " " + (leido.op === "-" ? MEN : "+") + " " + leido.b;
    arma(leido.a, leido.op, leido.b, true);
  });

  function inserta(sig){
    var v = inEj.value;
    var ini = inEj.selectionStart, fin = inEj.selectionEnd;
    if (typeof ini !== "number"){ ini = v.length; fin = v.length; }
    inEj.value = v.slice(0, ini) + sig + v.slice(fin);
    var pos = ini + sig.length;
    inEj.focus();
    try { inEj.setSelectionRange(pos, pos); } catch (err) {}
  }
  root.querySelector("#bMenos").addEventListener("click", function(){ inserta(MEN); });
  root.querySelector("#bMas").addEventListener("click", function(){ inserta("+"); });

  elOtra.addEventListener("click", function(){ arma(S.a, S.op, S.b, false); });
  elNuevo.addEventListener("click", function(){
    inEj.value = "";
    inEj.focus();
    aviso("Escribe el ejercicio arriba y toca Armar.");
  });

  // ---- redibujo ----
  var t;
  function alCambiar(){ if (!root.isConnected){ window.removeEventListener("resize", alCambiar); return; } clearTimeout(t); t = setTimeout(dibuja, 80); }
  window.addEventListener("resize", alCambiar);

  function arranca(d){
    if (d && typeof d.a === "number"){
      S.a = d.a; S.op = d.op || "-"; S.b = d.b || 0;
      inEj.value = sg(S.a) + " " + (S.op === "-" ? MEN : "+") + " " + S.b;
    }
    arma(S.a, S.op, S.b, false);
    setTimeout(dibuja, 60);
  }

  arranca(null);
  setTimeout(dibuja, 350);
  return { parar:function(){ pararAnim(); pararCheq(); window.removeEventListener("resize", alCambiar); } };
}
window.RECTA={
  css:CSS,
  html:function(){return '<style id="rc-css">'+CSS+'</style>'+HTML;},
  iniciar:function(root){ if(window.RECTA._i&&window.RECTA._i.parar)window.RECTA._i.parar(); window.RECTA._i=iniciar(root); },
  parar:function(){ if(window.RECTA._i&&window.RECTA._i.parar)window.RECTA._i.parar(); window.RECTA._i=null; }
};
})();
