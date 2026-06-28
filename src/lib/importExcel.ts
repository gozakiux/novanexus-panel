import type { Student } from "../data/types";
import { scoreReal } from "./scoreReal";

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();

function titulo(s: string): string {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function findCol(headers: string[], aliases: string[]): string | undefined {
  for (const h of headers) {
    const n = norm(h);
    if (aliases.some((a) => n.includes(a))) return h;
  }
  return undefined;
}

export interface ResultadoParseo {
  alumnos: Student[];
  totalFilas: number;
  descartadas: number;
  columnas: { campo: string; excel: string | undefined }[];
}

export async function parseExcel(buf: ArrayBuffer): Promise<ResultadoParseo> {
  const XLSX = await import("xlsx");
  const wb = XLSX.read(buf, { type: "array" });
  let hoja = wb.SheetNames[0];
  let maxRows = 0;
  for (const name of wb.SheetNames) {
    const n = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1 }).length;
    if (n > maxRows) {
      maxRows = n;
      hoja = name;
    }
  }
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[hoja], { defval: "" });
  const headers = rows.length ? Object.keys(rows[0]) : [];

  const col = {
    nombre: findCol(headers, ["nombre"]),
    correo: findCol(headers, ["email", "correo", "mail"]),
    telefono: findCol(headers, ["telefono", "celular", "whatsapp", "cel"]),
    nProg: findCol(headers, ["n programas", "nro programas", "n cursos", "numero de programas", "cantidad"]),
    anios: findCol(headers, ["anios", "ano", "year"]),
    programa: findCol(headers, ["programas", "programa", "curso"]),
  };

  const val = (r: Record<string, unknown>, c: string | undefined) =>
    c ? String(r[c] ?? "").trim() : "";

  const alumnos: Student[] = [];
  let descartadas = 0;
  rows.forEach((r, idx) => {
    const nombre = val(r, col.nombre);
    if (!nombre || nombre.includes("@") || /^[\d\s\-+().\/]+$/.test(nombre)) {
      descartadas++;
      return;
    }
    const correoRaw = val(r, col.correo).toLowerCase();
    const correo = correoRaw.includes("@") ? correoRaw : "";
    const telefono = val(r, col.telefono);
    const aniosStr = val(r, col.anios);
    const anios = [...aniosStr.matchAll(/(?:19|20)\d{2}/g)]
      .map((m) => Number(m[0]))
      .sort((a, b) => a - b);
    const ultimoAnio = anios.length ? anios[anios.length - 1] : null;
    const primerAnio = anios.length ? anios[0] : null;
    let nProg = col.nProg ? parseInt(val(r, col.nProg), 10) : NaN;
    if (Number.isNaN(nProg)) nProg = anios.length || 1;
    nProg = Math.max(1, nProg);
    const programasRaw = val(r, col.programa);
    const { score, nivel, factores } = scoreReal({
      numeroCompras: nProg,
      ultimoAnio,
      tieneCorreo: !!correo,
      tieneTelefono: !!telefono,
    });
    alumnos.push({
      id: correo ? `e-${correo}` : `n-${norm(nombre).replace(/\s+/g, "-")}-${idx}`,
      dni: "",
      nombre: titulo(nombre),
      genero: "" as Student["genero"],
      correo,
      celular: telefono,
      direccion: "",
      distrito: "",
      provincia: "",
      departamento: "",
      profesion: "",
      marca: "Nueva Sendas",
      programa: programasRaw.split(/[;|]/)[0].trim() || "Programa Nueva Sendas",
      programasRaw,
      aniosRaw: anios.join(", "),
      fechaMatricula: primerAnio ? `${primerAnio}-01-01` : "",
      estadoPago: "" as Student["estadoPago"],
      comprobanteUrl: "",
      numeroCompras: nProg,
      recompro: nProg >= 2,
      score,
      nivel,
      factores,
    });
  });

  return {
    alumnos,
    totalFilas: rows.length,
    descartadas,
    columnas: [
      { campo: "Nombre", excel: col.nombre },
      { campo: "Correo", excel: col.correo },
      { campo: "Teléfono", excel: col.telefono },
      { campo: "N.° de programas", excel: col.nProg },
      { campo: "Años", excel: col.anios },
      { campo: "Programas", excel: col.programa },
    ],
  };
}
