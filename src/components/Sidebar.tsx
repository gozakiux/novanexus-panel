import type { Brand } from "../data/types";
import { IconHome, IconPeople, IconSegment, IconUpload } from "./icons";

export type View = "inicio" | "alumnos" | "segmentos" | "importar";
export type BrandFilter = "Todas" | Brand;

const NAV: { id: View; label: string; icon: () => JSX.Element }[] = [
  { id: "inicio", label: "Inicio", icon: () => <IconHome /> },
  { id: "alumnos", label: "Alumnos", icon: () => <IconPeople /> },
  { id: "segmentos", label: "Segmentos", icon: () => <IconSegment /> },
  { id: "importar", label: "Importar base", icon: () => <IconUpload /> },
];

export function Sidebar({
  view,
  setView,
  brand,
  setBrand,
}: {
  view: View;
  setView: (v: View) => void;
  brand: BrandFilter;
  setBrand: (b: BrandFilter) => void;
}) {
  const brands: BrandFilter[] = ["Todas", "Nueva Sendas", "Nova Nexus"];
  return (
    <aside className="sidebar">
      <div className="brandmark">
        <div className="brandmark-glyph">
          <span className="bg-a" />
          <span className="bg-b" />
        </div>
        <div className="brandmark-text">
          <strong>Sendas·Nexus</strong>
          <small>Panel de alumnos</small>
        </div>
      </div>

      <div className="brand-switch">
        <span className="brand-switch-label">Marca activa</span>
        <div className="brand-switch-opts">
          {brands.map((b) => (
            <button
              key={b}
              className={`brand-switch-btn ${brand === b ? "is-on" : ""} ${
                b === "Nova Nexus" ? "is-nexus" : b === "Nueva Sendas" ? "is-sendas" : ""
              }`}
              onClick={() => setBrand(b)}
            >
              {b === "Todas" ? "Todas" : b === "Nueva Sendas" ? "N. Sendas" : "N. Nexus"}
            </button>
          ))}
        </div>
      </div>

      <nav className="nav">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={`nav-item ${view === n.id ? "is-active" : ""}`}
            onClick={() => setView(n.id)}
          >
            <span className="nav-icon">{n.icon()}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="model-card">
          <span className="model-dot" />
          <div>
            <strong>Modelo de propensión</strong>
            <small>Activo · v0.1 (reglas)</small>
          </div>
        </div>
        <p className="sidebar-note">
          Demo con datos de ejemplo. El modelo definitivo se entrena en Python con tu
          historial real de recompras.
        </p>
      </div>
    </aside>
  );
}
