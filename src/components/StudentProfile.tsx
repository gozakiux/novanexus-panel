import type { Student } from "../data/types";
import { fechaLarga } from "../lib/format";
import { BrandTag, NivelTag, PagoTag } from "./atoms";
import { ScoreRing } from "./ScoreRing";
import { IconArrowLeft, IconExternal, IconSpark } from "./icons";

export function StudentProfile({ student, onBack }: { student: Student; onBack: () => void }) {
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
            <span className="profile-avatar">{s.nombre.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
            <div>
              <p className="eyebrow light">{s.programa}</p>
              <h1>{s.nombre}</h1>
              <div className="profile-tags">
                <BrandTag marca={s.marca} />
                <span className="tag tag-soft">{s.profesion}</span>
                <span className="tag tag-soft">{s.distrito}</span>
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
            {s.factores.map((f, i) => (
              <li key={i} className="factor">
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
          {esCandidato && (
            <div className="cta-nexus">
              <div>
                <strong>Candidato ideal para Nova Nexus</strong>
                <p className="muted small">
                  Alta propensión y perfil afín al Diplomado TENCA.
                </p>
              </div>
              <button className="btn btn-nexus" onClick={() => alert(`${s.nombre} marcado para invitación a Nova Nexus.`)}>
                Invitar al Diplomado TENCA
              </button>
            </div>
          )}
        </section>

        <div className="profile-cols">
          <DataCard title="Datos personales">
            <Row k="DNI / CE" v={s.dni} />
            <Row k="Género" v={s.genero} />
            <Row k="Correo" v={s.correo} />
            <Row k="Celular" v={s.celular} />
          </DataCard>

          <DataCard title="Vivienda">
            <Row k="Dirección" v={s.direccion} />
            <Row k="Distrito" v={s.distrito} />
            <Row k="Provincia" v={s.provincia} />
            <Row k="Departamento" v={s.departamento} />
          </DataCard>

          <DataCard title="Matrícula y pago">
            <Row k="Fecha de matrícula" v={fechaLarga(s.fechaMatricula)} />
            <Row k="Programa" v={s.programa} />
            <Row k="N.° de compras" v={String(s.numeroCompras)} />
            <Row
              k="Estado de pago"
              v={<PagoTag estado={s.estadoPago} />}
            />
            <Row
              k="Comprobante"
              v={
                <a className="drive-link" href={s.comprobanteUrl} target="_blank" rel="noreferrer">
                  Ver en Drive <IconExternal />
                </a>
              }
            />
          </DataCard>
        </div>
      </div>
    </div>
  );
}

function DataCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card pad data-card">
      <div className="card-head">
        <h3>{title}</h3>
      </div>
      <dl className="rows">{children}</dl>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="row">
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
