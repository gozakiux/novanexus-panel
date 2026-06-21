import type { Student } from "../data/types";
import { IconExport, IconSegment } from "./icons";

interface Segment {
  nombre: string;
  desc: string;
  test: (s: Student) => boolean;
  tono: "pine" | "plum" | "clay" | "gold";
}

const SEGMENTS: Segment[] = [
  {
    nombre: "Candidatos TENCA",
    desc: "Nueva Sendas · propensión alta · aún no captados",
    tono: "plum",
    test: (s) => s.marca === "Nueva Sendas" && s.nivel === "Alto",
  },
  {
    nombre: "Profesionales de salud",
    desc: "Psicología, Medicina, Enfermería, Terapia",
    tono: "pine",
    test: (s) => ["Psicología", "Medicina", "Enfermería", "Terapia Ocupacional", "Counseling"].includes(s.profesion),
  },
  {
    nombre: "Recompradores",
    desc: "Llevaron 2 o más cursos",
    tono: "gold",
    test: (s) => s.numeroCompras >= 2,
  },
  {
    nombre: "Pago por validar",
    desc: "Matrícula con pago pendiente",
    tono: "clay",
    test: (s) => s.estadoPago === "Pendiente",
  },
  {
    nombre: "Lima top",
    desc: "Distritos de alta capacidad de pago",
    tono: "pine",
    test: (s) => ["Miraflores", "San Isidro", "Santiago de Surco", "La Molina", "San Borja"].includes(s.distrito),
  },
  {
    nombre: "Nova Nexus actuales",
    desc: "Ya inscritos en el Diplomado TENCA",
    tono: "plum",
    test: (s) => s.marca === "Nova Nexus",
  },
];

export function SegmentsView({ students }: { students: Student[] }) {
  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Activación</p>
          <h1 className="page-title">Segmentos para contactar</h1>
          <p className="page-sub">
            Grupos listos para campañas, seguimiento o invitación a Nova Nexus
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => alert("Abriría el constructor de segmentos a medida.")}>
          <IconSegment /> Nuevo segmento
        </button>
      </header>

      <div className="seg-grid">
        {SEGMENTS.map((seg) => {
          const matches = students.filter(seg.test);
          const validados = matches.filter((s) => s.estadoPago === "Validado").length;
          return (
            <article key={seg.nombre} className={`seg-card seg-${seg.tono}`}>
              <div className="seg-card-top">
                <h3>{seg.nombre}</h3>
                <span className="seg-count numeric">{matches.length}</span>
              </div>
              <p className="seg-desc">{seg.desc}</p>
              <div className="seg-meta">
                <span className="muted small">{validados} con pago validado</span>
              </div>
              <button
                className="btn btn-soft seg-export"
                onClick={() => alert(`Exportaría ${matches.length} alumnos del segmento "${seg.nombre}".`)}
              >
                <IconExport /> Exportar
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
