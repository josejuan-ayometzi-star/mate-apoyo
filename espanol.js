// ============================================================
// Contenido de ESPAÑOL (Programa P.E.P.E., 5.º grado)
// Pasado de la App P.E.P.E. v1. Para agregar o cambiar ejercicios, edita aquí.
//   ORTOGRAFIA: una entrada por letra (id, letra, nombre, reglas, dictado, niveles 1-3)
//   PEPE: una entrada por folio (folio, ronda, tema, recordatorio, niveles 1-3)
// Tipos de ejercicio: choice, fill, classify, correct, transform, write, checklist
// ============================================================
(function(){
const ORTOGRAFIA = [

  /* ---------- 1. LETRA B ---------- */
  {
    id: "b", letra: "B", nombre: "La letra B", folio: 1,
    reglas: [
      "Se escribe B después de la letra M. (hombre, cambio)",
      "Se escribe B en las terminaciones -aba, -abas. (jugaba, cantabas)",
      "Se escribe B en los verbos terminados en -bir. (escribir, recibir)",
      "Se escribe B antes de otra consonante: bl, br. (blanco, brazo)",
      "Se escribe B en las sílabas bu-, bur-, bus-. (buzo, buscar)"
    ],
    dictado: ["hombre","cambio","jugaba","escribir","blanco","brazo","buscar","tambor","recibir","hablar","burbuja","sombra"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["ombre","hombre"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["cambio","canvio"], correcta:0 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Después de M","Terminación -aba"],
          fichas:[{w:"hombre",caja:0},{w:"jugaba",caja:1},{w:"cambio",caja:0},{w:"cantaba",caja:1}] },
        { tipo:"classify", instr:"¿Con bl/br o con bu?",
          cajas:["Con bl o br","Sílaba bu-"],
          fichas:[{w:"blanco",caja:0},{w:"buscar",caja:1},{w:"brazo",caja:0},{w:"burbuja",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"cam__io", opciones:["b","v"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"hom__re", opciones:["b","v"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"escri__ir", opciones:["b","v"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"El ombre jugaba en el parque.", errores:["ombre"], correcciones:["hombre"] },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Voy a escrivir una carta.", errores:["escrivir"], correcciones:["escribir"] }
      ],
      3: [
        { tipo:"transform", instr:"Escribe el verbo en pasado (terminación -aba)", origen:"jugar", destino:"jugaba", pista:"Yo ______ todos los días" },
        { tipo:"transform", instr:"Escribe el verbo en pasado (terminación -aba)", origen:"cantar", destino:"cantaba", pista:"Ella ______ muy bien" },
        { tipo:"write", instr:"Escribe una palabra que empiece con BU-", validar:"bu", ejemplos:["buzo","buscar","burro"] },
        { tipo:"write", instr:"Escribe una palabra que lleve MB", validar:"mb", ejemplos:["hombre","cambio","tambor"] }
      ]
    }
  },

  /* ---------- 2. LETRA V ---------- */
  {
    id: "v", letra: "V", nombre: "La letra V", folio: 2,
    reglas: [
      "Se escribe V después de la letra N. (invierno, envío)",
      "Se escribe V en adjetivos terminados en -avo, -ivo, -eva. (octavo, activo, nuevo)",
      "Se escribe V en las formas del verbo IR. (voy, vas, vamos)",
      "Se escribe V después de B y D. (obvio, adverbio)"
    ],
    dictado: ["invierno","envío","nuevo","octavo","voy","activo","adverbio","convento","creativa","advertir","villano","convivir"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["inbierno","invierno"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["nuevo","nuebo"], correcta:0 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Después de N","Adjetivo -avo/-ivo"],
          fichas:[{w:"invierno",caja:0},{w:"octavo",caja:1},{w:"envío",caja:0},{w:"activo",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"in__ierno", opciones:["b","v"], correcta:1 },
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"nue__o", opciones:["b","v"], correcta:1 },
        { tipo:"fill", pregunta:"Completa con B o V", palabra:"ad__erbio", opciones:["b","v"], correcta:1 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"En inbierno hace mucho frío.", errores:["inbierno"], correcciones:["invierno"] }
      ],
      3: [
        { tipo:"transform", instr:"Conjuga el verbo IR", origen:"ir (yo)", destino:"voy", pista:"Yo ______ a la escuela" },
        { tipo:"transform", instr:"Conjuga el verbo IR", origen:"ir (nosotros)", destino:"vamos", pista:"Nosotros ______ al parque" },
        { tipo:"write", instr:"Escribe una palabra con NV", validar:"nv", ejemplos:["invierno","envío","convento"] },
        { tipo:"write", instr:"Escribe un adjetivo terminado en -IVO", validar:"ivo", ejemplos:["activo","creativo","positivo"] }
      ]
    }
  },

  /* ---------- 3. LETRA C ---------- */
  {
    id: "c", letra: "C", nombre: "La letra C", folio: 3,
    reglas: [
      "Se escribe C en los diminutivos -cito, -cita. (cochecito, florecita)",
      "Se escribe C en las terminaciones -ción. (canción, dirección)",
      "Se escribe C en las sílabas ce, ci. (cielo, cena)",
      "En plural, la Z cambia a C. (luz → luces, pez → peces)"
    ],
    dictado: ["cochecito","canción","cielo","luces","florecita","dirección","cena","peces","lápices","educación","cine","solecito"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["canción","cansión"], correcta:0 },
        { tipo:"choice", pregunta:"El plural de LUZ es...", palabra:"luz", opciones:["luzes","luces"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Diminutivo -cito","Terminación -ción"],
          fichas:[{w:"cochecito",caja:0},{w:"canción",caja:1},{w:"florecita",caja:0},{w:"dirección",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con C o S", palabra:"can__ión", opciones:["c","s"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con C o S", palabra:"lu__es", opciones:["c","s"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Encendí las luzes de la casa.", errores:["luzes"], correcciones:["luces"] }
      ],
      3: [
        { tipo:"transform", instr:"Escribe el plural", origen:"pez", destino:"peces", pista:"La Z cambia a C" },
        { tipo:"transform", instr:"Escribe el plural", origen:"lápiz", destino:"lápices", pista:"La Z cambia a C" },
        { tipo:"transform", instr:"Forma el diminutivo con -CITO/-CITA", origen:"flor", destino:"florecita", pista:"flor → flore____" },
        { tipo:"write", instr:"Escribe una palabra terminada en -CIÓN", validar:"ción", ejemplos:["canción","educación","atención"] }
      ]
    }
  },

  /* ---------- 4. LETRA S ---------- */
  {
    id: "s", letra: "S", nombre: "La letra S", folio: 4,
    reglas: [
      "Se escribe S en los adjetivos -oso, -osa. (cariñoso, hermosa)",
      "Se escribe S en las terminaciones -sión. (confusión, expresión)",
      "Se escribe S en el superlativo -ísimo. (grandísimo)",
      "Se escribe S en gentilicios -ense, -és. (francés, costarricense)"
    ],
    dictado: ["cariñoso","hermosa","confusión","expresión","grandísimo","francés","famoso","televisión","buenísima","inglés","miedoso","profesión"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["hermoso","hermozo"], correcta:0 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["confución","confusión"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Adjetivo -oso/-osa","Terminación -sión"],
          fichas:[{w:"cariñoso",caja:0},{w:"confusión",caja:1},{w:"hermosa",caja:0},{w:"expresión",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con S o C", palabra:"expre__ión", opciones:["s","c"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con S o Z", palabra:"hermo__o", opciones:["s","z"], correcta:0 },
        { tipo:"correct", instr:"Encuentra las palabras mal escritas", frase:"El niño cariñozo vivía en una caza hermoza.", errores:["cariñozo","hermoza"], correcciones:["cariñoso","hermosa"] }
      ],
      3: [
        { tipo:"transform", instr:"Forma el adjetivo con -OSO", origen:"cariño", destino:"cariñoso", pista:"cariño → cariñ____" },
        { tipo:"transform", instr:"Forma el adjetivo con -OSO", origen:"miedo", destino:"miedoso", pista:"miedo → mied____" },
        { tipo:"write", instr:"Escribe un adjetivo terminado en -OSO u -OSA", validar:"os", ejemplos:["famoso","chistosa","ruidoso"] },
        { tipo:"write", instr:"Escribe una palabra terminada en -SIÓN", validar:"sión", ejemplos:["televisión","profesión","confusión"] }
      ]
    }
  },

  /* ---------- 5. LETRA Z ---------- */
  {
    id: "z", letra: "Z", nombre: "La letra Z", folio: 5,
    reglas: [
      "Se escribe Z en las terminaciones -azo, -aza (golpe). (portazo, manaza)",
      "Se escribe Z en las terminaciones -anza, -eza. (esperanza, belleza)",
      "Se escribe Z en las terminaciones -izo, -iza. (rojizo)",
      "Se escribe Z en las sílabas za, zo, zu. (zapato, zorro)"
    ],
    dictado: ["portazo","esperanza","rojizo","zapato","belleza","manaza","zorro","confianza","codazo","zumo","pobreza","azúcar"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["belleza","bellesa"], correcta:0 },
        { tipo:"choice", pregunta:"Golpe con la puerta:", palabra:"?", opciones:["portaso","portazo"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Terminación -azo","Terminación -eza/-anza"],
          fichas:[{w:"portazo",caja:0},{w:"belleza",caja:1},{w:"codazo",caja:0},{w:"esperanza",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con Z o S", palabra:"belle__a", opciones:["z","s"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con Z o S", palabra:"esperan__a", opciones:["z","s"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Tenía mucha esperansa de ganar.", errores:["esperansa"], correcciones:["esperanza"] }
      ],
      3: [
        { tipo:"transform", instr:"Forma la palabra de golpe con -AZO", origen:"puerta", destino:"portazo", pista:"un golpe con la puerta" },
        { tipo:"transform", instr:"Forma la palabra de golpe con -AZO", origen:"codo", destino:"codazo", pista:"un golpe con el codo" },
        { tipo:"write", instr:"Escribe una palabra terminada en -EZA", validar:"eza", ejemplos:["belleza","pobreza","tristeza"] },
        { tipo:"write", instr:"Escribe una palabra que empiece con ZA, ZO o ZU", validar:"z", ejemplos:["zapato","zorro","zumo"] }
      ]
    }
  },

  /* ---------- 6. LETRA G ---------- */
  {
    id: "g", letra: "G", nombre: "La letra G", folio: 6,
    reglas: [
      "Se escribe G en las palabras con GEN. (gente, origen, imagen)",
      "Se escribe G en las terminaciones -gente, -gencia. (urgente, urgencia)",
      "Se escribe G en las terminaciones -gio, -gión. (religión, prestigio)",
      "Se escribe G en las palabras terminadas en -logía. (biología)"
    ],
    dictado: ["gente","origen","urgente","urgencia","religión","biología","imagen","inteligente","prestigio","tecnología","margen","exigente"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["gente","jente"], correcta:0 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["urjente","urgente"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Con GEN","Terminación -gente/-gencia"],
          fichas:[{w:"gente",caja:0},{w:"urgente",caja:1},{w:"origen",caja:0},{w:"urgencia",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con G o J", palabra:"__ente", opciones:["g","j"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con G o J", palabra:"ori__en", opciones:["g","j"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con G o J", palabra:"ur__encia", opciones:["g","j"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Mucha jente vino a la fiesta.", errores:["jente"], correcciones:["gente"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra que contenga GEN", validar:"gen", ejemplos:["gente","origen","imagen"] },
        { tipo:"write", instr:"Escribe una palabra terminada en -LOGÍA", validar:"logía", ejemplos:["biología","tecnología","geología"] },
        { tipo:"transform", instr:"Forma el sustantivo con -GENCIA", origen:"urgente", destino:"urgencia", pista:"urgente → urg______" }
      ]
    }
  },

  /* ---------- 7. LETRA J ---------- */
  {
    id: "j", letra: "J", nombre: "La letra J", folio: 7,
    reglas: [
      "Se escribe J en las terminaciones -aje, -eje. (garaje, viaje)",
      "Se escribe J en las terminaciones -jero, -jería. (mensajero, relojería)",
      "Se escribe J en los verbos terminados en -jear. (cojear, hojear)",
      "Se escribe J en las palabras que empiezan con EJE-. (ejemplo, ejercicio)"
    ],
    dictado: ["garaje","viaje","mensajero","cojear","ejemplo","relojería","paisaje","extranjero","hojear","ejercicio","coraje","cajero"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["garage","garaje"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["mensajero","mensagero"], correcta:0 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Terminación -aje","Empieza con EJE-"],
          fichas:[{w:"garaje",caja:0},{w:"ejemplo",caja:1},{w:"viaje",caja:0},{w:"ejercicio",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con J o G", palabra:"gara__e", opciones:["j","g"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con J o G", palabra:"mensa__ero", opciones:["j","g"], correcta:0 },
        { tipo:"correct", instr:"Encuentra las palabras mal escritas", frase:"El mensagero dejó el paquete en el garage.", errores:["mensagero","garage"], correcciones:["mensajero","garaje"] }
      ],
      3: [
        { tipo:"transform", instr:"Forma la palabra con -AJE", origen:"viajar", destino:"viaje", pista:"viajar → vi____" },
        { tipo:"transform", instr:"Forma la palabra con -AJE", origen:"pasar", destino:"pasaje", pista:"pasar → pas____" },
        { tipo:"write", instr:"Escribe una palabra terminada en -AJE", validar:"aje", ejemplos:["garaje","paisaje","coraje"] },
        { tipo:"write", instr:"Escribe una palabra que empiece con EJE-", validar:"eje", ejemplos:["ejemplo","ejercicio","ejército"] }
      ]
    }
  },

  /* ---------- 8. LETRA H ---------- */
  {
    id: "h", letra: "H", nombre: "La letra H (muda)", folio: 8,
    reglas: [
      "Se escribe H en las palabras que empiezan con HIE-, HUE-. (hielo, hueso)",
      "Se escribe H en HUM-, HOSP-, HERM-. (humo, hospital, hermano)",
      "Se escribe H en los verbos haber, hacer, hablar. (hay, hizo, habló)",
      "La H no suena, pero se escribe."
    ],
    dictado: ["hielo","hueso","humo","hospital","hizo","hablar","huevo","hermano","hay","húmedo","hierba","hecho"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["hueso","ueso"], correcta:0 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["ombre","hombre"], correcta:1 },
        { tipo:"classify", instr:"¿Lleva H o no lleva H?",
          cajas:["Lleva H","No lleva H"],
          fichas:[{w:"hielo",caja:0},{w:"árbol",caja:1},{w:"hueso",caja:0},{w:"escuela",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"¿Lleva H? Completa", palabra:"__ielo", opciones:["h","(nada)"], correcta:0 },
        { tipo:"fill", pregunta:"¿Lleva H? Completa", palabra:"__ospital", opciones:["h","(nada)"], correcta:0 },
        { tipo:"fill", pregunta:"¿Lleva H? Completa", palabra:"__árbol", opciones:["h","(nada)"], correcta:1 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"El ielo se derritió al sol.", errores:["ielo"], correcciones:["hielo"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra que empiece con HUE-", validar:"hue", ejemplos:["hueso","huevo","huella"] },
        { tipo:"write", instr:"Escribe una palabra que empiece con HIE-", validar:"hie", ejemplos:["hielo","hierba","hierro"] },
        { tipo:"transform", instr:"Conjuga el verbo HACER (él, pasado)", origen:"hacer", destino:"hizo", pista:"Él ______ la tarea" }
      ]
    }
  },

  /* ---------- 9. DÍGRAFO LL ---------- */
  {
    id: "ll", letra: "LL", nombre: "El dígrafo LL", folio: 9,
    reglas: [
      "Se escribe LL en los diminutivos -illo, -illa. (chiquillo, mesilla)",
      "Se escribe LL en las terminaciones -alle, -ello. (calle, cuello)",
      "Se escribe LL en muchos verbos -llar. (callar, brillar)",
      "Palabras frecuentes: lluvia, llave, llegar."
    ],
    dictado: ["chiquillo","calle","brillar","lluvia","mesilla","cuello","callar","llave","ladrillo","valle","llegar","gallina"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["mesilla","mesiya"], correcta:0 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["yuvia","lluvia"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su regla",
          cajas:["Diminutivo -illo/-illa","Terminación -alle/-ello"],
          fichas:[{w:"chiquillo",caja:0},{w:"calle",caja:1},{w:"mesilla",caja:0},{w:"cuello",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con LL o Y", palabra:"mesi__a", opciones:["ll","y"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con LL o Y", palabra:"__uvia", opciones:["ll","y"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"La yuvia mojó toda la calle.", errores:["yuvia"], correcciones:["lluvia"] }
      ],
      3: [
        { tipo:"transform", instr:"Forma el diminutivo con -ILLO/-ILLA", origen:"mesa", destino:"mesilla", pista:"mesa → mes____" },
        { tipo:"transform", instr:"Forma el diminutivo con -ILLO/-ILLA", origen:"chico", destino:"chiquillo", pista:"chico → chiqu____" },
        { tipo:"write", instr:"Escribe una palabra terminada en -ILLO o -ILLA", validar:"ill", ejemplos:["ladrillo","bombilla","panecillo"] }
      ]
    }
  },

  /* ---------- 10. LETRA Y ---------- */
  {
    id: "y", letra: "Y", nombre: "La letra Y", folio: 10,
    reglas: [
      "Se escribe Y en los plurales de palabras en -Y. (rey → reyes)",
      "Se escribe Y después de AY, EY, OY, UY. (hay, rey, hoy, muy)",
      "La conjunción Y une palabras. (pan y leche)",
      "Se escribe Y en verbos como leyó, cayó, oyó."
    ],
    dictado: ["reyes","hoy","leyó","leyes","muy","cayó","rey","bueyes","oyó","voy","construyó","ley"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"El plural de REY es...", palabra:"rey", opciones:["reyes","reies"], correcta:0 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["callo (del verbo caer)","cayó"], correcta:1 },
        { tipo:"classify", instr:"Arrastra cada palabra a su grupo",
          cajas:["Plural en -YES","Con AY/EY/OY"],
          fichas:[{w:"reyes",caja:0},{w:"hoy",caja:1},{w:"leyes",caja:0},{w:"muy",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con Y o LL", palabra:"re__es", opciones:["y","ll"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con Y o LL", palabra:"ca__ó (del verbo caer)", opciones:["y","ll"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Los reies gobernaban el país.", errores:["reies"], correcciones:["reyes"] }
      ],
      3: [
        { tipo:"transform", instr:"Escribe el plural", origen:"ley", destino:"leyes", pista:"ley → le____" },
        { tipo:"transform", instr:"Escribe el plural", origen:"buey", destino:"bueyes", pista:"buey → bue____" },
        { tipo:"write", instr:"Escribe una palabra que termine en -OY o -UY", validar:"y", ejemplos:["hoy","muy","voy"] }
      ]
    }
  },

  /* ---------- 11. R y RR ---------- */
  {
    id: "rr", letra: "R·RR", nombre: "La R y la RR", folio: 11,
    reglas: [
      "Sonido FUERTE con una R al inicio de palabra. (ratón, rosa)",
      "Sonido FUERTE con RR entre dos vocales. (perro, carro)",
      "Sonido SUAVE con una R entre vocales. (cara, pera)",
      "Sonido FUERTE con una R después de N, L, S. (enredo, alrededor)"
    ],
    dictado: ["ratón","rosa","perro","carro","cara","pera","río","tierra","torre","toro","enredo","burro"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"El animal que ladra es un...", palabra:"?", opciones:["pero","perro"], correcta:1 },
        { tipo:"choice", pregunta:"El vehículo se llama...", palabra:"?", opciones:["carro","caro"], correcta:0 },
        { tipo:"classify", instr:"¿Sonido fuerte o suave?",
          cajas:["Fuerte (RR)","Suave (r)"],
          fichas:[{w:"perro",caja:0},{w:"cara",caja:1},{w:"carro",caja:0},{w:"pera",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con R o RR", palabra:"pe__o (el animal)", opciones:["rr","r"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con R o RR", palabra:"ca__a (el rostro)", opciones:["rr","r"], correcta:1 },
        { tipo:"fill", pregunta:"Completa con R o RR", palabra:"to__e (edificio alto)", opciones:["rr","r"], correcta:0 },
        { tipo:"correct", instr:"Encuentra el error de significado", frase:"Mi pero come croquetas.", errores:["pero"], correcciones:["perro"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra que empiece con R (sonido fuerte)", validar:"r", ejemplos:["ratón","rosa","río"] },
        { tipo:"write", instr:"Escribe una palabra con RR", validar:"rr", ejemplos:["perro","carro","tierra"] },
        { tipo:"choice", pregunta:"¿Cuál cambia de significado con RR?", palabra:"caro / carro", opciones:["Sí cambia","No cambia"], correcta:0 }
      ]
    }
  },

  /* ---------- 12. M y N ---------- */
  {
    id: "mn", letra: "M·N", nombre: "La M y la N", folio: 12,
    reglas: [
      "Se escribe M antes de P y B. (campo, hombre)",
      "Se escribe N antes de V. (invierno, envío)",
      "Se escribe M antes de N en algunas palabras. (columna, alumno)",
      "NUNCA se escribe N antes de P o B."
    ],
    dictado: ["campo","campana","hombre","tambor","envío","invierno","cambio","lámpara","sombra","convivir","columna","alumno"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["canpo","campo"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["invierno","imvierno"], correcta:0 },
        { tipo:"classify", instr:"¿Con M o con N?",
          cajas:["M antes de P/B","N antes de V"],
          fichas:[{w:"campo",caja:0},{w:"invierno",caja:1},{w:"hombre",caja:0},{w:"envío",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con M o N", palabra:"ca__po", opciones:["m","n"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con M o N", palabra:"ho__bre", opciones:["m","n"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con M o N", palabra:"i__vierno", opciones:["m","n"], correcta:1 },
        { tipo:"correct", instr:"Encuentra las palabras mal escritas", frase:"En inbierno el canpo está frío.", errores:["inbierno","canpo"], correcciones:["invierno","campo"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra con MP", validar:"mp", ejemplos:["campo","lámpara","limpio"] },
        { tipo:"write", instr:"Escribe una palabra con MB", validar:"mb", ejemplos:["hombre","tambor","sombra"] },
        { tipo:"write", instr:"Escribe una palabra con NV", validar:"nv", ejemplos:["invierno","envío","convivir"] }
      ]
    }
  },

  /* ---------- 13. LETRA X ---------- */
  {
    id: "x", letra: "X", nombre: "La letra X", folio: 13,
    reglas: [
      "Se escribe X en el prefijo EX-. (examen, éxito)",
      "Se escribe X en el prefijo EXTRA-. (extraño, extraordinario)",
      "Se escribe X en la terminación -XIÓN. (conexión, reflexión)",
      "Palabras de origen indígena: México, Xochimilco."
    ],
    dictado: ["examen","éxito","extraño","conexión","exacto","extraordinario","reflexión","experto","México","explicar","taxi","extra"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["esamen","examen"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["conexión","conección"], correcta:0 },
        { tipo:"classify", instr:"Arrastra cada palabra a su prefijo",
          cajas:["Prefijo EX-","Prefijo EXTRA-"],
          fichas:[{w:"examen",caja:0},{w:"extraño",caja:1},{w:"éxito",caja:0},{w:"extraordinario",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con X o S", palabra:"e__amen", opciones:["x","s"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con X o CC", palabra:"cone__ión", opciones:["x","cc"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Mañana tengo el esamen de español.", errores:["esamen"], correcciones:["examen"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra que empiece con EX-", validar:"ex", ejemplos:["examen","éxito","exacto"] },
        { tipo:"write", instr:"Escribe una palabra que empiece con EXTRA-", validar:"extra", ejemplos:["extraño","extraordinario","extra"] },
        { tipo:"write", instr:"Escribe una palabra terminada en -XIÓN", validar:"xión", ejemplos:["conexión","reflexión"] }
      ]
    }
  },

  /* ---------- 14. SONIDO /k/ : C, Q, K ---------- */
  {
    id: "cqk", letra: "C·Q·K", nombre: "El sonido /k/", folio: 14,
    reglas: [
      "Se escribe C ante A, O, U. (casa, coco, cuna)",
      "Se escribe QU ante E, I. La U no suena. (queso, quiso)",
      "Se escribe K en palabras de otros idiomas. (kilo, karate)",
      "Truco: ante A/O/U usa C; ante E/I usa QU."
    ],
    dictado: ["casa","coco","queso","quince","kilo","cuna","esquina","karate","comida","paquete","kiwi","pequeño"],
    niveles: {
      1: [
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["keso","queso"], correcta:1 },
        { tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["casa","kasa"], correcta:0 },
        { tipo:"classify", instr:"¿Con C, con QU o con K?",
          cajas:["Con C (ca/co/cu)","Con QU (que/qui)"],
          fichas:[{w:"casa",caja:0},{w:"queso",caja:1},{w:"coco",caja:0},{w:"quince",caja:1}] }
      ],
      2: [
        { tipo:"fill", pregunta:"Completa con C o QU", palabra:"__eso", opciones:["qu","c"], correcta:0 },
        { tipo:"fill", pregunta:"Completa con C o QU", palabra:"__asa", opciones:["qu","c"], correcta:1 },
        { tipo:"fill", pregunta:"Completa con C o QU", palabra:"__ince", opciones:["qu","c"], correcta:0 },
        { tipo:"correct", instr:"Encuentra la palabra mal escrita", frase:"Compré keso en la tienda.", errores:["keso"], correcciones:["queso"] }
      ],
      3: [
        { tipo:"write", instr:"Escribe una palabra con QUE o QUI", validar:"qu", ejemplos:["queso","quince","esquina"] },
        { tipo:"write", instr:"Escribe una palabra con CA, CO o CU", validar:"c", ejemplos:["casa","coco","cuna"] },
        { tipo:"choice", pregunta:"¿Por qué 'kilo' se escribe con K?", palabra:"kilo", opciones:["Porque viene de otro idioma","Porque va antes de I"], correcta:0 }
      ]
    }
  }
];


/* ============================================================
   BANCO DE CONTENIDO — PROGRAMA P.E.P.E. (Etapa 2)
   Expresión y Precisión del Español
   Prof. José Juan Ayometzi Ramírez
   ------------------------------------------------------------
   20 folios organizados en 4 rondas de 5 folios.
   Cada folio tiene 3 niveles: 1 Reconocer · 2 Aplicar · 3 Producir

   Alineación curricular en cada folio:
     pda  → Proceso de Desarrollo de Aprendizaje (SEP / NEM)
     ib   → Resultado de aprendizaje (Continuo de Lengua, PEP/IB)
   Estos campos alimentan la Hoja de Seguimiento para padres.
   ============================================================ */

const PEPE = [

/* ══════════════ RONDA 1 · Identificación y corrección guiada ══════════════ */

{
  folio:1, ronda:1, tema:"Acentuación", subtitulo:"Agudas, graves y esdrújulas",
  pda:"Revisa y corrige errores de ortografía, incluyendo el uso convencional de la acentuación.",
  ib:"Utilizan convenciones de escritura adecuadas según la lengua objeto de estudio (Fase 3).",
  recordatorio:"La sílaba tónica es la que suena más fuerte. Según dónde esté, la palabra es aguda, grave o esdrújula.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Qué tipo de palabra es?", palabra:"árbol", opciones:["Aguda","Grave","Esdrújula"], correcta:1},
      {tipo:"choice", pregunta:"¿Qué tipo de palabra es?", palabra:"canción", opciones:["Aguda","Grave","Esdrújula"], correcta:0},
      {tipo:"choice", pregunta:"¿Qué tipo de palabra es?", palabra:"médico", opciones:["Aguda","Grave","Esdrújula"], correcta:2},
      {tipo:"classify", instr:"Clasifica cada palabra", cajas:["Aguda","Grave"],
        fichas:[{w:"café",caja:0},{w:"lápiz",caja:1},{w:"reloj",caja:0},{w:"árbol",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"¿Lleva tilde?", palabra:"cancion", opciones:["Sí: canción","No: cancion"], correcta:0},
      {tipo:"choice", pregunta:"¿Lleva tilde?", palabra:"ventana", opciones:["Sí: ventána","No: ventana"], correcta:1},
      {tipo:"correct", instr:"Encuentra las palabras sin tilde", frase:"El camion llego al arbol grande.", errores:["camion","llego","arbol"], correcciones:["camión","llegó","árbol"]}
    ],
    3:[
      {tipo:"write", instr:"Escribe una palabra ESDRÚJULA (siempre lleva tilde)", validar:"", ejemplos:["médico","pájaro","brújula"]},
      {tipo:"write", instr:"Escribe una oración con una palabra con tilde", validar:"", ejemplos:["El camión llegó tarde."]}
    ]
  }
},

{
  folio:2, ronda:1, tema:"Puntuación", subtitulo:"La coma y el punto",
  pda:"Emplea comas, puntos y seguido, puntos y aparte y dos puntos para dar claridad y orden a las ideas.",
  ib:"Utilizan convenciones de escritura adecuadas (Fase 3).",
  recordatorio:"El punto cierra una idea completa. La coma separa elementos o hace una pausa breve.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Qué signo falta?", palabra:"Compré pan ___ leche y huevos", opciones:[", (coma)",". (punto)"], correcta:0},
      {tipo:"choice", pregunta:"¿Qué signo cierra la idea?", palabra:"Hoy es un día bonito ___", opciones:[", (coma)",". (punto)"], correcta:1},
      {tipo:"classify", instr:"¿Coma o punto?", cajas:["Necesita coma","Necesita punto"],
        fichas:[{w:"Traje manzanas peras y uvas",caja:0},{w:"El sol salió temprano",caja:1}]}
    ],
    2:[
      {tipo:"correct", instr:"Faltan comas. Toca las palabras que deben llevar una coma después", frase:"Compré cuadernos lápices colores y goma.", errores:["cuadernos","lápices"], correcciones:["cuadernos,","lápices,"], ayuda:"Toca las palabras después de las cuales va una coma", oracion:"Compré cuadernos, lápices, colores y goma."},
      {tipo:"choice", pregunta:"¿Cuál está bien puntuada?", palabra:"?", opciones:["Vi perros, gatos y aves.","Vi perros gatos y aves."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe una lista de 4 cosas usando comas", validar:",", ejemplos:["Llevé agua, pan, fruta y jugo."]},
      {tipo:"write", instr:"Escribe dos oraciones completas con punto", validar:".", ejemplos:["Hoy jugué fútbol. Después estudié."]}
    ]
  }
},

{
  folio:3, ronda:1, tema:"Adjetivos y adverbios", subtitulo:"Describir con precisión",
  pda:"Emplea adjetivos, frases adjetivas y adverbios para describir y precisar en sus textos.",
  ib:"Seleccionan vocabulario variado; usan oraciones de estructura variada (Fase 4).",
  recordatorio:"El adjetivo dice cómo es algo (alto, azul). El adverbio dice cómo, cuándo o dónde pasa algo (rápido, ayer, aquí).",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál es el ADJETIVO?", palabra:"El perro negro corre rápido", opciones:["negro","rápido"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál es el ADVERBIO?", palabra:"El perro negro corre rápido", opciones:["negro","rápido"], correcta:1},
      {tipo:"classify", instr:"¿Adjetivo o adverbio?", cajas:["Adjetivo","Adverbio"],
        fichas:[{w:"feliz",caja:0},{w:"ayer",caja:1},{w:"grande",caja:0},{w:"lentamente",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Elige el adjetivo más preciso para un día de lluvia", palabra:"El día estaba ___", opciones:["gris","bonito"], correcta:0},
      {tipo:"choice", pregunta:"Completa con un adverbio", palabra:"El niño habla ___", opciones:["suavemente","suave niño"], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe 3 adjetivos que describan a tu mejor amigo", validar:"", ejemplos:["divertido, leal, alegre"]},
      {tipo:"write", instr:"Escribe una oración con un adjetivo y un adverbio", validar:"", ejemplos:["El gato negro salta ágilmente."]}
    ]
  }
},

{
  folio:4, ronda:1, tema:"Nexos y conectores", subtitulo:"Unir ideas",
  pda:"Emplea conectores causales y lógicos (porque, pero, además, aunque) para enlazar ideas.",
  ib:"Usan oraciones de estructura y extensión variadas (Fase 4).",
  recordatorio:"Los conectores enlazan ideas: porque, pero, además, aunque, después.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Completa la oración", palabra:"Quería salir, ___ estaba lloviendo.", opciones:["pero","porque"], correcta:0},
      {tipo:"choice", pregunta:"Completa la oración", palabra:"Estudié mucho ___ quería aprobar.", opciones:["pero","porque"], correcta:1},
      {tipo:"classify", instr:"¿Qué expresa el conector?", cajas:["Causa (porque)","Contraste (pero)"],
        fichas:[{w:"porque",caja:0},{w:"pero",caja:1},{w:"ya que",caja:0},{w:"aunque",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Une las ideas: 'Hacía calor. Fuimos a nadar.'", palabra:"?", opciones:["Hacía calor, por eso fuimos a nadar.","Hacía calor fuimos a nadar."], correcta:0},
      {tipo:"choice", pregunta:"Ordena con conectores", palabra:"___ me levanté, ___ desayuné.", opciones:["Primero / después","Después / primero"], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe dos ideas unidas con PORQUE", validar:"porque", ejemplos:["Me gusta leer porque aprendo mucho."]},
      {tipo:"write", instr:"Escribe una oración con PERO", validar:"pero", ejemplos:["Quería jugar, pero tenía tarea."]}
    ]
  }
},

{
  folio:5, ronda:1, tema:"Párrafos y vocabulario", subtitulo:"Integración",
  pda:"Escribe textos con párrafos bien organizados; utiliza palabras nuevas y precisas.",
  ib:"Utilizan división en párrafos adecuada; seleccionan vocabulario variado (Fase 4).",
  recordatorio:"Un párrafo tiene una idea principal, oraciones de apoyo y un cierre. Usa palabras precisas.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál es la ORACIÓN PRINCIPAL?", palabra:"?", opciones:["El recreo es la mejor parte del día.","Juego con mis amigos."], correcta:0},
      {tipo:"classify", instr:"Ordena las partes del párrafo", cajas:["Idea principal","Cierre"],
        fichas:[{w:"El parque es mi lugar favorito",caja:0},{w:"Por eso voy cada tarde",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Mejora el vocabulario: 'El paisaje era bonito'", palabra:"bonito", opciones:["espectacular","bonito"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál evita la repetición?", palabra:"El niño hizo la tarea. El niño estudió.", opciones:["El niño hizo la tarea. Después estudió.","El niño hizo la tarea. El niño estudió."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe un párrafo de 3 oraciones sobre tu actividad favorita", validar:"", ejemplos:["Mi actividad favorita es dibujar. Me relaja y me divierte. Por eso dibujo cada día."]},
      {tipo:"write", instr:"Escribe una oración de cierre para un párrafo", validar:"", ejemplos:["Por eso es mi lugar preferido."]}
    ]
  }
},

/* ══════════════ RONDA 2 · Aplicación con apoyo parcial ══════════════ */

{
  folio:6, ronda:2, tema:"Acentuación", subtitulo:"La tilde diacrítica",
  pda:"Revisa y corrige el uso convencional de la acentuación, incluida la tilde diacrítica.",
  ib:"Usan estructuras estándar de forma competente (Fase 3–4).",
  recordatorio:"La tilde diacrítica diferencia palabras iguales: tú (persona) / tu (posesivo); sí / si; él / el; más / mas.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál es la persona?", palabra:"___ eres mi amigo", opciones:["Tú","Tu"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál indica posesión?", palabra:"___ libro es azul", opciones:["Tú","Tu"], correcta:1},
      {tipo:"classify", instr:"¿Lleva tilde o no?", cajas:["Con tilde","Sin tilde"],
        fichas:[{w:"tú (persona)",caja:0},{w:"tu (posesivo)",caja:1},{w:"él (persona)",caja:0},{w:"el (artículo)",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Completa correctamente", palabra:"Quiero ___ pan, ___ no tengo hambre.", opciones:["más / mas","mas / más"], correcta:0},
      {tipo:"correct", instr:"Faltan tildes diacríticas", frase:"El me dijo que si vienes.", errores:["El","si"], correcciones:["Él","sí"]}
    ],
    3:[
      {tipo:"write", instr:"Escribe una oración con TÚ (persona)", validar:"tú", ejemplos:["Tú eres muy inteligente."]},
      {tipo:"write", instr:"Escribe una oración con MÁS", validar:"más", ejemplos:["Quiero más tiempo para jugar."]}
    ]
  }
},

{
  folio:7, ronda:2, tema:"Puntuación", subtitulo:"Dos puntos y punto y coma",
  pda:"Emplea dos puntos, punto y coma y otros signos para organizar las ideas dentro de los párrafos.",
  ib:"Utilizan convenciones de escritura adecuadas (Fase 3–4).",
  recordatorio:"Los dos puntos ( : ) anuncian una lista. El punto y coma ( ; ) separa partes largas.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Qué signo anuncia una lista?", palabra:"Necesito tres cosas ___", opciones:[": (dos puntos)","; (punto y coma)"], correcta:0},
      {tipo:"choice", pregunta:"¿Qué signo separa ideas largas?", palabra:"Estudié mucho ___ sin embargo, fallé.", opciones:[": (dos puntos)","; (punto y coma)"], correcta:1}
    ],
    2:[
      {tipo:"choice", pregunta:"¿Cuál está bien escrita?", palabra:"?", opciones:["Compré: pan, leche y queso.","Compré, pan: leche y queso."], correcta:0},
      {tipo:"correct", instr:"Falta el signo de dos puntos. Toca la palabra que lo lleva después", frase:"Llevé todo lo necesario mochila, agua y mapa.", errores:["necesario"], correcciones:["necesario:"], ayuda:"Toca la palabra después de la cual van los dos puntos", oracion:"Llevé todo lo necesario: mochila, agua y mapa."}
    ],
    3:[
      {tipo:"write", instr:"Escribe una lista de 3 materias usando dos puntos", validar:":", ejemplos:["Mis materias favoritas son: español, ciencias y arte."]},
      {tipo:"write", instr:"Escribe una oración con punto y coma", validar:";", ejemplos:["Quería salir; sin embargo, llovía."]}
    ]
  }
},

{
  folio:8, ronda:2, tema:"Frases adjetivas y adverbiales", subtitulo:"Enriquecer",
  pda:"Emplea frases adjetivas y adverbiales para enriquecer y precisar sus descripciones.",
  ib:"Seleccionan vocabulario variado para crear el clima deseado (Fase 4).",
  recordatorio:"A veces describimos con frases: 'de gran tamaño' (adjetiva), 'con mucho cuidado' (adverbial).",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál es la FRASE ADJETIVA?", palabra:"El edificio de cristal brillaba", opciones:["de cristal","brillaba"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál es la FRASE ADVERBIAL?", palabra:"Resolvió el problema con mucha calma", opciones:["el problema","con mucha calma"], correcta:1}
    ],
    2:[
      {tipo:"choice", pregunta:"Transforma: 'un coche veloz'", palabra:"?", opciones:["un coche de gran velocidad","un coche muy coche"], correcta:0},
      {tipo:"choice", pregunta:"Mejora: 'El gato dormía'", palabra:"?", opciones:["El gato de pelo suave dormía tranquilamente.","El gato dormía dormido."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe una frase adjetiva para describir una casa", validar:"de", ejemplos:["una casa de dos pisos"]},
      {tipo:"write", instr:"Escribe una oración con una frase adverbial", validar:"con", ejemplos:["Caminamos con mucha prisa."]}
    ]
  }
},

{
  folio:9, ronda:2, tema:"Conectores de contraste y orden", subtitulo:"Organizar ideas",
  pda:"Emplea conectores de contraste y temporales para organizar oraciones y párrafos.",
  ib:"Usan oraciones de estructura y extensión variadas (Fase 4).",
  recordatorio:"Contraste: sin embargo, en cambio, aunque. Orden: primero, después, finalmente.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Conector de CONTRASTE", palabra:"Estudió mucho; ___, no aprobó.", opciones:["sin embargo","además"], correcta:0},
      {tipo:"classify", instr:"¿Contraste u orden?", cajas:["Contraste","Orden"],
        fichas:[{w:"sin embargo",caja:0},{w:"primero",caja:1},{w:"en cambio",caja:0},{w:"finalmente",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Ordena la receta", palabra:"___ calienta el agua, ___ agrega la pasta.", opciones:["Primero / después","Después / primero"], correcta:0},
      {tipo:"choice", pregunta:"Une con contraste", palabra:"El examen era difícil. Lo resolví bien.", opciones:["El examen era difícil; sin embargo, lo resolví bien.","El examen era difícil y lo resolví bien difícil."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe cómo llegas a la escuela usando PRIMERO, DESPUÉS, FINALMENTE", validar:"primero", ejemplos:["Primero me levanto. Después desayuno. Finalmente camino a la escuela."]},
      {tipo:"write", instr:"Escribe una oración con SIN EMBARGO", validar:"sin embargo", ejemplos:["Quería jugar; sin embargo, tenía tarea."]}
    ]
  }
},

{
  folio:10, ronda:2, tema:"Párrafos con estructura", subtitulo:"Principal, apoyo y cierre",
  pda:"Escribe párrafos con oración principal, apoyo y cierre; emplea vocabulario preciso.",
  ib:"Utilizan división en párrafos adecuada (Fase 4).",
  recordatorio:"Un buen párrafo tiene: oración principal (idea central), oraciones de apoyo (detalles) y cierre.",
  niveles:{
    1:[
      {tipo:"classify", instr:"Identifica las partes del párrafo", cajas:["Principal","Apoyo"],
        fichas:[{w:"El recreo es lo mejor del día",caja:0},{w:"Juego con mis amigos",caja:1}]},
      {tipo:"choice", pregunta:"¿Cuál es el CIERRE?", palabra:"?", opciones:["Por eso el recreo es mi momento favorito.","El recreo dura 30 minutos."], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"Escribe la oración principal para: '...Tiene juegos y árboles. Por eso lo visito.'", palabra:"?", opciones:["El parque cerca de mi casa es hermoso.","Los árboles son verdes."], correcta:0},
      {tipo:"choice", pregunta:"Evita la repetición", palabra:"La película fue buena. El final fue bueno.", opciones:["La película fue buena. El final fue emocionante.","La película fue buena. El final fue bueno."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe un párrafo completo (principal + apoyo + cierre) sobre tu estación favorita", validar:"", ejemplos:["Mi estación favorita es el verano. Puedo nadar y salir a jugar. Por eso la espero cada año."]}
    ]
  }
},

/* ══════════════ RONDA 3 · Producción autónoma con criterios ══════════════ */

{
  folio:11, ronda:3, tema:"Acentuación aplicada", subtitulo:"En textos propios",
  pda:"Aplica el uso convencional de la acentuación en sus propias producciones escritas.",
  ib:"Emplean procesos de edición y revisión de manera autónoma (Fase 4).",
  recordatorio:"Ya no solo identificas: aplicas la acentuación cuando tú escribes.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuántas tildes faltan?", palabra:"El sabado fui al jardin botanico", opciones:["3","1"], correcta:0},
      {tipo:"choice", pregunta:"Corrige", palabra:"pajaro", opciones:["pájaro","pajaró"], correcta:0}
    ],
    2:[
      {tipo:"correct", instr:"Corrige todas las tildes", frase:"El sabado mi mama compro un pajaro azul.", errores:["sabado","mama","compro","pajaro"], correcciones:["sábado","mamá","compró","pájaro"]}
    ],
    3:[
      {tipo:"write", instr:"Escribe 3 oraciones que incluyan palabras con tilde", validar:"", ejemplos:["El sábado fue mágico. Mi mamá cantó. El pájaro voló."]},
      {tipo:"write", instr:"Escribe un texto corto sobre un recuerdo feliz con 4 palabras acentuadas", validar:"", ejemplos:["Aquel día fue especial. Mi papá me llevó al café..."]}
    ]
  }
},

{
  folio:12, ronda:3, tema:"Puntuación en textos", subtitulo:"Textos completos",
  pda:"Emplea los signos de puntuación de manera convencional al producir textos propios.",
  ib:"Emplean procesos de edición y revisión de manera autónoma (Fase 4).",
  recordatorio:"Ahora puntúas textos completos: tú decides dónde van comas, puntos y signos.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Qué signo va aquí?", palabra:"___Qué día tan bonito___", opciones:["¡ !","¿ ?"], correcta:0},
      {tipo:"choice", pregunta:"¿Qué signo va aquí?", palabra:"___Dónde está mi mochila___", opciones:["¡ !","¿ ?"], correcta:1}
    ],
    2:[
      {tipo:"correct", instr:"Puntúa el texto: faltan una coma y un punto. Toca las palabras que llevan el signo después", frase:"la naturaleza nos da agua aire y árboles debemos cuidarlos", errores:["agua","árboles"], correcciones:["agua,","árboles. (y Debemos con mayúscula)"], ayuda:"Toca las palabras después de las cuales va el signo", oracion:"La naturaleza nos da agua, aire y árboles. Debemos cuidarlos."}
    ],
    3:[
      {tipo:"write", instr:"Escribe un diálogo corto usando guiones largos (—)", validar:"—", ejemplos:["—¿Vienes al parque? —preguntó Ana."]},
      {tipo:"write", instr:"Describe tu comida favorita usando coma, punto y dos puntos", validar:":", ejemplos:["Mi comida favorita tiene tres cosas: arroz, pollo y verduras."]}
    ]
  }
},

{
  folio:13, ronda:3, tema:"Adjetivos con intención", subtitulo:"Crear emociones",
  pda:"Usa adjetivos y adverbios de forma intencional para lograr efectos en sus textos.",
  ib:"Seleccionan vocabulario variado para crear el clima y sentimiento deseados (Fase 4).",
  recordatorio:"Un buen escritor elige palabras con intención, para crear una imagen o un sentimiento.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál suena TRISTE?", palabra:"El niño caminó ___", opciones:["lentamente por la calle gris","alegremente por la calle soleada"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál describe a alguien tímido?", palabra:"Habla ___", opciones:["suavemente","fuertemente"], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"Mejora el texto plano: 'Había una casa'", palabra:"?", opciones:["Había una casa antigua y misteriosa.","Había una casa casa."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Reescribe esta oración para que suene ALEGRE: 'El niño caminó por la calle'", validar:"", ejemplos:["El niño caminó alegremente por la calle soleada."]},
      {tipo:"write", instr:"Describe un lugar usando 3 adjetivos bien elegidos", validar:"", ejemplos:["El bosque era oscuro, húmedo y silencioso."]}
    ]
  }
},

{
  folio:14, ronda:3, tema:"Conectores para argumentar", subtitulo:"Defender opiniones",
  pda:"Emplea conectores causales y de conclusión para sustentar opiniones (porque, ya que, por eso).",
  ib:"Argumentan de modo persuasivo y justifican un punto de vista (Fase 4).",
  recordatorio:"Para defender una opinión usamos: porque, ya que, además, por eso, en conclusión.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Conector de CONCLUSIÓN", palabra:"___, reciclar ayuda al planeta.", opciones:["En conclusión","Primero"], correcta:0},
      {tipo:"choice", pregunta:"Conector de CAUSA", palabra:"Leer es importante ___ desarrolla la imaginación.", opciones:["porque","pero"], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"Completa la opinión", palabra:"El deporte es bueno ___ fortalece el cuerpo.", opciones:["ya que","aunque"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál es un argumento completo?", palabra:"?", opciones:["Hay que cuidar el agua porque es un recurso limitado.","Hay que cuidar el agua."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe tu opinión sobre la lectura usando PORQUE", validar:"porque", ejemplos:["Leer es genial porque me lleva a otros mundos."]},
      {tipo:"write", instr:"Escribe un párrafo de opinión con 2 razones y una conclusión", validar:"", ejemplos:["Me gusta el fútbol porque es divertido. Además, hago amigos. En conclusión, es mi deporte favorito."]}
    ]
  }
},

{
  folio:15, ronda:3, tema:"Párrafo autónomo", subtitulo:"Producir y revisar",
  pda:"Produce párrafos completos de manera autónoma y los revisa con criterios establecidos.",
  ib:"Emplean planificación, borradores, edición y revisión de manera independiente (Fase 4).",
  recordatorio:"Escribe tu párrafo y luego revísalo tú mismo con una lista de criterios.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Antes de escribir, ¿qué haces primero?", palabra:"?", opciones:["Planear la idea principal","Escribir sin pensar"], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"Al revisar tu párrafo, ¿qué revisas?", palabra:"?", opciones:["Acentos, puntuación y si se entiende","Solo la letra bonita"], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"PLANEA: escribe la idea principal de un párrafo sobre tu sueño para el futuro", validar:"", ejemplos:["Mi sueño es ser veterinario."]},
      {tipo:"write", instr:"ESCRIBE tu párrafo completo (mínimo 4 oraciones)", validar:"", ejemplos:["Mi sueño es ser veterinario. Me encantan los animales. Quiero curarlos cuando estén enfermos. Por eso estudio mucho."]},
      {tipo:"checklist", instr:"REVISA tu párrafo. Marca lo que cumpliste:",
        items:["Tiene idea principal, apoyo y cierre","Usé al menos un conector","Usé adjetivos precisos","Revisé acentos y puntuación","No repetí palabras"]}
    ]
  }
},

/* ══════════════ RONDA 4 · Integración y escritura creativa ══════════════ */

{
  folio:16, ronda:4, tema:"Acentuación creativa", subtitulo:"Escribir con arte",
  pda:"Aplica la acentuación de forma natural y autónoma en producciones creativas propias.",
  ib:"Escriben de manera independiente demostrando voz y estilo propios (Fase 4).",
  recordatorio:"Ahora escribes con libertad y creatividad; la acentuación ya es parte natural de tu escritura.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Las esdrújulas...", palabra:"?", opciones:["Siempre llevan tilde","A veces llevan tilde"], correcta:0}
    ],
    2:[
      {tipo:"correct", instr:"Corrige el título del cuento", frase:"El pajaro magico del rio", errores:["pajaro","magico","rio"], correcciones:["pájaro","mágico","río"]}
    ],
    3:[
      {tipo:"write", instr:"Escribe un título creativo para un cuento (con una palabra acentuada)", validar:"", ejemplos:["El árbol de los sueños perdidos"]},
      {tipo:"write", instr:"Escribe el inicio de una historia usando: mágico, después, corazón", validar:"", ejemplos:["Aquel día mágico, después de la lluvia, mi corazón latió fuerte."]}
    ]
  }
},

{
  folio:17, ronda:4, tema:"Puntuación expresiva", subtitulo:"Diálogos y emoción",
  pda:"Emplea los signos de puntuación de manera expresiva y convencional en textos creativos.",
  ib:"Captan y mantienen el interés del lector; adaptan su escritura (Fase 4).",
  recordatorio:"La puntuación da emoción y ritmo. Los signos de admiración expresan sentimientos; los guiones dan vida a los diálogos.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál marca un diálogo?", palabra:"?", opciones:["— (guion largo)","* (asterisco)"], correcta:0},
      {tipo:"choice", pregunta:"¿Cuál expresa emoción?", palabra:"Ganamos ___", opciones:["¡!","..."], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"¿Cuál está bien escrito?", palabra:"?", opciones:["—¡Ganamos! —gritó Ana.","- Ganamos! grito Ana"], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Escribe un diálogo de 2 líneas con guiones largos (—)", validar:"—", ejemplos:["—¿Vamos al cine? —preguntó Luis.\n—¡Claro que sí! —respondió Ana."]},
      {tipo:"write", instr:"Convierte en emocionante: 'Ganamos el partido'", validar:"¡", ejemplos:["¡Ganamos el partido!"]}
    ]
  }
},

{
  folio:18, ronda:4, tema:"Lenguaje figurado", subtitulo:"Símiles y comparaciones",
  pda:"Usa adjetivos, adverbios y comparaciones para enriquecer sus textos con lenguaje figurado.",
  ib:"Reconocen y emplean lenguaje figurado: símiles, metáforas (Fase 4).",
  recordatorio:"Los buenos escritores comparan para crear imágenes: 'veloz como el viento', 'blanco como la nieve'.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál es un SÍMIL?", palabra:"?", opciones:["Blanco como la nieve","La casa es blanca"], correcta:0},
      {tipo:"classify", instr:"¿Es comparación o descripción simple?", cajas:["Comparación","Descripción"],
        fichas:[{w:"fuerte como un león",caja:0},{w:"el león es fuerte",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Completa el símil", palabra:"Tan rápido como ___", opciones:["un rayo","rápido"], correcta:0},
      {tipo:"choice", pregunta:"Transforma con símil: 'La luna estaba muy blanca'", palabra:"?", opciones:["La luna estaba blanca como la nieve.","La luna estaba blanca blanca."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Completa: 'Tan brillante como ___'", validar:"", ejemplos:["Tan brillante como una estrella"]},
      {tipo:"write", instr:"Describe un paisaje imaginario usando 2 comparaciones", validar:"como", ejemplos:["El cielo era azul como el mar y las nubes suaves como algodón."]}
    ]
  }
},

{
  folio:19, ronda:4, tema:"Conectores narrativos", subtitulo:"Contar historias",
  pda:"Emplea conectores narrativos y temporales para dar secuencia y ritmo a sus relatos.",
  ib:"Escriben textos narrativos manteniendo el interés del lector (Fase 4).",
  recordatorio:"En un cuento los conectores guían al lector: al principio, de pronto, mientras, entonces, al final.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"¿Cuál inicia una historia?", palabra:"?", opciones:["Al principio","Finalmente"], correcta:0},
      {tipo:"classify", instr:"Ordena la historia", cajas:["Inicio","Sorpresa"],
        fichas:[{w:"Al principio todo estaba tranquilo",caja:0},{w:"De pronto apareció un dragón",caja:1}]}
    ],
    2:[
      {tipo:"choice", pregunta:"Une con simultaneidad", palabra:"La niña leía. Llovía afuera.", opciones:["La niña leía mientras llovía afuera.","La niña leía y llovía."], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"Continúa la historia con DE PRONTO: 'Caminábamos por el bosque...'", validar:"de pronto", ejemplos:["Caminábamos por el bosque. De pronto, escuchamos un ruido extraño."]},
      {tipo:"write", instr:"Escribe el inicio de un cuento con 3 conectores narrativos", validar:"", ejemplos:["Al principio todo era normal. De pronto, la luz se apagó. Entonces supe que algo pasaba."]}
    ]
  }
},

{
  folio:20, ronda:4, tema:"Texto completo", subtitulo:"El gran cierre",
  pda:"Produce textos completos de varios párrafos integrando todos los elementos del programa.",
  ib:"Escriben textos de diversos tipos de manera independiente, con voz y estilo propios (Fase 4).",
  recordatorio:"Este es el último reto. Demuestras TODO: acentos, puntuación, adjetivos, conectores, párrafos y vocabulario.",
  niveles:{
    1:[
      {tipo:"choice", pregunta:"Un texto completo debe tener...", palabra:"?", opciones:["Inicio, desarrollo y cierre","Solo muchas palabras"], correcta:0}
    ],
    2:[
      {tipo:"choice", pregunta:"¿Cuántos párrafos mínimo debe tener tu texto?", palabra:"?", opciones:["Dos","Uno"], correcta:0}
    ],
    3:[
      {tipo:"write", instr:"PLANEA: elige tu tema y escribe la idea principal", validar:"", ejemplos:["Un cuento sobre un viaje al espacio"]},
      {tipo:"write", instr:"ESCRIBE tu texto completo (mínimo 2 párrafos, 8 oraciones)", validar:"", ejemplos:["Era una noche estrellada..."]},
      {tipo:"checklist", instr:"REVISA tu texto final. Marca lo que cumpliste:",
        items:["Tiene inicio, desarrollo y cierre","Está organizado en párrafos","Usé adjetivos y adverbios precisos","Usé varios conectores","Cuidé acentos y puntuación","Elegí palabras variadas"]}
    ]
  }
}

];

/* ============================================================
   RESUMEN PARA LA HOJA DE SEGUIMIENTO (padres)
   Agrupa los folios por ronda para mostrar el avance.
   ============================================================ */
const RONDAS = [
  { n:1, nombre:"Ronda 1", desc:"Identificación y corrección guiada", folios:[1,2,3,4,5] },
  { n:2, nombre:"Ronda 2", desc:"Aplicación con apoyo parcial",      folios:[6,7,8,9,10] },
  { n:3, nombre:"Ronda 3", desc:"Producción autónoma con criterios",  folios:[11,12,13,14,15] },
  { n:4, nombre:"Ronda 4", desc:"Integración y escritura creativa",    folios:[16,17,18,19,20] }
];

const NIVELES_DATA = [
  { n:1, nombre:"Reconocer", desc:"Identifico y clasifico",  icono:"👀" },
  { n:2, nombre:"Aplicar",   desc:"Completo y corrijo",      icono:"✍️" },
  { n:3, nombre:"Producir",  desc:"Creo y escribo",          icono:"🚀" }
];



window.ESP={ORTO:ORTOGRAFIA,PEPE:PEPE,RONDAS:RONDAS,NIVELES:NIVELES_DATA};
})();
