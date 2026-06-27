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

/** Matrículas agrupadas por año (a partir de la fecha de matrícula). */
export function matriculasPorAnio(students: Student[]): MesConteo[] {
  const buckets = new Map<number, number>();
  for (const s of students) {
    if (!s.fechaMatricula) continue;
    const y = Number(s.fechaMatricula.slice(0, 4));
    if (!y) continue;
    buckets.set(y, (buckets.get(y) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([y, value]) => ({ etiqueta: String(y), value }));
}
