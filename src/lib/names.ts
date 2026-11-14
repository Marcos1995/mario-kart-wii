const COURSES: Record<string, string> = {
  "Mario Circuit": "Circuito Mario",
  "GBA Battle Course 3": "GBA Circuito de Batalla 3",
  "Galaxy Colosseum": "Coliseo Galáctico",
  "Mushroom Gorge": "Barranco Champiñón",
  "Coconut Mall": "Centro Cocotero",
  "DS Twilight House": "DS Casa Crepuscular",
  "N64 DK's Jungle Parkway": "N64 Pista de la Jungla de DK",
  "Koopa Cape": "Colina Koopa",
  "N64 Skyscraper": "N64 Rascacielos",
  "SNES Mario Circuit 3": "SNES Circuito Mario 3",
  "Thwomp Desert": "Desierto Roca Picuda",
  "Luigi Circuit": "Circuito de Luigi",
  "Maple Treeway": "Senda del Arce",
  "N64 Mario Raceway": "N64 Pista Mario",
  "Wario's Gold Mine": "Mina de Wario",
  "DK Summit": "Cumbre DK",
  "Toad's Factory": "Fábrica de Toad",
  "Funky Stadium": "Estadio Funky",
  "Block Plaza": "Plaza Cúbica",
  "GBA Bowser's Castle 3": "GBA Castillo de Bowser 3",
  "SNES Battle Course 4": "SNES Circuito de Batalla 4",
  "N64 Bowser's Castle": "N64 Castillo de Bowser",
  "GCN Waluigi Stadium": "GCN Estadio Waluigi",
  "DS Peach Gardens": "DS Jardín de Peach",
  "Chain Chomp Wheel": "Ruleta Chomp Cadenas",
  "Grumble Volcano": "Volcán Gruñón",
  "GCN Peach Beach": "GCN Playa Peach",
  "DS Yoshi Falls": "DS Cataratas de Yoshi",
  "GBA Shy Guy Beach": "GBA Playa Shy Guy",
  "Bowser's Castle": "Castillo de Bowser",
  "GCN Cookie Land": "GCN Tierra Galleta",
  "GCN Mario Circuit": "GCN Circuito Mario",
  "Daisy Circuit": "Circuito Daisy",
  "Dry Dry Ruins": "Ruinas Seco-Seco",
  "Rainbow Road": "Senda Arco Iris",
  "DS Desert Hills": "DS Desierto Sol-Sol",
  "Delfino Pier": "Muelle Delfino",
  "GCN DK Mountain": "GCN Montaña DK",
  "N64 Sherbet Land": "N64 Tierra Sorbete",
  "DS Delfino Square": "DS Ciudad Delfino",
  "Moonview Highway": "Circuito Luz de Luna",
};

const CHARACTERS: Record<string, string> = {
  Rosalina: "Estela",
  "Dry Bones": "Huesitos",
  "Dry Bowser": "Bowsitos",
  "Bowser Jr.": "Bowsy",
  "King Boo": "Rey Boo",
  "Baby Mario": "Bebé Mario",
  "Baby Luigi": "Bebé Luigi",
  "Baby Peach": "Bebé Peach",
  "Baby Daisy": "Bebé Daisy",
  "Koopa Troopa": "Koopa",
};

const VEHICLES: Record<string, string> = {
  "Wild Wing": "Alerón Chiflado",
  "Flame Flyer": "Carro Fulminante",
  "Mini Beast": "Minibestia",
  "Standard Kart S": "Kart estándar P",
  "Standard Kart M": "Kart estándar M",
  "Standard Kart L": "Kart estándar G",
  "Super Blooper": "Bloopercarro",
  Spear: "Torpedo",
  Offroader: "Todoterreno",
  "Classic Dragster": "Modelo Clásico",
  "Booster Seat": "Supercuna",
  "Cheep Charger": "Carruaje Cheep",
  "Tiny Titan": "Minitractor",
  "Blue Falcon": "Blue Falcon",
  "Mach Bike": "Moto Hipersónica",
  "Flame Runner": "Moto de Bowser",
  "Wario Bike": "Moto de Wario",
  "Shooting Star": "Estrella Fugaz",
  Phantom: "Fantasma",
  "Bullet Bike": "Moto Bala",
  "Bit Bike": "Pequeciclo",
  Quacker: "Pato Raudo",
  Magikruiser: "Magiciclo",
  "Jet Bubble": "Moto Cúpula",
  "Standard Bike S": "Moto estándar P",
  "Standard Bike M": "Moto estándar M",
  "Standard Bike L": "Moto estándar G",
  Honeycoupe: "Dominguero",
  "B Dasher": "Súper Rayo GTI",
  Sugarscoot: "Ciclomotor Dulzón",
  "Zip Zip": "Zum-Zum",
  Sneakster: "Nitrocicleta",
  "Dolphin Dasher": "Velocidelfín",
  "Piranha Prowler": "Piraña Maleante",
  Jetsetter: "Autodeslizador",
};

