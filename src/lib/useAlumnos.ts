import { useEffect, useState } from "react";
import type { Brand, Factor, Nivel, Student } from "../data/types";
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

function toRow(s: Student): Record<string, unknown> {
  return {
    id: s.id,
    dni: s.dni,
    nombre: s.nombre,
    genero: s.genero,
    correo: s.correo,
    celular: s.celular,
    direccion: s.direccion,
    distrito: s.distrito,
    provincia: s.provincia,
    departamento: s.departamento,
    profesion: s.profesion,
    marca: s.marca,
    programa: s.programa,
    programas_raw: s.programasRaw ?? "",
    anios_raw: s.aniosRaw ?? "",
    fecha_matricula: s.fechaMatricula || null,
    estado_pago: s.estadoPago,
    comprobante_url: s.comprobanteUrl,
    numero_compras: s.numeroCompras,
    recompro: s.recompro,
    score: s.score,
    nivel: s.nivel,
    factores: s.factores,
  };
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

  // Guarda/quita a una persona de Nova Nexus. Optimista: revierte si falla.
  // Devuelve true si se guardó correctamente.
  const cambiarMarca = async (id: string, marca: Brand): Promise<boolean> => {
    const previa = alumnos?.find((a) => a.id === id)?.marca;
    setAlumnos((prev) => (prev ? prev.map((a) => (a.id === id ? { ...a, marca } : a)) : prev));
    const { error: e } = await supabase.from("alumnos").update({ marca }).eq("id", id);
    if (e) {
      if (previa) {
        setAlumnos((prev) =>
          prev ? prev.map((a) => (a.id === id ? { ...a, marca: previa } : a)) : prev
        );
      }
      return false;
    }
    return true;
  };

  // Inserta/actualiza alumnos importados (upsert por id) y los suma a la lista local.
  const importarAlumnos = async (
    nuevos: Student[]
  ): Promise<{ ok: boolean; insertados: number; error?: string }> => {
    if (!nuevos.length) return { ok: true, insertados: 0 };
    for (let i = 0; i < nuevos.length; i += 500) {
      const lote = nuevos.slice(i, i + 500).map(toRow);
      const { error: e } = await supabase.from("alumnos").upsert(lote, { onConflict: "id" });
      if (e) return { ok: false, insertados: i, error: e.message };
    }
    setAlumnos((prev) => (prev ? [...nuevos, ...prev] : nuevos));
    return { ok: true, insertados: nuevos.length };
  };

  return { alumnos, error, cargando, cambiarMarca, importarAlumnos };
}
