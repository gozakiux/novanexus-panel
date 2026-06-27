import { useEffect, useState } from "react";
import type { Factor, Nivel, Student } from "../data/types";
import { supabase } from "./supabase";

const PAGE = 1000;
const str = (v: unknown) => (typeof v === "string" ? v : "");

function toStudent(r: Record<string, unknown>): Student {
  const score = typeof r.score === "number" ? r.score : 0;
  const numeroCompras = typeof r.numero_compras === "number" ? r.numero_compras : 1;
  const nivel: Nivel = ["Alto", "Medio", "Bajo"].includes(r.nivel as string)
    ? (r.nivel as Nivel)
    : "Bajo";
  return {
    id: String(r.id),
    dni: str(r.dni),
    nombre: str(r.nombre),
    genero: str(r.genero) as Student["genero"],
    correo: str(r.correo),
    celular: str(r.celular),
    direccion: str(r.direccion),
    distrito: str(r.distrito),
    provincia: str(r.provincia),
    departamento: str(r.departamento),
    profesion: str(r.profesion),
    marca: r.marca === "Nova Nexus" ? "Nova Nexus" : "Nueva Sendas",
    programa: str(r.programa),
    programasRaw: str(r.programas_raw),
    aniosRaw: str(r.anios_raw),
    fechaMatricula: r.fecha_matricula ? String(r.fecha_matricula) : "",
    estadoPago: str(r.estado_pago) as Student["estadoPago"],
    comprobanteUrl: str(r.comprobante_url),
    numeroCompras,
    recompro: numeroCompras >= 2,
    score,
    nivel,
    factores: Array.isArray(r.factores) ? (r.factores as Factor[]) : [],
  };
}

async function fetchAll(): Promise<Student[]> {
  const out: Student[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("alumnos")
      .select("*")
      .order("score", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) throw error;
    const rows = (data ?? []) as Record<string, unknown>[];
    out.push(...rows.map(toStudent));
    if (rows.length < PAGE) break;
  }
  return out;
}

export function useAlumnos(enabled: boolean) {
  const [alumnos, setAlumnos] = useState<Student[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let vivo = true;
    setCargando(true);
    setError(null);
    fetchAll()
      .then((data) => {
        if (vivo) setAlumnos(data);
      })
      .catch((e: unknown) => {
        if (vivo) setError(e instanceof Error ? e.message : "Error al cargar");
      })
      .finally(() => {
        if (vivo) setCargando(false);
      });
    return () => {
      vivo = false;
    };
  }, [enabled]);

  return { alumnos, error, cargando };
}
