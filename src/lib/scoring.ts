import type { EstadoPago, Factor, Nivel } from "../data/types";

/**
 * Motor de propensión a recompra (versión MVP, basada en reglas transparentes).
 * En producción esto se reemplaza por el modelo entrenado en Python con el
 * historial real de recompras; la interfaz (puntaje 0-100 + factores) se mantiene.
 *
 * Nota ética: el GÉNERO no participa en el puntaje, para evitar sesgo.
 */

const PROFESIONES_AFINES = new Set([
  "Psicología",
  "Trabajo Social",
  "Educación",
  "Enfermería",
  "Medicina",
  "Terapia Ocupacional",
  "Counseling",
]);

const DISTRITOS_ALTA_CAPACIDAD = new Set([
  "Miraflores",
  "San Isidro",
  "Santiago de Surco",
  "La Molina",
  "San Borja",
  "Barranco",
  "Magdalena del Mar",
]);

export interface ScoreInput {
  profesion: string;
  distrito: string;
  estadoPago: EstadoPago;
  numeroCompras: number;
  mesesDesdeMatricula: number;
}

export interface ScoreResult {
  score: number;
  nivel: Nivel;
  factores: Factor[];
}

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function computeScore(input: ScoreInput): ScoreResult {
  const factores: Factor[] = [];
  let score = 38; // base

  // Recompras previas: la señal más fuerte
  if (input.numeroCompras >= 3) {
    factores.push({ label: "Cliente recurrente (3+ compras)", impact: 26 });
    score += 26;
  } else if (input.numeroCompras === 2) {
    factores.push({ label: "Ya recompró una vez", impact: 17 });
    score += 17;
  } else {
    factores.push({ label: "Solo una compra registrada", impact: -6 });
    score -= 6;
  }

  // Estado de pago
  if (input.estadoPago === "Validado") {
    factores.push({ label: "Pago validado con comprobante", impact: 12 });
    score += 12;
  } else if (input.estadoPago === "Pendiente") {
    factores.push({ label: "Pago pendiente de validar", impact: 1 });
    score += 1;
  } else {
    factores.push({ label: "Sin pago registrado", impact: -11 });
    score -= 11;
  }

  // Profesión afín al diplomado TENCA
  if (PROFESIONES_AFINES.has(input.profesion)) {
    factores.push({ label: `Profesión afín a terapia (${input.profesion})`, impact: 14 });
    score += 14;
  }

  // Recencia de la matrícula
  if (input.mesesDesdeMatricula <= 10) {
    factores.push({ label: "Matrícula reciente (alta cercanía)", impact: 10 });
    score += 10;
  } else if (input.mesesDesdeMatricula <= 22) {
    factores.push({ label: "Matrícula del último año y medio", impact: 4 });
    score += 4;
  } else if (input.mesesDesdeMatricula >= 40) {
    factores.push({ label: "Sin actividad reciente", impact: -7 });
    score -= 7;
  }

  // Distrito (proxy de capacidad / cercanía a sede)
  if (DISTRITOS_ALTA_CAPACIDAD.has(input.distrito)) {
    factores.push({ label: "Distrito de alta capacidad de pago", impact: 6 });
    score += 6;
  }

  score = clamp(Math.round(score), 3, 99);

  factores.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return { score, nivel: nivelFromScore(score), factores };
}

export function nivelFromScore(score: number): Nivel {
  if (score >= 70) return "Alto";
  if (score >= 47) return "Medio";
  return "Bajo";
}
