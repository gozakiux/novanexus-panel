import { useMemo, useState } from "react";
import { STUDENTS } from "./data/seed";
import { Sidebar, type BrandFilter, type View } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { StudentsView } from "./components/StudentsView";
import { StudentProfile } from "./components/StudentProfile";
import { SegmentsView } from "./components/SegmentsView";
import { ImporterView } from "./components/ImporterView";

export function App() {
  const [view, setView] = useState<View>("inicio");
  const [brand, setBrand] = useState<BrandFilter>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (brand === "Todas" ? STUDENTS : STUDENTS.filter((s) => s.marca === brand)),
    [brand]
  );

  const selected = selectedId ? STUDENTS.find((s) => s.id === selectedId) ?? null : null;

  const open = (id: string) => {
    setSelectedId(id);
    if (view !== "alumnos") setView("alumnos");
  };

  const title =
    view === "inicio"
      ? "Inicio"
      : view === "alumnos"
        ? "Alumnos"
        : view === "segmentos"
          ? "Segmentos"
          : "Importar";

  return (
    <div className="app">
      <Sidebar
        view={view}
        setView={(v) => {
          setSelectedId(null);
          setView(v);
        }}
        brand={brand}
        setBrand={setBrand}
      />

      <main className="main">
        <div className="topbar">
          <div className="crumbs">
            <span className="muted">Panel</span>
            <span className="crumb-sep">/</span>
            <span>{title}</span>
            {selected && view === "alumnos" && (
              <>
                <span className="crumb-sep">/</span>
                <span className="muted">{selected.nombre}</span>
              </>
            )}
          </div>
          <div className="topbar-right">
            <span className="brand-pill">
              <span className="brand-pill-dot" />
              {brand === "Todas" ? "Todas las marcas" : brand}
            </span>
            <span className="user-chip">
              <span className="user-avatar">NS</span>
              <span className="user-name">Equipo Sendas</span>
            </span>
          </div>
        </div>

        <div className="canvas">
          {view === "inicio" && (
            <Dashboard students={filtered} all={STUDENTS} onOpen={open} />
          )}
          {view === "alumnos" &&
            (selected ? (
              <StudentProfile student={selected} onBack={() => setSelectedId(null)} />
            ) : (
              <StudentsView students={filtered} onOpen={open} />
            ))}
          {view === "segmentos" && <SegmentsView students={filtered} />}
          {view === "importar" && <ImporterView />}
        </div>
      </main>
    </div>
  );
}
