import type { Student } from "../data/types";
import { IconExport } from "./icons";
import { exportarAlumnosCSV } from "../lib/exportCsv";

interface Segment {
  nombre: string;
  desc: string;
  key: string;
  tono: "pine" | "plum" | "clay" | "gold";
  test: (s: Student) => boolean;
}

const SEGMENTS: Segment[] = [
  {
    nombre: "Candidatos a Nova Nexus",
    desc: "Propensión alta — los mejores para el Diplomado TENCA",
    key: "alto",
    tono: "plum",
    test: (s) => s.marca === "Nueva Sendas" && s.nivel === "Alto",
  },
  {
    nombre: "Recompradores",
    desc: "Llevaron 2 o más programas",
    key: "recompradores",
    tono: "gold",
    test: (s) => s.recompro,
  },
  {
    nombre: "Muy recurrentes",
    desc: "Llevaron 3 o más programas",
    key: "recurrentes",
    tono: "pine",
    test: (s) => s.numeroCompras >= 3,
  },
  {
    nombre: "Contactables por correo",
    desc: "Tienen correo para campañas",
    key: "con-correo",
    tono: "pine",
    test: (s) => s.correo.includes("@"),
  },
  {
    nombre: "Sin correo",
    desc: "Solo se les contacta por teléfono",
    key: "sin-correo",
    tono: "clay",
    test: (s) => !s.correo.includes("@"),
  },
  {
    nombre: "Guardados en Nova Nexus",
    desc: "Ya añadidos al Diplomado TENCA",
    key: "nova-nexus",
    tono: "plum",
    test: (s) => s.marca === "Nova Nexus",
  },
];

export function SegmentsView({
  students,
  onSegment,
}: {
  students: Student[];
  onSegment: (key: string) => void;
}) {
  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Activación</p>
          <h1 className="page-title">Segmentos para contactar</h1>
          <p className="page-sub">
            Haz clic en un grupo para ver a esas personas, o expórtalo a Excel
          </p>
        </div>
      </header>

      <div className="seg-grid">
        {SEGMENTS.map((seg) => {
          const matches = students.filter(seg.test);
          return (
            <article
              key={seg.key}
              className={`seg-card seg-${seg.tono}`}
              tabIndex={0}
              role="button"
              onClick={() => onSegment(seg.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSegment(seg.key);
                }
              }}
            >
              <div className="seg-card-top">
                <h3>{seg.nombre}</h3>
                <span className="seg-count numeric">{matches.length.toLocaleString("es-PE")}</span>
              </div>
              <p className="seg-desc">{seg.desc}</p>
              <div className="seg-actions">
                <span className="seg-ver">Ver personas →</span>
                <button
                  className="btn btn-soft seg-export"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportarAlumnosCSV(seg.nombre, matches);
                  }}
                >
                  <IconExport /> Exportar
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
