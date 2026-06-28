import type { Factor, Nivel } from "../data/types";

export interface EntradaScore {
  numeroCompras: number;
  ultimoAnio: number | null;
  tieneCorreo: boolean;
  tieneTelefono: boolean;
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

/** Puntaje de propensión a recomprar (mismas reglas que la carga inicial de la base real). */
export function scoreReal(i: EntradaScore): { score: number; nivel: Nivel; factores: Factor[] } {
  const f: Factor[] = [];
  let score = 35;
  if (i.numeroCompras >= 4) {
    f.push({ label: "Cliente muy recurrente (4+ programas)", impact: 40 });
    score += 40;
  } else if (i.numeroCompras === 3) {
    f.push({ label: "Recurrente (3 programas)", impact: 30 });
    score += 30;
  } else if (i.numeroCompras === 2) {
    f.push({ label: "Ya recompró una vez", impact: 18 });
    score += 18;
  } else {
    f.push({ label: "Un solo programa registrado", impact: -6 });
    score -= 6;
  }
  if (i.ultimoAnio) {
    if (i.ultimoAnio >= 2023) {
      f.push({ label: "Actividad reciente", impact: 15 });
      score += 15;
    } else if (i.ultimoAnio >= 2018) {
      f.push({ label: "Actividad del último lustro", impact: 8 });
      score += 8;
    } else if (i.ultimoAnio < 2012) {
      f.push({ label: "Sin actividad reciente", impact: -7 });
      score -= 7;
    }
  }
  if (i.tieneCorreo) {
    f.push({ label: "Contactable por correo", impact: 6 });
    score += 6;
  }
  if (i.tieneTelefono) {
    f.push({ label: "Contactable por teléfono", impact: 4 });
    score += 4;
  }
  score = clamp(Math.round(score), 3, 99);
  const nivel: Nivel = score >= 70 ? "Alto" : score >= 47 ? "Medio" : "Bajo";
  f.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
  return { score, nivel, factores: f };
}
