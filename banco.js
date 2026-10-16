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
function unicas(n,mk){const vistos=new Set(),out=[];let g=0;while(out.length<n&&g++<4000){const p=mk();const k=p.q;if(vistos.has(k))continue;vistos.add(k);out.push(p);}return out;}

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
OPS.forEach(m=>m.grupo='operaciones');
window.MODULOS=[...TABLAS,...OPS,...DECS];
window.R=R;window.fmtNum=fmt;
})();