const CONTROLLERS: Record<string, string> = {
  "Wiimote Nunchuck": "Mando de Wii + Nunchuk",
  "Gamecube Pad": "Mando de GameCube",
  "Wii Wheel": "Volante Wii",
  "Classic Controller": "Mando clásico",
};

const REGIONS: Record<string, string> = {
  Japan: "Japón",
  "North America": "Norteamérica",
  Europe: "Europa",
  Australia: "Australia",
  Korea: "Corea",
  Worldwide: "Mundial",
};

const COUNTRIES: Record<string, string> = {
  Spain: "España",
  France: "Francia",
  Germany: "Alemania",
  Italy: "Italia",
  Japan: "Japón",
  "United States": "Estados Unidos",
  "United Kingdom": "Reino Unido",
  Canada: "Canadá",
  Brazil: "Brasil",
  Australia: "Australia",
  Netherlands: "Países Bajos",
  Portugal: "Portugal",
  Sweden: "Suecia",
  Norway: "Noruega",
  Austria: "Austria",
  Switzerland: "Suiza",
  Ireland: "Irlanda",
  Mexico: "México",
  Chile: "Chile",
  "New Zealand": "Nueva Zelanda",
  Luxembourg: "Luxemburgo",
  "Dominican Republic": "República Dominicana",
  Panama: "Panamá",
  Finland: "Finlandia",
  Belgium: "Bélgica",
  Denmark: "Dinamarca",
  Poland: "Polonia",
  Greece: "Grecia",
  Korea: "Corea",
  "South Korea": "Corea del Sur",
  Argentina: "Argentina",
  Colombia: "Colombia",
  Peru: "Perú",
  Russia: "Rusia",
  China: "China",
  Taiwan: "Taiwán",
  "Hong Kong": "Hong Kong",
};

const RESTRICTIONS: Record<string, string> = {
  "Karts only": "Solo karts",
  "Wii Wheel only": "Solo volante Wii",
  "Karts and Wii Wheel only": "Solo karts y volante Wii",
  "Bikes only": "Solo motos",
  "Bikes and Wii Wheel only": "Solo motos y volante Wii",
};

export function courseName(english: string) {
  return COURSES[english] ?? english;
}

export function characterName(english: string) {
  return CHARACTERS[english] ?? english;
}

export function vehicleName(english: string) {
  return VEHICLES[english] ?? english;
}

export function controllerName(english: string) {
  return CONTROLLERS[english] ?? english;
}

export function regionName(english: string) {
  return REGIONS[english] ?? english;
}

export function countryName(english: string) {
  if (!english) return "País no indicado";
  return COUNTRIES[english] ?? english;
}

export function restrictionName(english: string) {
  if (!english) return "";
  return RESTRICTIONS[english] ?? english;
}

export function fold(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

export function formatRange(start: string, end: string) {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  if (sy === ey && sm === em) {
    return `${sd}–${ed} de ${MONTHS[sm - 1]} de ${sy}`;
  }
  return `${sd} de ${MONTHS[sm - 1]} de ${sy} – ${ed} de ${MONTHS[em - 1]} de ${ey}`;
}

export function formatMs(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const millis = ms % 1000;
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

export function formatCopiedAt(iso: string) {
  const date = new Date(iso);
  const months = MONTHS[date.getUTCMonth()];
  return `${date.getUTCDate()} de ${months} de ${date.getUTCFullYear()}`;
}

export function challengeSummary(description: string) {
  const text = description.toLowerCase();
  if (text.includes("coin")) return "Recoger las monedas en el menor tiempo.";
  if (text.includes("gate")) return "Cruzar las puertas en orden, lo más rápido posible.";
  if (text.includes("backward")) return "Contrarreloj marcha atrás.";
  if (text.includes("topman") || text.includes("spiky")) {
    return "Empujar a los trompos fuera del escenario.";
  }
  if (text.includes("vs")) return "Carrera contra la máquina, con el circuito cambiado.";
  if (text.includes("time trial")) return "Contrarreloj con el circuito cambiado.";
  if (text.includes("defeat") || text.includes("race against")) {
    return "Una prueba contra rivales o enemigos colocados por Nintendo.";
  }
  return "Prueba especial del Canal Mario Kart.";
}

export const SCOPE_LABEL: Record<string, string> = {
  W: "Mundial",
  J: "Japón",
  N: "Norteamérica",
  E: "Europa",
  A: "Australia",
  K: "Corea",
};
