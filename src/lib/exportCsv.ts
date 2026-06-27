import type { Student } from "../data/types";

/** Descarga un CSV (abrible en Excel) con las columnas útiles de un grupo de alumnos. */
export function exportarAlumnosCSV(nombre: string, filas: Student[]): void {
  try {
    const cab = ["Nombre", "Correo", "Celular", "Programas", "Anios", "N programas", "Puntaje", "Nivel", "Marca"];
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const lineas = [cab.map(esc).join(",")];
    for (const s of filas) {
      lineas.push(
        [
          s.nombre,
          s.correo,
          s.celular,
          s.programasRaw || s.programa,
          s.aniosRaw ?? "",
          String(s.numeroCompras),
          String(s.score),
          s.nivel,
          s.marca,
        ]
          .map(esc)
          .join(",")
      );
    }
    const blob = new Blob(["﻿" + lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre.toLowerCase().replace(/\s+/g, "-")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch {
    alert("No se pudo generar el archivo. Intenta de nuevo.");
  }
}
