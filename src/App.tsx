import { useMemo, useState } from "react";
import { useAuth } from "./lib/useAuth";
import { useAlumnos } from "./lib/useAlumnos";
import { supabase } from "./lib/supabase";
import { Login } from "./components/Login";
import { Sidebar, type BrandFilter, type View } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { StudentsView } from "./components/StudentsView";
import { StudentProfile } from "./components/StudentProfile";
import { SegmentsView } from "./components/SegmentsView";
import { ImporterView } from "./components/ImporterView";

export function App() {
  const { session, cargando: authCargando } = useAuth();
  const { alumnos, error, cargando: dataCargando, cambiarMarca } = useAlumnos(!!session);

  const [view, setViewRaw] = useState<View>("inicio");
  const [brand, setBrand] = useState<BrandFilter>("Todas");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prefilter, setPrefilter] = useState<string | null>(null);

  const SOURCE = useMemo(() => alumnos ?? [], [alumnos]);

  const filtered = useMemo(
    () => (brand === "Todas" ? SOURCE : SOURCE.filter((s) => s.marca === brand)),
    [brand, SOURCE]
  );
  const selected = useMemo(
    () => (selectedId ? SOURCE.find((s) => s.id === selectedId) ?? null : null),
    [selectedId, SOURCE]
  );

  const setView = (v: View) => {
    setSelectedId(null);
    setPrefilter(null);
    setViewRaw(v);
  };
  const open = (id: string) => {
    setSelectedId(id);
    if (view !== "alumnos") setViewRaw("alumnos");
  };
  const goToSegment = (key: string) => {
    setSelectedId(null);
    setPrefilter(key);
    setViewRaw("alumnos");
  };

  if (authCargando) return <div className="boot">Cargando…</div>;
  if (!session) return <Login />;

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
      <Sidebar view={view} setView={setView} brand={brand} setBrand={setBrand} />

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
            <span className="data-pill is-real">
              <span className="data-pill-dot" />
              {dataCargando ? "Cargando…" : `${SOURCE.length.toLocaleString("es-PE")} alumnos`}
            </span>
            <span className="brand-pill">
              <span className="brand-pill-dot" />
              {brand === "Todas" ? "Todas las marcas" : brand}
            </span>
            <span className="user-chip">
              <span className="user-avatar">AD</span>
              <span className="user-name">{session.user.email}</span>
            </span>
            <button
              className="btn btn-ghost btn-logout"
              onClick={() => supabase.auth.signOut().catch((e) => console.error("Error al salir:", e))}
            >
              Salir
            </button>
          </div>
        </div>

        <div className="canvas">
          {dataCargando ? (
            <div className="boot-inline">Cargando alumnos desde Supabase…</div>
          ) : error ? (
            <div className="boot-inline error">No se pudieron cargar los alumnos: {error}</div>
          ) : (
            <>
              {view === "inicio" && (
                <Dashboard
                  students={filtered}
                  all={SOURCE}
                  onOpen={open}
                  onSegment={goToSegment}
                  isReal
                />
              )}
              {view === "alumnos" &&
                (selected ? (
                  <StudentProfile
                    student={selected}
                    onBack={() => setSelectedId(null)}
                    onGuardar={cambiarMarca}
                    isReal
                  />
                ) : (
                  <StudentsView
                    students={filtered}
                    onOpen={open}
                    isReal
                    prefilter={prefilter}
                    onClearPrefilter={() => setPrefilter(null)}
                  />
                ))}
              {view === "segmentos" && (
                <SegmentsView students={filtered} onSegment={goToSegment} />
              )}
              {view === "importar" && <ImporterView />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
