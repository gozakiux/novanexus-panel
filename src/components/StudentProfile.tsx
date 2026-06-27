import type { ReactNode } from "react";
import type { Brand, Student } from "../data/types";
import { fechaLarga } from "../lib/format";
import { BrandTag, NivelTag, PagoTag } from "./atoms";
import { ScoreRing } from "./ScoreRing";
import { IconArrowLeft, IconExternal, IconSpark } from "./icons";

const DASH = "—";

export function StudentProfile({
  student,
  onBack,
  onGuardar,
  isReal = false,
}: {
  student: Student;
  onBack: () => void;
  onGuardar: (id: string, marca: Brand) => void;
  isReal?: boolean;
}) {
  const s = student;
  const maxImpact = Math.max(...s.factores.map((f) => Math.abs(f.impact)), 1);
  const esCandidato = s.marca === "Nueva Sendas" && s.nivel === "Alto";

  return (
    <div className="view rise">
      <button className="btn btn-ghost back" onClick={onBack}>
        <IconArrowLeft /> Volver al directorio
      </button>

      <header className={`profile-hero ${s.marca === "Nova Nexus" ? "hero-nexus" : "hero-sendas"}`}>
        <div className="profile-hero-main">
          <div className="profile-id">
            <span className="profile-avatar">
              {s.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}
            </span>
            <div>
              <p className="eyebrow light">{s.programa}</p>
              <h1>{s.nombre}</h1>
              <div className="profile-tags">
                <BrandTag marca={s.marca} />
                {isReal ? (
                  <>
                    <span className="tag tag-soft">
                      {s.numeroCompras} programa{s.numeroCompras > 1 ? "s" : ""}
                    </span>
                    {s.aniosRaw && <span className="tag tag-soft">{s.aniosRaw}</span>}
                  </>
                ) : (
                  <>
                    <span className="tag tag-soft">{s.profesion}</span>
                    <span className="tag tag-soft">{s.distrito}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="profile-score">
          <ScoreRing score={s.score} nivel={s.nivel} size={132} />
          <div className="profile-score-meta">
            <NivelTag nivel={s.nivel} />
            <span className="muted small">propensión a recomprar</span>
          </div>
        </div>
      </header>

      <div className="grid-profile">
        <section className="card pad">
          <div className="card-head">
            <h3>
              <span className="spark"><IconSpark /></span>
              ¿Por qué este puntaje?
            </h3>
          </div>
          <ul className="factors">
            {s.factores.map((f) => (
              <li key={f.label} className="factor">
                <span className="factor-label">{f.label}</span>
                <span className="factor-bar">
                  <span
                    className={`factor-fill ${f.impact >= 0 ? "pos" : "neg"}`}
                    style={{ width: `${(Math.abs(f.impact) / maxImpact) * 100}%` }}
                  />
                </span>
                <span className={`factor-num numeric ${f.impact >= 0 ? "pos" : "neg"}`}>
                  {f.impact >= 0 ? "+" : ""}
                  {f.impact}
                </span>
              </li>
            ))}
          </ul>
          {s.marca === "Nova Nexus" ? (
            <div className="cta-nexus guardado">
              <div>
                <strong>✓ Guardado en Nova Nexus</strong>
                <p className="muted small">Este alumno fue añadido al Diplomado TENCA.</p>
              </div>
              <button className="btn btn-soft" onClick={() => onGuardar(s.id, "Nueva Sendas")}>
                Quitar
              </button>
            </div>
          ) : (
            <div className="cta-nexus">
              <div>
                <strong>{esCandidato ? "Candidato ideal para Nova Nexus" : "¿Lo sumas a Nova Nexus?"}</strong>
                <p className="muted small">
                  {esCandidato
                    ? "Alta propensión a recomprar — buen perfil para el Diplomado TENCA."
                    : "Guárdalo para añadirlo al Diplomado TENCA de Nova Nexus."}
                </p>
              </div>
              <button className="btn btn-nexus" onClick={() => onGuardar(s.id, "Nova Nexus")}>
                Guardar para Nova Nexus
              </button>
            </div>
          )}
        </section>

        <div className="profile-cols">
          <DataCard title="Datos personales">
            <Row k="DNI / CE" v={s.dni || DASH} />
            <Row k="Género" v={s.genero || DASH} />
            <Row k="Correo" v={s.correo || DASH} />
            <Row k="Celular" v={s.celular || DASH} />
          </DataCard>

          {isReal ? (
            <DataCard title="Formación en Nueva Sendas">
              <Row k="Programas (historial)" v={s.programasRaw || s.programa || DASH} />
              <Row k="Años de matrícula" v={s.aniosRaw || DASH} />
              <Row k="N.° de programas" v={String(s.numeroCompras)} />
              <Row
                k="Recompra"
                v={
                  <span className={`tag ${s.recompro ? "tag-alto" : "tag-bajo"}`}>
                    {s.recompro ? "Sí, recompró" : "Una sola compra"}
                  </span>
                }
              />
            </DataCard>
          ) : (
            <DataCard title="Vivienda">
              <Row k="Dirección" v={s.direccion || DASH} />
              <Row k="Distrito" v={s.distrito || DASH} />
              <Row k="Provincia" v={s.provincia || DASH} />
              <Row k="Departamento" v={s.departamento || DASH} />
            </DataCard>
          )}

          <DataCard title="Matrícula y pago">
            <Row
              k={isReal ? "Primer año" : "Fecha de matrícula"}
              v={
                s.fechaMatricula
                  ? isReal
                    ? s.fechaMatricula.slice(0, 4)
                    : fechaLarga(s.fechaMatricula)
                  : DASH
              }
            />
            <Row k="Programa" v={s.programa || DASH} />
            <Row
              k="Estado de pago"
              v={s.estadoPago ? <PagoTag estado={s.estadoPago} /> : <span className="muted">Sin dato</span>}
            />
            <Row
              k="Comprobante"
              v={
                s.comprobanteUrl ? (
                  <a className="drive-link" href={s.comprobanteUrl} target="_blank" rel="noreferrer">
                    Ver en Drive <IconExternal />
                  </a>
                ) : (
                  <span className="muted">Sin comprobante</span>
                )
              }
            />
          </DataCard>
        </div>
      </div>
    </div>
  );
}

function DataCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card pad data-card">
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      <dl className="rows">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
