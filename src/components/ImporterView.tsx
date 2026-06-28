import { useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Student } from "../data/types";
import { parseExcel } from "../lib/importExcel";
import type { ResultadoParseo } from "../lib/importExcel";
import { IconUpload } from "./icons";

export function ImporterView({
  existentes,
  onImportar,
}: {
  existentes: Student[];
  onImportar: (nuevos: Student[]) => Promise<{ ok: boolean; insertados: number; error?: string }>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState("");
  const [parseando, setParseando] = useState(false);
  const [res, setRes] = useState<ResultadoParseo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);
  const [hecho, setHecho] = useState<number | null>(null);

  const emails = useMemo(() => new Set(existentes.map((s) => s.correo).filter(Boolean)), [existentes]);
  const nombres = useMemo(() => new Set(existentes.map((s) => s.nombre.toLowerCase())), [existentes]);

  const nuevos = useMemo(() => {
    if (!res) return [];
    return res.alumnos.filter((a) =>
      a.correo ? !emails.has(a.correo) : !nombres.has(a.nombre.toLowerCase())
    );
  }, [res, emails, nombres]);

  async function alElegir(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setHecho(null);
    setRes(null);
    setArchivo(file.name);
    setParseando(true);
    try {
      const buf = await file.arrayBuffer();
      setRes(await parseExcel(buf));
    } catch {
      setError("No pudimos leer el archivo. Asegúrate de que sea un .xlsx válido.");
    } finally {
      setParseando(false);
    }
  }

  async function importar() {
    setImportando(true);
    setError(null);
    const r = await onImportar(nuevos);
    setImportando(false);
    if (r.ok) setHecho(r.insertados);
    else setError(`Se importaron ${r.insertados}, pero hubo un error: ${r.error}`);
  }

  const yaExisten = res ? res.alumnos.length - nuevos.length : 0;

  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Carga de datos</p>
          <h1 className="page-title">Importar base de Excel</h1>
          <p className="page-sub">
            Sube tu .xlsx; detectamos las columnas, descartamos lo que ya existe e importamos el resto a Supabase
          </p>
        </div>
      </header>

      <div className="grid-import">
        <section className="card dropzone">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            style={{ display: "none" }}
            onChange={alElegir}
          />
          <div className="dropzone-inner">
            <span className="dropzone-icon">
              <IconUpload size={26} />
            </span>
            <strong>Sube tu base de alumnos</strong>
            <p className="muted small">Archivo .xlsx — leemos la hoja con más filas</p>
            <button className="btn btn-soft" onClick={() => inputRef.current?.click()}>
              Elegir archivo
            </button>
            {archivo && (
              <div className="file-chip">
                <span className="file-dot" /> {archivo}
              </div>
            )}
          </div>
        </section>

        <section className="card pad">
          {!res && !parseando && !error && (
            <div className="boot-inline">Elige un archivo para empezar.</div>
          )}
          {parseando && <div className="boot-inline">Leyendo el archivo…</div>}
          {error && <div className="boot-inline error">{error}</div>}

          {res && (
            <>
              <div className="card-head">
                <h3>Columnas detectadas</h3>
                <span className="muted">{res.totalFilas.toLocaleString("es-PE")} filas leídas</span>
              </div>
              <table className="map-table">
                <thead>
                  <tr>
                    <th>Campo del sistema</th>
                    <th>Columna del Excel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {res.columnas.map((m) => (
                    <tr key={m.campo}>
                      <td>{m.campo}</td>
                      <td className={m.excel ? "numeric-col" : "muted"}>
                        {m.excel ?? "— no encontrada —"}
                      </td>
                      <td>
                        <span className={`map-flag ${m.excel ? "ok" : "warn"}`}>
                          {m.excel ? "Mapeada" : "Falta"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="import-resumen">
                <strong className="numeric">{nuevos.length.toLocaleString("es-PE")}</strong> nuevos para importar ·{" "}
                {yaExisten.toLocaleString("es-PE")} ya existen ·{" "}
                {res.descartadas.toLocaleString("es-PE")} descartados
              </p>

              {hecho !== null ? (
                <div className="import-ok">
                  ✓ {hecho.toLocaleString("es-PE")} alumnos importados a Supabase.
                </div>
              ) : (
                <div className="import-foot">
                  <p className="muted small">
                    Se agregan como Nueva Sendas, con su puntaje calculado. No se duplican los que ya están.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={importar}
                    disabled={importando || nuevos.length === 0}
                  >
                    {importando ? "Importando…" : `Importar ${nuevos.length.toLocaleString("es-PE")} alumnos`}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
