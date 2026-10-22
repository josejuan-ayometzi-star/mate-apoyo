// ============================================================
// BANCO DE EJERCICIOS · Mate Apoyo
// Para agregar un tema nuevo (p. ej. de Tekman) se añade un módulo
// al arreglo MODULOS. Cada nivel tiene una función gen() que devuelve
// 10 preguntas con números nuevos cada vez.
// Pregunta: { vis:{tipo:'linea'|'col'|'div',...}, q, resp, pista }
// ============================================================
(function(){
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const digs=n=>String(n).split('').map(Number).reverse(); // unidades primero
const hasCarry=(a,b)=>{const x=digs(a),y=digs(b);let c=0;for(let i=0;i<Math.max(x.length,y.length);i++){const s=(x[i]||0)+(y[i]||0)+c;if(s>=10)return true;c=0;}return false;};
const hasBorrow=(a,b)=>{const x=digs(a),y=digs(b);let br=0;for(let i=0;i<x.length;i++){let d=x[i]-br-(y[i]||0);if(d<0){return true;}br=0;}return false;};
function unicas(n,mk){const vistos=new Set(),out=[];let g=0;while(out.length<n&&g++<4000){const p=mk();const k=p.k||p.q;if(vistos.has(k))continue;vistos.add(k);out.push(p);}return out;}

// ---------- TABLAS ----------
function tablaNivel(t,nivel){
  const cuenta=k=>`Cuenta de ${t} en ${t}: `+Array.from({length:k},(_,i)=>t*(i+1)).join(' · ');
  if(nivel===1) return ()=>Array.from({length:10},(_,i)=>{const k=i+1;return {vis:{tipo:'linea'},q:`${t} × ${k} = ?`,resp:t*k,pista:cuenta(k)};});
  if(nivel===2) return ()=>shuffle([1,2,3,4,5,6,7,8,9,10]).map(k=>({vis:{tipo:'linea'},q:`${t} × ${k} = ?`,resp:t*k,pista:cuenta(k)}));
  return ()=>{const ks=shuffle([1,2,3,4,5,6,7,8,9,10]);
    return ks.map((k,i)=> i<5
      ? {vis:{tipo:'linea'},q:`${t} × □ = ${t*k}`,resp:k,pista:`¿Cuántas veces cabe ${t} en ${t*k}? Cuenta de ${t} en ${t}.`}
      : {vis:{tipo:'linea'},q:`${t*k} ÷ ${t} = ?`,resp:k,pista:`Piensa en la tabla del ${t}: ¿qué número por ${t} da ${t*k}?`});};
}
const TABLAS=[];
for(let t=1;t<=10;t++){
  TABLAS.push({id:'tabla-'+t,grupo:'tablas',titulo:'Tabla del '+t,corto:String(t),niveles:[
    {n:1,nombre:'Conoce la tabla',recuerda:`La tabla del ${t} es contar de ${t} en ${t}.`,gen:tablaNivel(t,1)},
    {n:2,nombre:'Salteada',recuerda:`Las respuestas de la tabla del ${t} no van en orden. Usa la pista si la necesitas.`,gen:tablaNivel(t,2)},
    {n:3,nombre:'Al revés',recuerda:`Multiplicar y dividir son operaciones amigas: si ${t} × 4 = ${t*4}, entonces ${t*4} ÷ ${t} = 4.`,gen:tablaNivel(t,3)},
  ]});
}

// ---------- SUMA ----------
const sumaPista=(a,b)=>{const x=a%10,y=b%10;return `Empieza por las unidades: ${x} + ${y} = ${x+y}`+(x+y>=10?` (escribes ${(x+y)%10} y llevas 1).`:'.');};
function sumaGen(nivel){return ()=>unicas(10,()=>{let a,b,g=0;
  do{ if(nivel===1){a=R(11,89);b=R(11,89);} else if(nivel===2){a=R(11,89);b=R(11,89);} else if(nivel===3){a=R(101,899);b=R(11,899);} else {a=R(1001,8999);b=R(101,8999);}
      g++; }while(g<500 && !(nivel===1?(!hasCarry(a,b)):(hasCarry(a,b))));
  return {vis:{tipo:'col',a,b,op:'+'},q:`${a} + ${b}`,resp:a+b,pista:sumaPista(a,b)};});}
// ---------- RESTA ----------
const restaPista=(a,b)=>{const x=a%10,y=b%10;return x>=y?`Empieza por las unidades: ${x} − ${y} = ${x-y}.`:`En las unidades ${x} es menor que ${y}: pide prestado. ${x+10} − ${y} = ${x+10-y}.`;};
function restaGen(nivel){return ()=>unicas(10,()=>{let a,b,g=0;
  do{ if(nivel===1){a=R(21,99);b=R(11,a-1);} else if(nivel===2){a=R(31,99);b=R(11,a-1);} else if(nivel===3){a=R(201,999);b=R(11,a-1);} else {a=R(2001,9999);b=R(101,a-1);}
      g++; }while(g<800 && !(a>b && (nivel===1?!hasBorrow(a,b):hasBorrow(a,b))));
  return {vis:{tipo:'col',a,b,op:'−'},q:`${a} − ${b}`,resp:a-b,pista:restaPista(a,b)};});}
// ---------- MULTIPLICACIÓN ----------
const multPista=(a,b)=>`Empieza por las unidades: ${a%10} × ${b%10} = ${(a%10)*(b%10)}.`+(b>=10?` Luego multiplica por las decenas (${Math.floor(b/10)}) y suma.`:'');
function multGen(nivel){return ()=>unicas(10,()=>{let a,b;
  if(nivel===1){a=R(11,49);b=R(2,5);} else if(nivel===2){a=R(11,99);b=R(2,9);} else if(nivel===3){a=R(101,999);b=R(2,9);} else {a=R(101,999);b=R(11,99);}
  return {vis:{tipo:'col',a,b,op:'×'},q:`${a} × ${b}`,resp:a*b,pista:multPista(a,b)};});}
// ---------- DIVISIÓN ----------
const divPista=(n,d)=>{const s=String(n);let i=1,p=Number(s[0]);while(p<d&&i<s.length){p=p*10+Number(s[i]);i++;}return `Empieza por ${p}: ¿cuántas veces cabe ${d} en ${p}? Repasa la tabla del ${d}.`;};
function divGen(nivel){return ()=>unicas(10,()=>{let d,q;
  if(nivel===1){d=R(2,5);q=R(Math.ceil(10/d),Math.floor(99/d));}
  else if(nivel===2){d=R(2,9);q=R(Math.ceil(10/d),Math.floor(99/d));}
  else if(nivel===3){d=R(2,9);q=R(Math.ceil(100/d),Math.floor(999/d));}
  else {d=R(2,5);q=R(Math.ceil(1000/d),Math.floor(9999/d));}
  const n=d*q;return {vis:{tipo:'div',dividendo:n,divisor:d},q:`${n} ÷ ${d}`,resp:q,pista:divPista(n,d)};});}

const OPS=[
 {id:'suma',titulo:'Sumas',icono:'+',niveles:[
  {n:1,nombre:'Sin llevar',recuerda:'Suma columna por columna, empezando por la derecha (unidades).',gen:sumaGen(1)},
  {n:2,nombre:'Con llevada',recuerda:'Si una columna suma 10 o más, escribe la unidad y lleva 1 a la siguiente columna.',gen:sumaGen(2)},
  {n:3,nombre:'De 3 cifras',recuerda:'Alinea las columnas: unidades con unidades, decenas con decenas, centenas con centenas.',gen:sumaGen(3)},
  {n:4,nombre:'Sumas grandes',recuerda:'Ve despacio, columna por columna. Las llevadas se anotan arriba.',gen:sumaGen(4)}]},
 {id:'resta',titulo:'Restas',icono:'−',niveles:[
  {n:1,nombre:'Sin prestar',recuerda:'Resta columna por columna, empezando por la derecha.',gen:restaGen(1)},
  {n:2,nombre:'Pidiendo prestado',recuerda:'Si arriba hay un número menor, pide prestado a la columna de al lado: se vuelve 10 más.',gen:restaGen(2)},
  {n:3,nombre:'De 3 cifras',recuerda:'Al pedir prestado, el número del que pediste baja 1.',gen:restaGen(3)},
  {n:4,nombre:'Restas grandes',recuerda:'Para comprobar: el resultado más el número de abajo debe dar el de arriba.',gen:restaGen(4)}]},
 {id:'mult',titulo:'Multiplicaciones',icono:'×',niveles:[
  {n:1,nombre:'2 cifras × 1 cifra (fáciles)',recuerda:'Multiplica cada cifra de arriba por el número de abajo, de derecha a izquierda.',gen:multGen(1)},
  {n:2,nombre:'2 cifras × 1 cifra',recuerda:'Si el producto pasa de 9, escribe la unidad y lleva las decenas.',gen:multGen(2)},
  {n:3,nombre:'3 cifras × 1 cifra',recuerda:'Unidades, decenas y centenas: una por una, y no olvides lo que llevas.',gen:multGen(3)},
  {n:4,nombre:'3 cifras × 2 cifras',recuerda:'Primero multiplica por las unidades. Luego por las decenas, dejando un cero al final. Al último, suma.',gen:multGen(4)}]},
 {id:'div',titulo:'Divisiones',icono:'÷',niveles:[
  {n:1,nombre:'Fáciles (entre 2 a 5)',recuerda:'Pregunta: ¿cuántas veces cabe el divisor? Apóyate en la tabla.',gen:divGen(1)},
  {n:2,nombre:'2 cifras ÷ 1 cifra',recuerda:'Divide la primera cifra; si es menor que el divisor, toma las dos primeras.',gen:divGen(2)},
  {n:3,nombre:'3 cifras ÷ 1 cifra',recuerda:'Divide, multiplica, resta y baja la siguiente cifra.',gen:divGen(3)},
  {n:4,nombre:'4 cifras ÷ 1 cifra',recuerda:'Repite: divide, multiplica, resta y baja. Comprueba multiplicando el resultado por el divisor.',gen:divGen(4)}]},
];

// ---------- DECIMALES ----------
const fmt=n=>String(Math.round(n*1e6)/1e6);
const dec=(n,d)=>(n/Math.pow(10,d)).toFixed(d);
const lugar=d=>d===1?'décimos':'centésimos';
function decSumaGen(nivel){return ()=>unicas(10,()=>{let A,B,g=0;const d=nivel===3?2:1;
  do{ if(nivel===3){A=R(105,899);B=R(105,899);} else {A=R(11,nivel===1?88:99);B=R(11,nivel===1?88:99);} g++;
  }while(g<800 && !(nivel===1?!hasCarry(A,B):(nivel===2?(A%10)+(B%10)>=10:true)));
  const a=dec(A,d),b=dec(B,d),x=A%10,y=B%10;
  return {vis:{tipo:'col',a,b,op:'+'},q:`${a} + ${b}`,resp:(A+B)/Math.pow(10,d),
    pista:`Alinea los puntos. Empieza por los ${lugar(d)}: ${x} + ${y} = ${x+y}`+(x+y>=10?` (escribes ${(x+y)%10} y llevas 1).`:'.')+' El punto va en la misma posición.'};});}
function decRestaGen(nivel){return ()=>unicas(10,()=>{let A,B,g=0;const d=nivel===3?2:1;
  do{ if(nivel===3){A=R(205,999);B=R(105,A-1);} else {A=R(21,99);B=R(11,A-1);} g++;
  }while(g<800 && !(A>B && (nivel===1?!hasBorrow(A,B):(nivel===2?(A%10)<(B%10):true))));
  const a=dec(A,d),b=dec(B,d),x=A%10,y=B%10;
  return {vis:{tipo:'col',a,b,op:'−'},q:`${a} − ${b}`,resp:(A-B)/Math.pow(10,d),
    pista:`Alinea los puntos. Empieza por los ${lugar(d)}: `+(x>=y?`${x} − ${y} = ${x-y}.`:`${x} es menor que ${y}: pide prestado. ${x+10} − ${y} = ${x+10-y}.`)+' El punto va en la misma posición.'};});}
function decNum(maxd){ // número con 0..maxd decimales (sin ceros al final)
  const d=R(0,9)<2?0:R(1,maxd);
  if(d===0){const e=R(2,99);return {txt:String(e),ent:e,d:0};}
  let ent;do{ent=R(1,Math.pow(10,d+1)-1);}while(ent%10===0);
  return {txt:(ent/Math.pow(10,d)).toFixed(d),ent,d};
}
function decMultGen(nivel){return ()=>unicas(10,()=>{
  const ks=nivel===1?[10]:nivel===2?[100]:[10,100,1000],k=ks[R(0,ks.length-1)],z=String(k).length-1;
  const v=decNum(nivel===3?3:2);
  const resp=v.ent*k/Math.pow(10,v.d);
  return {vis:{tipo:'linea'},q:`${v.txt} × ${k} = ?`,resp,
    pista:`Por ${k}, el punto decimal se recorre ${z} lugar${z===1?'':'es'} a la derecha. Si faltan lugares, agrega ceros.`};});}
function decDivGen(nivel){return ()=>unicas(10,()=>{
  const ks=nivel===1?[10]:nivel===2?[100]:[10,100,1000],k=ks[R(0,ks.length-1)],z=String(k).length-1;
  let txt,val;
  if(nivel===3&&R(0,2)===0){const v=decNum(1);txt=v.txt;val=v.ent/Math.pow(10,v.d);}
  else{let n;do{n=R(2,nivel===1?999:(nivel===2?9999:9999));}while(n%10===0&&R(0,3)>0);txt=String(n);val=n;}
  return {vis:{tipo:'linea'},q:`${txt} ÷ ${k} = ?`,resp:val/k,
    pista:`Entre ${k}, el punto decimal se recorre ${z} lugar${z===1?'':'es'} a la izquierda. Si faltan lugares, agrega ceros.`};});}
const DECS=[
 {id:'dec-suma',titulo:'Sumas con decimales',icono:'+.',punto:true,niveles:[
  {n:1,nombre:'Décimos, sin llevar',recuerda:'Pon un número debajo del otro, con los puntos decimales alineados. Suma como si no hubiera punto y baja el punto en la misma posición.',gen:decSumaGen(1)},
  {n:2,nombre:'Décimos, con llevada',recuerda:'Si los décimos suman 10 o más, escribe la cifra y lleva 1 a las unidades. El punto siempre queda alineado.',gen:decSumaGen(2)},
  {n:3,nombre:'Centésimos (dinero)',recuerda:'Con dos decimales funciona igual: alinea los puntos y suma de derecha a izquierda. Es como sumar pesos y centavos.',gen:decSumaGen(3)}]},
 {id:'dec-resta',titulo:'Restas con decimales',icono:'−.',punto:true,niveles:[
  {n:1,nombre:'Décimos, sin prestar',recuerda:'Alinea los puntos decimales y resta de derecha a izquierda. El punto baja en la misma posición.',gen:decRestaGen(1)},
  {n:2,nombre:'Décimos, pidiendo prestado',recuerda:'Si arriba hay un número menor, pide prestado a la columna de al lado: se vuelve 10 más.',gen:decRestaGen(2)},
  {n:3,nombre:'Centésimos (dinero)',recuerda:'Con dos decimales es igual: alinea los puntos y resta. Para comprobar, suma el resultado y el número de abajo.',gen:decRestaGen(3)}]},
 {id:'dec-por10',titulo:'Multiplicar ×10, ×100, ×1000',icono:'×10',punto:true,niveles:[
  {n:1,nombre:'Por 10',recuerda:'Al multiplicar por 10, el punto decimal se recorre 1 lugar a la derecha. Ejemplo: 3.4 × 10 = 34.',gen:decMultGen(1)},
  {n:2,nombre:'Por 100',recuerda:'Por 100, el punto se recorre 2 lugares a la derecha. Si faltan lugares, agrega ceros. Ejemplo: 4.5 × 100 = 450.',gen:decMultGen(2)},
  {n:3,nombre:'Por 10, 100 y 1000',recuerda:'Cuenta los ceros: por 10 es 1 lugar, por 100 son 2 y por 1000 son 3, siempre a la derecha. Ejemplo: 0.007 × 1000 = 7.',gen:decMultGen(3)}]},
 {id:'dec-entre10',titulo:'Dividir ÷10, ÷100, ÷1000',icono:'÷10',punto:true,niveles:[
  {n:1,nombre:'Entre 10',recuerda:'Al dividir entre 10, el punto decimal se recorre 1 lugar a la izquierda. Ejemplo: 34 ÷ 10 = 3.4.',gen:decDivGen(1)},
  {n:2,nombre:'Entre 100',recuerda:'Entre 100, el punto se recorre 2 lugares a la izquierda. Si faltan lugares, agrega ceros. Ejemplo: 7 ÷ 100 = 0.07.',gen:decDivGen(2)},
  {n:3,nombre:'Entre 10, 100 y 1000',recuerda:'Cuenta los ceros: entre 10 es 1 lugar, entre 100 son 2 y entre 1000 son 3, siempre a la izquierda. Ejemplo: 45 ÷ 1000 = 0.045.',gen:decDivGen(3)}]},
];
DECS.forEach(m=>m.grupo='decimales');
// ---------- MEDIDAS (conversión de unidades) ----------
const FAM={
 long:{base:'m',nom:'metro',sim:['km','hm','dam','m','dm','cm','mm'],nombres:['kilómetro','hectómetro','decámetro','metro','decímetro','centímetro','milímetro'],
   usuales:[[0,3],[3,5],[3,6],[5,6]]},
 cap:{base:'l',nom:'litro',sim:['kl','hl','dal','l','dl','cl','ml'],nombres:['kilolitro','hectolitro','decalitro','litro','decilitro','centilitro','mililitro'],
   usuales:[[0,3],[3,5],[3,6],[4,5]]},
 masa:{base:'g',nom:'gramo',sim:['kg','hg','dag','g','dg','cg','mg'],nombres:['kilogramo','hectogramo','decagramo','gramo','decigramo','centigramo','miligramo'],
   usuales:[[0,3],[3,6],[3,5]]}};
function medPreg(f,i,j){ // convierte de la unidad i a la unidad j
  const F=FAM[f],s=Math.abs(j-i),baja=j>i;
  let ent,d=0,resp,txt;
  if(baja){ if(R(0,2)===0){do{ent=R(11,99);}while(ent%10===0);d=1;txt=(ent/10).toFixed(1);}else{ent=R(2,99);txt=String(ent);}
    resp=Math.round(ent*Math.pow(10,s-d)*1e6)/1e6; }
  else { ent=R(2,s>=3?9999:999); txt=String(ent); resp=Math.round(ent/Math.pow(10,s)*1e6)/1e6; }
  const ruta=[];for(let k=i;k!==j;k+=(baja?1:-1))ruta.push(F.sim[k]);ruta.push(F.sim[j]);
  const pista=(baja
    ?`De ${F.sim[i]} a ${F.sim[j]} bajas ${s} escalón${s>1?'es':''} (${ruta.join(' → ')}). Cada escalón es ×10: recorre el punto ${s} lugar${s>1?'es':''} a la derecha.`
    :`De ${F.sim[i]} a ${F.sim[j]} subes ${s} escalón${s>1?'es':''} (${ruta.join(' → ')}). Cada escalón es ÷10: recorre el punto ${s} lugar${s>1?'es':''} a la izquierda.`);
  return {vis:{tipo:'esc',sim:F.sim,desde:i,hasta:j},q:`${txt} ${F.sim[i]} = ? ${F.sim[j]}`,resp,pista};
}
function medGen(f,nivel){return ()=>unicas(10,()=>{
  const F=FAM[f];let i,j;
  if(nivel<=2){const p=F.usuales[R(0,F.usuales.length-1)];i=nivel===1?p[0]:p[1];j=nivel===1?p[1]:p[0];}
  else{do{i=R(0,6);j=R(0,6);}while(i===j||Math.abs(i-j)>3||(nivel===3&&j<i));}
  return medPreg(f,i,j);});}
const medRec=f=>{const F=FAM[f];return `Escalera: ${F.sim.join(' · ')}. Cada escalón vale 10. Si bajas (a una unidad más pequeña) multiplicas; si subes, divides.`;};
const MEDS=[['long','longitud','Longitud (metros)','m'],['cap','capacidad','Capacidad (litros)','l'],['masa','masa','Masa (gramos)','g']].map(([f,id,t,ic])=>({
 id:'med-'+id,titulo:t,icono:ic,punto:true,niveles:[
  {n:1,nombre:'Usuales: de mayor a menor (×)',recuerda:medRec(f)+' Ejemplo: 3 '+FAM[f].sim[0]+' = 3000 '+FAM[f].sim[3]+'.',gen:medGen(f,1)},
  {n:2,nombre:'Usuales: de menor a mayor (÷)',recuerda:medRec(f)+' Ejemplo: 4500 '+FAM[f].sim[3]+' = 4.5 '+FAM[f].sim[0]+'.',gen:medGen(f,2)},
  {n:3,nombre:'Todas las unidades: bajando (×)',recuerda:medRec(f)+' Cuenta los escalones y recorre el punto a la derecha.',gen:medGen(f,3)},
  {n:4,nombre:'Todas las unidades: subiendo y bajando',recuerda:medRec(f)+' Primero decide si subes o bajas, luego cuenta los escalones.',gen:medGen(f,4)}]}));
MEDS.forEach(m=>m.grupo='medidas');
// ---------- POLÍGONOS ----------
const NOM_POLI={3:'triángulo',4:'cuadrilátero',5:'pentágono',6:'hexágono',7:'heptágono',8:'octágono'};
const pick=a=>a[R(0,a.length-1)];
function orient(p){let a=0;for(let i=0;i<p.length;i++){const q=p[(i+1)%p.length];a+=p[i][0]*q[1]-q[0]*p[i][1];}return a>0?1:-1;}
function infoPoli(p){const n=p.length,o=orient(p);let reflex=0,rectos=0;
  for(let i=0;i<n;i++){const a=p[(i+n-1)%n],b=p[i],c=p[(i+1)%n];
    const v1=[b[0]-a[0],b[1]-a[1]],v2=[c[0]-b[0],c[1]-b[1]];
    const cr=v1[0]*v2[1]-v1[1]*v2[0],dot=v1[0]*v2[0]+v1[1]*v2[1],den=Math.hypot(v1[0],v1[1])*Math.hypot(v2[0],v2[1]);
    if(cr*o<0)reflex++;else if(Math.abs(dot)/den<0.02)rectos++;}
  return {n,reflex,rectos,concavo:reflex>0};}
function ajusta(pts,o){o=o||{};const W=o.w||300,H=o.h||240,pad=o.pad||30;let q=pts.map(p=>[p[0],p[1]]);
  const rot=o.rot==null?R(0,3):o.rot;for(let k=0;k<rot;k++)q=q.map(p=>[-p[1],p[0]]);
  if(o.flip!==false&&R(0,1))q=q.map(p=>[-p[0],p[1]]);
  const xs=q.map(p=>p[0]),ys=q.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const sc=Math.min((W-2*pad)/(x1-x0||1),(H-2*pad)/(y1-y0||1)),ox=(W-(x1-x0)*sc)/2,oy=(H-(y1-y0)*sc)/2;
  return q.map(p=>[Math.round((ox+(p[0]-x0)*sc)*10)/10,Math.round((oy+(p[1]-y0)*sc)*10)/10]);}
function convexo(n,o){let ang,g=0;const mn=n>6?22:28;
  do{ang=Array.from({length:n},()=>Math.random()*360).sort((a,b)=>a-b);g++;}
  while(g<20000&&!ang.every((a,i)=>{const d=(i===n-1?ang[0]+360:ang[i+1])-a;return d>=mn&&d<=165;}));
  const ry=.72+Math.random()*.28;
  return ajusta(ang.map(a=>[Math.cos(a*Math.PI/180),Math.sin(a*Math.PI/180)*ry]),Object.assign({rot:0},o));}
function regular(n,o){return ajusta(Array.from({length:n},(_,i)=>[Math.cos(2*Math.PI*i/n-Math.PI/2),Math.sin(2*Math.PI*i/n-Math.PI/2)]),Object.assign({rot:0,flip:false},o));}
const CONC=[
 {nom:'forma de L',p:[[10,10],[40,10],[40,60],[90,60],[90,90],[10,90]]},
 {nom:'punta de flecha',p:[[50,8],[92,92],[50,64],[8,92]]},
 {nom:'pentágono con hendidura',p:[[8,22],[50,52],[92,22],[82,92],[18,92]]},
 {nom:'forma de U',p:[[10,10],[36,10],[36,62],[64,62],[64,10],[90,10],[90,90],[10,90]]},
 {nom:'estrella de 4 picos',p:[[50,4],[62,38],[96,50],[62,62],[50,96],[38,62],[4,50],[38,38]]},
 {nom:'forma de T',p:[[10,10],[90,10],[90,40],[62,40],[62,90],[38,90],[38,40],[10,40]]},
 {nom:'montaña en M',p:[[10,90],[10,40],[30,15],[50,48],[70,15],[90,40],[90,90]]},
 {nom:'flecha ancha',p:[[8,28],[58,28],[58,8],[94,50],[58,92],[58,72],[8,72]]}];
const RECT=[
 {nom:'rectángulo',p:[[10,25],[90,25],[90,75],[10,75]]},
 {nom:'cuadrado',p:[[25,10],[75,10],[75,90],[25,90]]},
 {nom:'triángulo rectángulo',p:[[10,10],[10,90],[85,90]]},
 {nom:'trapecio rectángulo',p:[[10,90],[10,20],[55,20],[90,90]]}];
function figura(t,o){return ajusta(t.p,o);}
// SVG
function svgPoli(v){
  const pts=v.pts,d=pts.map(p=>p.join(',')).join(' ');
  let s=`<svg class="poli" viewBox="0 0 300 240" role="img" aria-label="Polígono"><polygon points="${d}" fill="#ffe9b8" stroke="#771d39" stroke-width="4" stroke-linejoin="round"/>`;
  (v.diag||[]).forEach(([i,j])=>{s+=`<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="#1f2d86" stroke-width="3" stroke-dasharray="7 6"/>`;});
  if(v.puntos)pts.forEach(p=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="6.5" fill="#ec5923" stroke="#fff" stroke-width="2"/>`;});
  if(v.resalta!=null)s+=`<circle cx="${pts[v.resalta][0]}" cy="${pts[v.resalta][1]}" r="10" fill="#0a8143" stroke="#fff" stroke-width="3"/>`;
  return s+'</svg>';
}
function svgPoli3(v){
  let s=`<svg class="poli tres" viewBox="0 0 330 150" role="img" aria-label="Tres polígonos">`;
  v.figs.forEach((pts,k)=>{s+=`<g transform="translate(${k*110},0)"><polygon points="${pts.map(p=>p.join(',')).join(' ')}" fill="#ffe9b8" stroke="#771d39" stroke-width="3.5" stroke-linejoin="round"/><text x="50" y="146" text-anchor="middle" font-size="22" font-weight="800" fill="#1f2d86" font-family="sans-serif">${'ABC'[k]}</text></g>`;});
  return s+'</svg>';
}
window.svgPoli=svgPoli;window.svgPoli3=svgPoli3;
// preguntas
const firma=P=>P.map(p=>p.join(',')).join(';');
function qBase(P,q,det,resp,pista,extra){return Object.assign({vis:{tipo:'poli',pts:P},q,det:q+(det?' ['+det+']':''),resp,pista,k:q+firma(P)},extra||{});}
const nomP=P=>{const i=infoPoli(P);return i.concavo?'cóncavo de '+i.n+' lados':NOM_POLI[i.n]||(i.n+' lados');};
const qVert=(P,puntos)=>{const i=infoPoli(P),p=qBase(P,'¿Cuántos vértices tiene este polígono?',nomP(P),i.n,'Los vértices son las esquinas, donde se juntan dos lados. Cuenta cada esquina una sola vez.');p.vis.puntos=!!puntos;return p;};
const qLados=(P,puntos)=>{const i=infoPoli(P),p=qBase(P,'¿Cuántos lados tiene este polígono?',nomP(P),i.n,'Los lados son los segmentos rectos que forman el borde. Cuéntalos recorriendo el contorno con el dedo.');p.vis.puntos=!!puntos;return p;};
const qAng=P=>{const i=infoPoli(P);return qBase(P,'¿Cuántos ángulos tiene este polígono?',nomP(P),i.n,'En cada vértice se forma un ángulo. Hay tantos ángulos como vértices (y como lados).');};
const qRect=P=>{const i=infoPoli(P);return qBase(P,'¿Cuántos ángulos rectos (de 90°) tiene?',nomP(P),i.rectos,'Un ángulo recto es como la esquina de una hoja de papel (90°). Revisa esquina por esquina; los ángulos "hundidos" no son rectos.');};
const qEntr=P=>{const i=infoPoli(P);return qBase(P,'¿Cuántos ángulos "hundidos" (mayores de 180°) tiene?',nomP(P),i.reflex,'Un ángulo hundido (entrante) apunta hacia adentro del polígono, como un mordisco. Cuenta esas esquinas.');};
function diagDe(n,v){const o=[];for(let j=0;j<n;j++){if(j!==v&&j!==(v+1)%n&&j!==(v+n-1)%n)o.push([v,j]);}return o;}
const qDiagV=P=>{const n=P.length,v=R(0,n-1),p=qBase(P,'¿Cuántas diagonales salen del vértice verde?',NOM_POLI[n],n-3,`Una diagonal une dos vértices que no son vecinos. Desde un vértice no se puede ir a sí mismo ni a sus 2 vecinos: ${n} − 3 = ${n-3}.`);p.vis.resalta=v;p.vis.diag=diagDe(n,v);p.k+=v;return p;};
const qDiagT=(P,dibuja)=>{const n=P.length,t=n*(n-3)/2,p=qBase(P,'¿Cuántas diagonales tiene en total?',NOM_POLI[n],t,`De cada vértice salen ${n-3} diagonales. Hay ${n} vértices: ${n} × ${n-3} = ${n*(n-3)}. Como cada diagonal se cuenta 2 veces, ${n*(n-3)} ÷ 2 = ${t}.`);
  if(dibuja){const d=[];for(let i=0;i<n;i++)for(let j=i+2;j<n;j++){if(!(i===0&&j===n-1))d.push([i,j]);}p.vis.diag=d;}return p;};
const PISTA_TIPO='Convexo: todos sus ángulos son menores de 180° y no tiene "hundimientos". Cóncavo: tiene al menos un ángulo hundido (mayor de 180°), como si le hubieran dado un mordisco.';
const qTipo=P=>{const i=infoPoli(P);return qBase(P,'¿Este polígono es convexo o cóncavo?',nomP(P),i.concavo?1:0,PISTA_TIPO,{opciones:['Convexo','Cóncavo']});};
function qTipo3(){
  const quiere=R(0,1)?'cóncavo':'convexo',unico=R(0,2),figs=[];
  for(let k=0;k<3;k++){const concav=(k===unico)===(quiere==='cóncavo');
    figs.push(concav?ajusta(pick(CONC).p,{w:100,h:100,pad:10}):convexo(R(4,7),{w:100,h:100,pad:10}));}
  return {vis:{tipo:'poli3',figs},q:`¿Cuál de estos polígonos es ${quiere}?`,det:`¿Cuál de estos polígonos es ${quiere}? [respuesta ${'ABC'[unico]}]`,resp:unico,opciones:['A','B','C'],pista:PISTA_TIPO,k:'t3'+figs.map(firma).join('|')};
}
const convN=(a,b)=>convexo(R(a,b));
const concT=()=>figura(pick(CONC));
function polN1(){return ()=>{let i=0;return unicas(10,()=>{const j=i++,esc_=j<7?convN(3,8):concT();return (j%2?qLados:qVert)(esc_,j<5);}).sort(()=>Math.random()-.5);};}
function polN2(){return ()=>unicas(10,()=>{const j=R(0,9);
  if(j<4)return qAng(R(0,2)?convN(3,8):concT());
  if(j<8)return qRect(figura(pick(RECT)));
  return qRect(regular(pick([3,5,6])));});}
function polN3(){return ()=>unicas(10,()=>{const n=R(4,8);return R(0,1)?qDiagV(convexo(n)):qDiagT(convexo(R(4,6)),true);});}
function polN4(){return ()=>unicas(10,()=>R(0,1)?qTipo(R(0,1)?concT():convN(3,8)):qTipo3());}
function polN5(){return ()=>unicas(10,()=>{const j=R(0,9);
  if(j<2)return (R(0,1)?qVert:qLados)(concT(),false);
  if(j<4)return qEntr(concT());
  if(j<5)return qRect(figura(pick(RECT.concat(CONC.filter(c=>c.nom!=='punta de flecha'&&c.nom!=='pentágono con hendidura'&&c.nom!=='montaña en M'&&c.nom!=='estrella de 4 picos'&&c.nom!=='flecha ancha')))));
  if(j<7)return qDiagT(convexo(R(5,8)),false);
  if(j<8)return qTipo3();
  return qTipo(R(0,1)?concT():convN(4,8));});}
const POLI=[{id:'poligonos',grupo:'geometria',titulo:'Polígonos',icono:'⬠',niveles:[
 {n:1,nombre:'Vértices y lados',recuerda:'Un polígono es una figura cerrada formada por lados rectos. Los vértices son las esquinas donde se unen dos lados. Siempre hay tantos vértices como lados.',gen:polN1()},
 {n:2,nombre:'Ángulos y ángulos rectos',recuerda:'En cada vértice se forma un ángulo: hay tantos ángulos como vértices. Un ángulo recto mide 90°, como la esquina de una hoja.',gen:polN2()},
 {n:3,nombre:'Diagonales',recuerda:'Una diagonal es un segmento que une dos vértices que no son vecinos. Desde un vértice salen (n − 3) diagonales, donde n es el número de vértices.',gen:polN3()},
 {n:4,nombre:'Convexos y cóncavos',recuerda:'Convexo: todos sus ángulos miden menos de 180° y no tiene hundimientos. Cóncavo: tiene al menos un ángulo hundido, mayor de 180°, como un mordisco.',gen:polN4()},
 {n:5,nombre:'Reto de polígonos',recuerda:'Todo junto: vértices, lados, ángulos (rectos y hundidos), diagonales y si es convexo o cóncavo. Usa las pistas si las necesitas.',gen:polN5()}]}];


OPS.forEach(m=>m.grupo='operaciones');
window.MODULOS=[...TABLAS,...OPS,...DECS,...MEDS,...POLI];
window.R=R;window.fmtNum=fmt;
})();
