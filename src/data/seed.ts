import { computeScore } from "../lib/scoring";
import type { Brand, EstadoPago, Genero, Student } from "./types";

/** PRNG determinista para que los datos de ejemplo sean estables entre recargas. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOW = new Date("2026-06-20T00:00:00");

const NOMBRES_F = [
  "María", "Lucía", "Carmen", "Rosa", "Andrea", "Valeria", "Gabriela", "Paola",
  "Milagros", "Fiorella", "Diana", "Patricia", "Claudia", "Ana", "Jimena",
  "Sofía", "Camila", "Estefanía", "Yolanda", "Pamela",
];
const NOMBRES_M = [
  "José", "Luis", "Carlos", "Jorge", "Miguel", "César", "Renzo", "Diego",
  "Manuel", "Fernando", "Alberto", "Sergio", "Marco", "Iván", "Rodrigo",
  "Christian", "Walter", "Óscar", "Julio", "Gonzalo",
];
const APELLIDOS = [
  "Quispe", "Flores", "Rojas", "Huamán", "Vargas", "Castillo", "Ramos",
  "Sánchez", "Cárdenas", "Mendoza", "Salazar", "Paredes", "Espinoza",
  "Chávez", "Ramírez", "Gutiérrez", "Ríos", "Ávalos", "Núñez", "Bautista",
  "Ccahuana", "Ticona", "Manrique", "Becerra", "Zegarra",
];

interface Lugar {
  distrito: string;
  provincia: string;
  departamento: string;
}
const LUGARES: Lugar[] = [
  { distrito: "Miraflores", provincia: "Lima", departamento: "Lima" },
  { distrito: "San Isidro", provincia: "Lima", departamento: "Lima" },
  { distrito: "Santiago de Surco", provincia: "Lima", departamento: "Lima" },
  { distrito: "La Molina", provincia: "Lima", departamento: "Lima" },
  { distrito: "San Borja", provincia: "Lima", departamento: "Lima" },
  { distrito: "Jesús María", provincia: "Lima", departamento: "Lima" },
  { distrito: "Barranco", provincia: "Lima", departamento: "Lima" },
  { distrito: "San Miguel", provincia: "Lima", departamento: "Lima" },
  { distrito: "Los Olivos", provincia: "Lima", departamento: "Lima" },
  { distrito: "San Juan de Lurigancho", provincia: "Lima", departamento: "Lima" },
  { distrito: "Comas", provincia: "Lima", departamento: "Lima" },
  { distrito: "Ate", provincia: "Lima", departamento: "Lima" },
  { distrito: "Villa El Salvador", provincia: "Lima", departamento: "Lima" },
  { distrito: "Magdalena del Mar", provincia: "Lima", departamento: "Lima" },
  { distrito: "Cayma", provincia: "Arequipa", departamento: "Arequipa" },
  { distrito: "Trujillo", provincia: "Trujillo", departamento: "La Libertad" },
  { distrito: "Wánchaq", provincia: "Cusco", departamento: "Cusco" },
  { distrito: "Chiclayo", provincia: "Chiclayo", departamento: "Lambayeque" },
];

const PROFESIONES = [
  "Psicología", "Psicología", "Psicología", "Trabajo Social", "Educación",
  "Educación", "Enfermería", "Medicina", "Counseling", "Terapia Ocupacional",
  "Administración", "Derecho", "Contabilidad", "Ingeniería", "Comunicaciones",
];

const PROGRAMAS_SENDAS = [
  "Taller de Terapia Familiar I",
  "Curso de Intervención Sistémica",
  "Diplomado de Consejería Familiar",
  "Seminario de Vínculo y Apego",
  "Curso de Manejo de Conflictos",
  "Taller de Terapia de Pareja",
];
const PROGRAMA_NEXUS = "Diplomado de Actualización en Terapia Familiar TENCA";

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function isoFecha(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function mesesEntre(desde: Date, hasta: Date): number {
  return (
    (hasta.getFullYear() - desde.getFullYear()) * 12 +
    (hasta.getMonth() - desde.getMonth())
  );
}

function buildStudents(): Student[] {
  const rand = mulberry32(20260620);
  const total = 64;
  const out: Student[] = [];

  for (let i = 0; i < total; i++) {
    const genero: Genero = rand() > 0.42 ? "Femenino" : "Masculino";
    const nombre = `${pick(rand, genero === "Femenino" ? NOMBRES_F : NOMBRES_M)} ${pick(
      rand,
      APELLIDOS
    )} ${pick(rand, APELLIDOS)}`;

    const lugar = pick(rand, LUGARES);
    const profesion = pick(rand, PROFESIONES);

    // Matrícula entre may-2021 y may-2026
    const diasAtras = Math.floor(rand() * 1850) + 30;
    const fecha = new Date(NOW.getTime() - diasAtras * 86400000);
    const fechaMatricula = isoFecha(fecha);
    const mesesDesdeMatricula = mesesEntre(fecha, NOW);

    // Compras / recompra
    const r = rand();
    const numeroCompras = r > 0.78 ? 3 + Math.floor(rand() * 2) : r > 0.5 ? 2 : 1;
    const recompro = numeroCompras >= 2;

    // Estado de pago
    const p = rand();
    const estadoPago: EstadoPago =
      p > 0.22 ? "Validado" : p > 0.08 ? "Pendiente" : "Sin pago";

    const { score, nivel, factores } = computeScore({
      profesion,
      distrito: lugar.distrito,
      estadoPago,
      numeroCompras,
      mesesDesdeMatricula,
    });

    // Casi todos son Nueva Sendas; algunos top ya fueron captados por Nova Nexus.
    const yaCaptado = score >= 78 && rand() > 0.55;
    const marca: Brand = yaCaptado ? "Nova Nexus" : "Nueva Sendas";
    const programa = marca === "Nova Nexus" ? PROGRAMA_NEXUS : pick(rand, PROGRAMAS_SENDAS);

    const dni = String(40000000 + Math.floor(rand() * 59999999));
    const deburr = (s: string) =>
      s.normalize("NFD").replace(/[̀-ͯ]/g, "");
    const partesNombre = deburr(nombre).toLowerCase().split(" ");
    const correo = `${partesNombre[0]}.${partesNombre[1]}@correo.pe`;
    const celular = "9" + String(10000000 + Math.floor(rand() * 89999999));

    out.push({
      id: `al-${String(i + 1).padStart(3, "0")}`,
      dni,
      nombre,
      genero,
      correo,
      celular,
      direccion: `${pick(rand, ["Av.", "Jr.", "Calle"])} ${pick(rand, [
        "Las Begonias",
        "Los Sauces",
        "Primavera",
        "San Martín",
        "Grau",
        "Bolognesi",
        "La Mar",
      ])} ${100 + Math.floor(rand() * 899)}`,
      distrito: lugar.distrito,
      provincia: lugar.provincia,
      departamento: lugar.departamento,
      profesion,
      marca,
      programa,
      fechaMatricula,
      estadoPago,
      comprobanteUrl: `https://drive.google.com/file/d/1${dni}AbCdEf/view`,
      numeroCompras,
      recompro,
      score,
      nivel,
      factores,
    });
  }

  return out.sort((a, b) => b.score - a.score);
}

export const STUDENTS: Student[] = buildStudents();
