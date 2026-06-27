export type Brand = "Nueva Sendas" | "Nova Nexus";
export type Genero = "Femenino" | "Masculino";
export type EstadoPago = "Validado" | "Pendiente" | "Sin pago";
export type Nivel = "Alto" | "Medio" | "Bajo";

export interface Factor {
  label: string;
  /** Contribución al puntaje, con signo. Positivo suma, negativo resta. */
  impact: number;
}

export interface Student {
  id: string;
  dni: string;
  nombre: string;
  genero: Genero;
  correo: string;
  celular: string;
  direccion: string;
  distrito: string;
  provincia: string;
  departamento: string;
  profesion: string;
  marca: Brand;
  programa: string;
  fechaMatricula: string; // ISO yyyy-mm-dd
  estadoPago: EstadoPago;
  comprobanteUrl: string;
  numeroCompras: number;
  recompro: boolean;
  score: number; // 0-100
  nivel: Nivel;
  factores: Factor[];
  // Opcionales: presentes en la base real de Nueva Sendas
  programasRaw?: string; // historial completo de programas
  aniosRaw?: string; // años en que se matriculó
}
