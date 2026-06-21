import type { Nivel, Student } from "../data/types";

export interface Conteo {
  label: string;
  value: number;
}

export function contarPor(
  students: Student[],
  key: (s: Student) => string,
  limit?: number
): Conteo[] {
  const map = new Map<string, number>();
  for (const s of students) map.set(key(s), (map.get(key(s)) ?? 0) + 1);
  const arr = [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  return limit ? arr.slice(0, limit) : arr;
}

export function nivelBreakdown(students: Student[]): Record<Nivel, number> {
  const out: Record<Nivel, number> = { Alto: 0, Medio: 0, Bajo: 0 };
  for (const s of students) out[s.nivel]++;
  return out;
}

export interface MesConteo {
  etiqueta: string;
  value: number;
}

/** Matrículas por mes en los últimos `n` meses respecto a la fecha de corte. */
export function matriculasPorMes(students: Student[], n = 12): MesConteo[] {
  const corte = new Date("2026-06-20T00:00:00");
  const meses: MesConteo[] = [];
  const nombres = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];
  const buckets = new Map<string, number>();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(corte.getFullYear(), corte.getMonth() - i, 1);
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    buckets.set(k, 0);
    meses.push({ etiqueta: nombres[d.getMonth()], value: 0 });
  }

  for (const s of students) {
    const d = new Date(s.fechaMatricula + "T00:00:00");
    const k = `${d.getFullYear()}-${d.getMonth()}`;
    if (buckets.has(k)) buckets.set(k, (buckets.get(k) ?? 0) + 1);
  }

  const keys = [...buckets.keys()];
  return meses.map((m, idx) => ({ ...m, value: buckets.get(keys[idx]) ?? 0 }));
}
