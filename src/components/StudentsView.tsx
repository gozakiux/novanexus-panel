import { useMemo, useState } from "react";
import type { Student } from "../data/types";
import { fechaCorta } from "../lib/format";
import { Avatar, BrandTag, NivelTag, PagoTag } from "./atoms";
import { ScoreBar } from "./ScoreRing";
import { IconExport, IconSearch } from "./icons";

const TODOS = "Todos";

function unique(students: Student[], key: (s: Student) => string): string[] {
  return [TODOS, ...[...new Set(students.map(key))].sort((a, b) => a.localeCompare(b))];
}

export function StudentsView({
  students,
  onOpen,
}: {
  students: Student[];
  onOpen: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [distrito, setDistrito] = useState(TODOS);
  const [profesion, setProfesion] = useState(TODOS);
  const [nivel, setNivel] = useState(TODOS);
  const [pago, setPago] = useState(TODOS);
  const [genero, setGenero] = useState(TODOS);

  const distritos = useMemo(() => unique(students, (s) => s.distrito), [students]);
  const profesiones = useMemo(() => unique(students, (s) => s.profesion), [students]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return students.filter((s) => {
      if (term && !`${s.nombre} ${s.dni} ${s.correo}`.toLowerCase().includes(term)) return false;
      if (distrito !== TODOS && s.distrito !== distrito) return false;
      if (profesion !== TODOS && s.profesion !== profesion) return false;
      if (nivel !== TODOS && s.nivel !== nivel) return false;
      if (pago !== TODOS && s.estadoPago !== pago) return false;
      if (genero !== TODOS && s.genero !== genero) return false;
      return true;
    });
  }, [students, q, distrito, profesion, nivel, pago, genero]);

  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Base de datos</p>
          <h1 className="page-title">Directorio de alumnos</h1>
          <p className="page-sub">
            {filtered.length} de {students.length} alumnos · clic en una fila para ver la ficha
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => alert("Exportaría la vista filtrada a Excel.")}>
          <IconExport /> Exportar a Excel
        </button>
      </header>

      <div className="filters">
        <label className="search">
          <IconSearch />
          <input
            placeholder="Buscar por nombre, DNI o correo…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <Select label="Distrito" value={distrito} setValue={setDistrito} opts={distritos} />
        <Select label="Profesión" value={profesion} setValue={setProfesion} opts={profesiones} />
        <Select label="Nivel" value={nivel} setValue={setNivel} opts={[TODOS, "Alto", "Medio", "Bajo"]} />
        <Select label="Pago" value={pago} setValue={setPago} opts={[TODOS, "Validado", "Pendiente", "Sin pago"]} />
        <Select label="Género" value={genero} setValue={setGenero} opts={[TODOS, "Femenino", "Masculino"]} />
      </div>

      <div className="card table-card">
        <table className="table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Profesión</th>
              <th>Distrito</th>
              <th>Matrícula</th>
              <th>Marca</th>
              <th>Pago</th>
              <th className="th-score">Propensión</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} onClick={() => onOpen(s.id)}>
                <td>
                  <div className="cell-name">
                    <Avatar nombre={s.nombre} marca={s.marca} size={34} />
                    <div>
                      <strong>{s.nombre}</strong>
                      <span className="muted small">{s.genero}</span>
                    </div>
                  </div>
                </td>
                <td>{s.profesion}</td>
                <td>{s.distrito}</td>
                <td className="muted">{fechaCorta(s.fechaMatricula)}</td>
                <td><BrandTag marca={s.marca} /></td>
                <td><PagoTag estado={s.estadoPago} /></td>
                <td>
                  <div className="cell-score">
                    <ScoreBar score={s.score} nivel={s.nivel} />
                    <NivelTag nivel={s.nivel} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty pad">Ningún alumno coincide con esos filtros.</div>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  setValue,
  opts,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  opts: string[];
}) {
  return (
    <label className="select">
      <span>{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
