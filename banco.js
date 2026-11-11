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
function decMul1Gen(nivel){return ()=>unicas(10,()=>{
  const k=R(2,nivel===1?5:9);let ent,d,g=0;
  do{ g++;
    if(nivel===1){d=1;ent=R(11,99);}
    else if(nivel===2){d=1;ent=R(12,999);}
    else if(nivel===3){d=2;ent=R(105,999);}
    else {d=R(0,2)?2:1;ent=d===2?R(10005,99999):R(1005,9999);}
  }while(g<900 && !(nivel===1?String(ent).split('').every(c=>Number(c)*k<10):(nivel===4?ent%100!==0:(ent%10!==0||R(0,3)===0))));
  const a=dec(ent,d),prod=ent*k,resp=Math.round(prod/Math.pow(10,d)*1e6)/1e6;
  return {vis:{tipo:'col',a,b:String(k),op:'×'},q:`${a} × ${k}`,resp,
    pista:`Quita el punto y multiplica: ${ent} × ${k} = ${prod}. El número tenía ${d} decimal${d>1?'es':''}, así que recorre el punto ${d} lugar${d>1?'es':''} desde la derecha: ${fmt(resp)}.`};});}
function decDiv1Gen(nivel){return ()=>unicas(10,()=>{
  let k,ent,qent,dq,g=0;
  do{ g++;
    if(nivel===1){k=R(2,5);qent=R(12,49);ent=qent*k;dq=1;}
    else if(nivel===2){k=R(2,9);qent=R(12,99);ent=qent*k;dq=1;}
    else if(nivel===3){k=R(2,9);qent=R(105,499);ent=qent*k;dq=2;}
    else {k=[2,4,5,8][R(0,3)];ent=R(11,399);qent=ent*10/k;dq=2;}
  }while(g<900 && (qent%10===0 || (nivel===4&&(ent%k===0||ent%10===0||(ent*10)%k!==0))));
  const d=nivel===3?2:1,a=dec(ent,d),resp=Math.round(qent/Math.pow(10,dq)*1e6)/1e6;
  const pista=nivel===4
    ?`${a} es lo mismo que ${dec(ent*10,2)}. Quita el punto y divide: ${ent*10} ÷ ${k} = ${qent}. Ahora el resultado lleva 2 decimales: ${fmt(resp)}.`
    :`Divide como si no hubiera punto: ${ent} ÷ ${k} = ${qent}. El punto del resultado va en el mismo lugar que el del dividendo (${d} decimal${d>1?'es':''}): ${fmt(resp)}.`;
  return {vis:{tipo:'div',dividendo:a,divisor:k},q:`${a} ÷ ${k}`,resp,pista};});}
const DECS=[
 {id:'dec-mult1',titulo:'Decimal × un dígito',icono:'3.4×2',punto:true,niveles:[
  {n:1,nombre:'Décimos, sin llevar',recuerda:'Multiplica como si no hubiera punto y después pon el punto: el resultado lleva los mismos decimales que el número. Ejemplo: 2.3 × 3 → 23 × 3 = 69 → 6.9.',gen:decMul1Gen(1)},
  {n:2,nombre:'Décimos, con llevadas',recuerda:'Multiplica de derecha a izquierda y lleva lo que pase de 9. Al final, el punto queda con 1 decimal. Ejemplo: 4.7 × 6 → 47 × 6 = 282 → 28.2.',gen:decMul1Gen(2)},
  {n:3,nombre:'Centésimos',recuerda:'Con dos decimales, el resultado lleva dos decimales (si queda un 0 al final, puedes quitarlo). Ejemplo: 3.45 × 4 → 345 × 4 = 1380 → 13.80 = 13.8.',gen:decMul1Gen(3)},
  {n:4,nombre:'Números grandes',recuerda:'Igual que antes: quita el punto, multiplica, y vuelve a poner el punto contando los decimales. Ejemplo: 345.90 × 4 → 34590 × 4 = 138360 → 1383.60 = 1383.6.',gen:decMul1Gen(4)}]},
 {id:'dec-div1',titulo:'Decimal ÷ un dígito',icono:'7.5÷3',punto:true,niveles:[
  {n:1,nombre:'Décimos, divisor chico',recuerda:'Divide como si no hubiera punto y pon el punto en el resultado justo arriba del punto del dividendo. Ejemplo: 7.5 ÷ 5 → 75 ÷ 5 = 15 → 1.5.',gen:decDiv1Gen(1)},
  {n:2,nombre:'Décimos',recuerda:'Divide cifra por cifra. Cuando bajes el punto del dividendo, escribe el punto en el resultado. Ejemplo: 8.4 ÷ 7 → 84 ÷ 7 = 12 → 1.2.',gen:decDiv1Gen(2)},
  {n:3,nombre:'Centésimos',recuerda:'Con dos decimales, el resultado también lleva dos decimales. Ejemplo: 4.56 ÷ 3 → 456 ÷ 3 = 152 → 1.52.',gen:decDiv1Gen(3)},
  {n:4,nombre:'Agregando un cero',recuerda:'Si al dividir sobra algo, agrega un cero al final del dividendo y sigue dividiendo. Ejemplo: 7.5 ÷ 2 → 7.50 ÷ 2 = 3.75.',gen:decDiv1Gen(4)}]},
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



// ---------- COORDENADAS (plano cartesiano) ----------
const MEN='−',fc=n=>n<0?MEN+(-n):String(n),par=(x,y)=>`(${fc(x)}, ${fc(y)})`;
function svgPlano(v){
  const x0=v.x0,x1=v.x1,y0=v.y0,y1=v.y1,cs=v.cs||28,m=26,W=(x1-x0)*cs+2*m,H=(y1-y0)*cs+2*m;
  const X=x=>m+(x-x0)*cs,Y=y=>m+(y1-y)*cs;
  let s=`<svg class="poli plano" viewBox="0 0 ${W} ${H}" role="img" aria-label="Plano cartesiano"><rect x="${m}" y="${m}" width="${W-2*m}" height="${H-2*m}" fill="#fffaf0" stroke="#cdbf9c" stroke-width="1.5"/>`;
  for(let x=x0;x<=x1;x++)s+=`<line x1="${X(x)}" y1="${m}" x2="${X(x)}" y2="${H-m}" stroke="#e3dac4" stroke-width="1.2"/>`;
  for(let y=y0;y<=y1;y++)s+=`<line x1="${m}" y1="${Y(y)}" x2="${W-m}" y2="${Y(y)}" stroke="#e3dac4" stroke-width="1.2"/>`;
  s+=`<line x1="${m-6}" y1="${Y(0)}" x2="${W-m+8}" y2="${Y(0)}" stroke="#202522" stroke-width="2.6"/><line x1="${X(0)}" y1="${H-m+6}" x2="${X(0)}" y2="${m-8}" stroke="#202522" stroke-width="2.6"/>`;
  s+=`<text x="${W-6}" y="${Y(0)-7}" text-anchor="end" font-size="15" font-weight="800" font-style="italic" fill="#771d39" font-family="sans-serif">x</text><text x="${X(0)+8}" y="13" font-size="15" font-weight="800" font-style="italic" fill="#771d39" font-family="sans-serif">y</text>`;
  const ty=(y0===0)?Y(0)+15:Y(0)+15,tx=X(0)-7;
  for(let x=x0;x<=x1;x++){if(x===0)continue;s+=`<text x="${X(x)}" y="${ty}" text-anchor="middle" font-size="11.5" fill="#4a5550" font-family="sans-serif">${fc(x)}</text>`;}
  for(let y=y0;y<=y1;y++){if(y===0)continue;s+=`<text x="${tx}" y="${Y(y)+4}" text-anchor="end" font-size="11.5" fill="#4a5550" font-family="sans-serif">${fc(y)}</text>`;}
  s+=`<text x="${tx}" y="${ty}" text-anchor="end" font-size="11.5" fill="#4a5550" font-family="sans-serif">0</text>`;
  (v.lineas||[]).forEach(([a,c])=>{s+=`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(c[0])}" y2="${Y(c[1])}" stroke="#1f2d86" stroke-width="2.6" stroke-dasharray="6 5"/>`;});
  (v.pts||[]).forEach(p=>{s+=`<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="6.5" fill="${p.c||'#ec5923'}" stroke="#fff" stroke-width="2"/>`+(p.l?`<text x="${X(p.x)+9}" y="${Y(p.y)-8}" font-size="17" font-weight="800" fill="#1f2d86" font-family="sans-serif">${p.l}</text>`:'');});
  return s+'</svg>';
}
window.svgPlano=svgPlano;
const GR1={x0:0,x1:10,y0:0,y1:10},GR4={x0:-6,x1:6,y0:-6,y1:6};
const dist4=(c,x,lim)=>{ // 3 distractores distintos de la respuesta
  const ok=new Set([c]),out=[];
  for(const [a,b] of x){const t=par(a,b);if(!ok.has(t)&&a>=lim[0]&&a<=lim[1]&&b>=lim[0]&&b<=lim[1]){ok.add(t);out.push(t);}if(out.length===3)break;}
  return out;
};
function opts4(cx,cy,cands,lim){ // arma 4 opciones barajadas con la correcta
  const c=par(cx,cy),d=dist4(c,cands,lim);let g=0;
  while(d.length<3&&g++<200){const a=R(lim[0],lim[1]),b=R(lim[0],lim[1]),t=par(a,b);if(t!==c&&!d.includes(t))d.push(t);}
  const o=shuffle([c,...d]);return {opciones:o,resp:o.indexOf(c)};
}
const U=fn=>unicas(10,()=>{let p,g=0;do{p=fn();}while(p.bad&&g++<500);return p;});
function ptsAB(P){return P.map((p,i)=>({x:p[0],y:p[1],l:'ABCD'[i]}));}
// --- primer cuadrante
function c1N1(){return ()=>U(()=>{const x=R(1,9),y=R(1,9);if(x===y)return {bad:1,k:'n'+Math.random()};
  const ex=R(0,1)===0;
  return {vis:{tipo:'plano',...GR1,pts:[{x,y,l:'A'}]},q:ex?'Punto A: ¿cuánto vale x?':'Punto A: ¿cuánto vale y?',det:`${ex?'x':'y'} del punto A ${par(x,y)}`,resp:ex?x:y,k:`c1a${x},${y},${ex}`,
    pista:ex?`x es el lugar en el eje horizontal (→). Baja desde A hasta ese eje: cae en el ${x}. Entonces x = ${x}.`:`y es el lugar en el eje vertical (↑). Ve desde A hacia la izquierda hasta ese eje: llega al ${y}. Entonces y = ${y}.`};});}
function c1N2(){return ()=>U(()=>{const x=R(1,9),y=R(1,9);if(x===y)return {k:'n'+Math.random(),bad:1};
  const o=opts4(x,y,[[y,x],[x,y+1],[x,y-1],[x+1,y],[x-1,y],[x+1,y+1]],[0,10]);
  return {vis:{tipo:'plano',...GR1,pts:[{x,y,l:'A'}]},q:'¿Cuáles son las coordenadas del punto A?',det:`punto A ${par(x,y)}`,opciones:o.opciones,resp:o.resp,k:`c1b${x},${y}`,
    pista:`Primero se lee x (cuánto avanzas → desde el 0) y después y (cuánto subes ↑). A está en x = ${x}, y = ${y}: ${par(x,y)}.`};});}
function c1N3(){return ()=>U(()=>{const a=R(2,8),b=R(2,8);if(a===b)return {bad:1,k:'n'+Math.random()};
  const P=shuffle([[a,b],[b,a],[a,b+1>9?b-1:b+1],[a+1>9?a-1:a+1,b]]),i=P.findIndex(p=>p[0]===a&&p[1]===b);
  return {vis:{tipo:'plano',x0:0,x1:10,y0:0,y1:10,pts:ptsAB(P)},q:`¿Cuál punto está en ${par(a,b)}?`,det:`ubicar ${par(a,b)} [respuesta ${'ABCD'[i]}]`,opciones:['A','B','C','D'],resp:i,k:`c1c${a},${b},${P.join(';')}`,
    pista:`Empieza en el 0. Avanza ${a} a la derecha (→) y luego sube ${b} (↑). Ahí está el punto ${'ABCD'[i]}.`};});}
function c1N4(){return ()=>U(()=>{
  if(R(0,1)){const hor=R(0,1),f=R(1,9),a=R(1,8),b=R(a+1,9),A=hor?[a,f]:[f,a],B=hor?[b,f]:[f,b];
    return {vis:{tipo:'plano',...GR1,pts:ptsAB([A,B]),lineas:[[A,B]]},q:'¿Cuántas unidades hay de A a B?',det:`distancia A${par(...A)} a B${par(...B)}`,resp:b-a,k:`c1d${A},${B}`,
      pista:`A y B están en la misma ${hor?'fila (y igual)':'columna (x igual)'}. Resta los números que cambian: ${b} − ${a} = ${b-a}. También puedes contar los cuadritos.`};}
  const x1=R(1,6),x2=R(x1+2,9),y1=R(1,6),y2=R(y1+2,9);if(x1===y2)return {bad:1,k:'n'+Math.random()};
  const A=[x1,y1],B=[x2,y1],C=[x2,y2],o=opts4(x1,y2,[[y2,x1],[x2,y2],[x1,y1],[x1+1,y2]],[0,10]);
  return {vis:{tipo:'plano',...GR1,pts:ptsAB([A,B,C]),lineas:[[A,B],[B,C]]},q:'A, B y C son tres vértices de un rectángulo. ¿Dónde está el vértice D?',det:`rectángulo A${par(...A)} B${par(...B)} C${par(...C)}`,opciones:o.opciones,resp:o.resp,k:`c1e${A},${B},${C}`,
    pista:`D está arriba de A (misma x = ${x1}) y a la izquierda de C (misma y = ${y2}). Entonces D = ${par(x1,y2)}.`};});}
function movTxt(dx,dy){const h=dx?`${Math.abs(dx)} ${dx>0?'a la derecha':'a la izquierda'}`:'',v=dy?`${Math.abs(dy)} ${dy>0?'hacia arriba':'hacia abajo'}`:'';return h&&v?`${h} y ${v}`:(h||v);}
function movQ(lim,gr,tag){return ()=>{const x=R(lim[0],lim[1]),y=R(lim[0],lim[1]);let dx=R(-5,5),dy=R(-5,5);
  if(!dx||!dy||Math.abs(dx)===Math.abs(dy))return {bad:1,k:'n'+Math.random()};
  const nx=x+dx,ny=y+dy;if(nx<lim[0]||nx>lim[1]||ny<lim[0]||ny>lim[1])return {bad:1,k:'n'+Math.random()};
  const o=opts4(nx,ny,[[x+dy,y+dx],[nx,y],[x,ny],[x-dx,y-dy],[x+dx,y-dy],[x-dx,y+dy]],lim);
  return {vis:{tipo:'plano',...gr,pts:[{x,y,l:'A'}]},q:`Sales de A ${par(x,y)} y te mueves ${movTxt(dx,dy)}. ¿Dónde llegas?`,det:`mover A${par(x,y)} ${movTxt(dx,dy)}`,opciones:o.opciones,resp:o.resp,k:`${tag}${x},${y},${dx},${dy}`,
    pista:`Mover a la derecha suma a x; a la izquierda resta. Hacia arriba suma a y; hacia abajo resta. x: ${fc(x)} ${dx>0?'+':'−'} ${Math.abs(dx)} = ${fc(nx)}. y: ${fc(y)} ${dy>0?'+':'−'} ${Math.abs(dy)} = ${fc(ny)}.`};};}
function c1N5(){const g=movQ([0,10],GR1,'c1f');return ()=>U(g);}
// --- cuatro cuadrantes
const CUAD=['I','II','III','IV'],cuadDe=(x,y)=>x>0&&y>0?0:(x<0&&y>0?1:(x<0&&y<0?2:3));
const SIG=['x positivo y y positivo (derecha y arriba)','x negativo y y positivo (izquierda y arriba)','x negativo y y negativo (izquierda y abajo)','x positivo y y negativo (derecha y abajo)'];
function c4N1(){return ()=>U(()=>{const x=R(1,6)*(R(0,1)?1:-1),y=R(1,6)*(R(0,1)?1:-1),c=cuadDe(x,y),dib=R(0,2)>0;
  return {vis:{tipo:'plano',...GR4,pts:dib?[{x,y,l:'A'}]:[]},q:dib?'¿En qué cuadrante está el punto A?':`¿En qué cuadrante está el punto ${par(x,y)}?`,det:`cuadrante de ${par(x,y)}`,opciones:CUAD,resp:c,k:`c4a${x},${y},${dib}`,
    pista:`Fíjate en los signos. Aquí hay ${SIG[c]}: cuadrante ${CUAD[c]}. (I: derecha-arriba · II: izquierda-arriba · III: izquierda-abajo · IV: derecha-abajo.)`};});}
function c4N2(){return ()=>U(()=>{const x=R(-6,6),y=R(-6,6);if(!x||!y||Math.abs(x)===Math.abs(y))return {bad:1,k:'n'+Math.random()};
  const o=opts4(x,y,[[y,x],[-x,y],[x,-y],[-x,-y]],[-6,6]);
  return {vis:{tipo:'plano',...GR4,pts:[{x,y,l:'A'}]},q:'¿Cuáles son las coordenadas del punto A?',det:`punto A ${par(x,y)}`,opciones:o.opciones,resp:o.resp,k:`c4b${x},${y}`,
    pista:`x: ${x>0?'a la derecha del 0':'a la izquierda del 0'} → ${fc(x)}. y: ${y>0?'arriba del 0':'abajo del 0'} → ${fc(y)}. Primero x y luego y: ${par(x,y)}.`};});}
function c4N3(){return ()=>U(()=>{const a=R(-5,5),b=R(-5,5);if(!a||!b||Math.abs(a)===Math.abs(b))return {bad:1,k:'n'+Math.random()};
  const P=shuffle([[a,b],[-a,b],[a,-b],[b,a]]),i=P.findIndex(p=>p[0]===a&&p[1]===b);
  return {vis:{tipo:'plano',...GR4,pts:ptsAB(P)},q:`¿Cuál punto está en ${par(a,b)}?`,det:`ubicar ${par(a,b)} [respuesta ${'ABCD'[i]}]`,opciones:['A','B','C','D'],resp:i,k:`c4c${a},${b},${P.join(';')}`,
    pista:`Desde el 0: ${Math.abs(a)} ${a>0?'a la derecha':'a la izquierda'} y luego ${Math.abs(b)} ${b>0?'hacia arriba':'hacia abajo'}. Ahí está el punto ${'ABCD'[i]}.`};});}
function c4N4(){const g=movQ([-6,6],GR4,'c4d');return ()=>U(g);}
const COORD=[
 {id:'coord-1',grupo:'geometria',titulo:'Coordenadas (1.er cuadrante)',icono:'(3, 5)',niveles:[
  {n:1,nombre:'¿Cuánto vale x? ¿Cuánto vale y?',recuerda:'Un punto se ubica con dos números: x dice cuánto avanzas a la derecha (→) y y dice cuánto subes (↑). Ejemplo: el punto (3, 5) está 3 a la derecha y 5 arriba.',gen:c1N1()},
  {n:2,nombre:'Leer las coordenadas de un punto',recuerda:'Se escribe primero x y después y, entre paréntesis y separados por coma: (x, y). No es lo mismo (2, 5) que (5, 2).',gen:c1N2()},
  {n:3,nombre:'Ubicar un punto',recuerda:'Para ubicar (a, b): empieza en el 0, avanza a lugares a la derecha y sube b lugares. ¡Cuidado con el orden!',gen:c1N3()},
  {n:4,nombre:'Distancias y vértices',recuerda:'Si dos puntos tienen la misma y, están en una fila: la distancia es la resta de sus x. Si tienen la misma x, están en una columna: resta sus y. En un rectángulo, los lados opuestos comparten x o y.',gen:c1N4()},
  {n:5,nombre:'Moverse en el plano',recuerda:'Derecha: x aumenta. Izquierda: x disminuye. Arriba: y aumenta. Abajo: y disminuye. Ejemplo: de (2, 3), 4 a la derecha y 1 arriba llegas a (6, 4).',gen:c1N5()}]},
 {id:'coord-4',grupo:'geometria',titulo:'Coordenadas (cuatro cuadrantes)',icono:'(−2, 4)',niveles:[
  {n:1,nombre:'Los cuadrantes',recuerda:'Los ejes dividen el plano en 4 cuadrantes. I: x+ y+ (derecha-arriba). II: x− y+ (izquierda-arriba). III: x− y− (izquierda-abajo). IV: x+ y− (derecha-abajo).',gen:c4N1()},
  {n:2,nombre:'Leer coordenadas con signo',recuerda:'x negativo es a la izquierda del 0; y negativo es abajo del 0. Siempre se escribe (x, y). Ejemplo: 3 a la izquierda y 2 abajo es (−3, −2).',gen:c4N2()},
  {n:3,nombre:'Ubicar puntos con signo',recuerda:'Desde el 0, el signo de x te dice izquierda o derecha, y el signo de y te dice abajo o arriba. Cambiar un signo cambia de cuadrante.',gen:c4N3()},
  {n:4,nombre:'Moverse cruzando los ejes',recuerda:'Derecha suma a x, izquierda resta. Arriba suma a y, abajo resta. Puedes cruzar el cero y cambiar de cuadrante. Ejemplo: de (−2, 1), 3 a la derecha y 4 abajo llegas a (1, −3).',gen:c4N4()}]}];

// ---------- FUNCIONES (entrada → regla → salida) ----------
const FR={
  '+':a=>({t:'+ '+a,p:'suma '+a,f:x=>x+a}),
  '−':a=>({t:'− '+a,p:'resta '+a,f:x=>x-a}),
  '×':a=>({t:'× '+a,p:'multiplica por '+a,f:x=>x*a}),
  '÷':a=>({t:'÷ '+a,p:'divide entre '+a,f:x=>x/a}),
  '×+':(a,c)=>({t:'× '+a+' + '+c,p:'multiplica por '+a+' y luego suma '+c,f:x=>x*a+c}),
  '×−':(a,c)=>({t:'× '+a+' − '+c,p:'multiplica por '+a+' y luego resta '+c,f:x=>x*a-c})};
function reglaR(tipos){const t=pick(tipos),a=t==='+'||t==='−'||t==='×'?R(2,9):(t==='÷'?R(2,5):R(2,5)),c=t==='×−'?R(1,2*a-1):R(1,9);
  const r=FR[t](a,c);r.k=t+a+','+c;r.tipo=t;r.a=a;r.c=c;return r;}
function xsPara(r,n){
  if(r.tipo==='÷')return shuffle([1,2,3,4,5,6,7,8,9,10]).slice(0,n).sort((u,v)=>u-v).map(v=>v*r.a);
  const d=R(1,3),s=r.tipo==='−'?R(r.a,r.a+4):(r.tipo==='×−'?R(2,5):R(1,6));
  return Array.from({length:n},(_,i)=>s+i*d);}
const visTab=(xs,ys,regla,qx,qy)=>({tipo:'tabla',regla,ent:xs.map((v,i)=>qx.includes(i)?'?':v),sal:ys.map((v,i)=>qy.includes(i)?'?':v)});
function fN1(){return ()=>U(()=>{const r=reglaR(['+','−','×','÷']),xs=xsPara(r,3),ys=xs.map(r.f);
  return {vis:visTab(xs,ys,r.t,[],[2]),q:`Regla: ${r.t} (${r.p}). ¿Qué número va en lugar del ?`,det:`regla ${r.t}, entrada ${xs[2]}`,resp:ys[2],k:'f1'+r.k+xs,
    pista:`Aplica la regla a la entrada ${xs[2]}: ${r.p}. ${xs[2]} ${r.t} = ${ys[2]}.`};});}
function fN2(){return ()=>U(()=>{const r=reglaR(['×+','×−']),xs=xsPara(r,3),ys=xs.map(r.f);
  return {vis:visTab(xs,ys,r.t,[],[2]),q:`Regla: ${r.t} (${r.p}). ¿Qué número va en lugar del ?`,det:`regla ${r.t}, entrada ${xs[2]}`,resp:ys[2],k:'f2'+r.k+xs,
    pista:`Son dos pasos, en orden. Con ${xs[2]}: ${xs[2]} × ${r.a} = ${xs[2]*r.a}; luego ${r.tipo==='×+'?'+':'−'} ${r.c} = ${ys[2]}.`};});}
function fN3(){return ()=>U(()=>{const T=['+','−','×','×+','×−'],r=reglaR(T),xs=xsPara(r,4),ys=xs.map(r.f),cand=[];
  for(let g=0;g<80&&cand.length<3;g++){const o=reglaR(T);if(o.t!==r.t&&!cand.some(c=>c.t===o.t)&&!xs.every((x,i)=>o.f(x)===ys[i]))cand.push(o);}
  if(cand.length<3)return {bad:1,k:'n'+Math.random()};
  const o=shuffle([r,...cand]);
  return {vis:visTab(xs,ys,'?',[],[]),q:'¿Cuál es la regla de esta máquina?',det:`regla ${r.t} [${xs.map((x,i)=>x+'→'+ys[i]).join(', ')}]`,opciones:o.map(z=>z.t),resp:o.indexOf(r),k:'f3'+r.k+xs,
    pista:`Prueba con la primera pareja (${xs[0]} → ${ys[0]}) y luego comprueba con las demás: la regla debe funcionar en todas. Aquí es ${r.t}.`};});}
function fN4(){return ()=>U(()=>{const r=reglaR(['+','−','×','÷','×+','×−']),xs=xsPara(r,3),ys=xs.map(r.f);
  const dos=r.tipo==='×+'||r.tipo==='×−';
  return {vis:visTab(xs,ys,r.t,[2],[]),q:`Regla: ${r.t}. Salió ${ys[2]}. ¿Qué número entró (el ?)`,det:`regla ${r.t}, salida ${ys[2]}`,resp:xs[2],k:'f4'+r.k+xs,
    pista:dos?`Haz el camino al revés. Deshaz primero lo último: ${ys[2]} ${r.tipo==='×+'?'− '+r.c:'+ '+r.c} = ${ys[2]+(r.tipo==='×+'?-r.c:r.c)}. Luego deshaz la multiplicación: ${ys[2]+(r.tipo==='×+'?-r.c:r.c)} ÷ ${r.a} = ${xs[2]}.`
      :`Haz lo contrario de la regla: ${ys[2]} ${({'+':'−','−':'+','×':'÷','÷':'×'})[r.tipo]} ${r.a} = ${xs[2]}.`};});}
const OBJ=[['cuaderno','cuadernos'],['lápiz','lápices'],['paleta','paletas'],['boleto','boletos'],['bolsa de fruta','bolsas de fruta'],['libro','libros']];
function fN5(){return ()=>U(()=>{const j=R(0,3),xs=[1,2,3];
  if(j===0){const [s,p]=pick(OBJ),k=R(3,15),n=R(6,12);
    return {vis:visTab(xs,xs.map(x=>x*k),'?',[],[]),q:`Cada ${s} cuesta $${k}. ¿Cuánto cuestan ${n} ${p}?`,det:`${s} $${k}, ${n}`,resp:k*n,k:'f5a'+k+','+n,
      pista:`Cada ${s} cuesta $${k}, así que la regla es × ${k}. Para ${n}: ${n} × ${k} = ${k*n}.`};}
  if(j===1){const b=R(5,20),k=R(2,9),n=R(5,12);
    return {vis:visTab(xs,xs.map(x=>x*k+b),'?',[],[]),q:`Un taxi cobra $${b} de bajada y $${k} por cada kilómetro. ¿Cuánto se paga por ${n} km?`,det:`taxi bajada ${b}, km ${k}, ${n}`,resp:k*n+b,k:'f5b'+b+','+k+','+n,
      pista:`La regla es × ${k} + ${b}: se multiplican los km por ${k} y se suma la bajada. ${n} × ${k} = ${n*k}; ${n*k} + ${b} = ${k*n+b}.`};}
  if(j===2){const k=R(3,9),n=R(5,11);
    return {vis:visTab(xs,xs.map(x=>x*k),'?',[],[]),q:`Cada mesa tiene ${k} sillas. En el salón hay ${k*n} sillas en mesas. ¿Cuántas mesas hay?`,det:`${k} sillas por mesa, ${k*n} sillas`,resp:n,k:'f5c'+k+','+n,
      pista:`La regla es mesas × ${k} = sillas. Al revés: ${k*n} ÷ ${k} = ${n}.`};}
  const [s,p]=pick(OBJ),k=R(4,12),n=R(5,10);
  return {vis:visTab(xs,xs.map(x=>x*k),'?',[],[]),q:`Cada ${s} cuesta $${k}. Con $${k*n}, ¿cuántos ${p} puedes comprar?`,det:`${s} $${k}, tengo ${k*n}`,resp:n,k:'f5d'+k+','+n,
    pista:`Cada ${s} cuesta $${k}. Divide el dinero entre el precio: ${k*n} ÷ ${k} = ${n}.`};});}
const FUN=[{id:'func-1',grupo:'funciones',titulo:'Funciones: máquina de reglas',icono:'x → y',niveles:[
  {n:1,nombre:'Aplica la regla',recuerda:'Una función es una máquina: entra un número, la regla lo transforma y sale otro. Si la regla es × 3, entra 4 y sale 12.',gen:fN1()},
  {n:2,nombre:'Reglas de dos pasos',recuerda:'Algunas reglas tienen dos pasos y se hacen en orden. Regla × 2 + 1: entra 5 → 5 × 2 = 10 → 10 + 1 = 11.',gen:fN2()},
  {n:3,nombre:'Descubre la regla',recuerda:'Para descubrir la regla, mira cómo cambia el número de la primera pareja y comprueba con las demás. La regla correcta funciona en todas las parejas.',gen:fN3()},
  {n:4,nombre:'¿Qué número entró?',recuerda:'Para encontrar la entrada, haz el camino al revés: lo contrario de sumar es restar y lo contrario de multiplicar es dividir. Si × 3 + 2 dio 17: 17 − 2 = 15 y 15 ÷ 3 = 5.',gen:fN4()},
  {n:5,nombre:'Funciones en problemas',recuerda:'En un problema, busca la regla en la tabla (por ejemplo, × precio, o × tarifa + cuota fija) y aplícala. Si te dan el resultado, regresa por el camino contrario.',gen:fN5()}]}];

OPS.forEach(m=>m.grupo='operaciones');
window.MODULOS=[...TABLAS,...OPS,...DECS,...MEDS,...POLI,...COORD,...FUN];
window.R=R;window.fmtNum=fmt;
})();
