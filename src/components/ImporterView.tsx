import { IconUpload } from "./icons";

const MAPEO = [
  { excel: "NOMBRES Y APELLIDOS", campo: "Nombre completo", ok: true },
  { excel: "DNI", campo: "DNI / CE", ok: true },
  { excel: "SEXO", campo: "Género", ok: true },
  { excel: "CORREO", campo: "Correo", ok: true },
  { excel: "CELULAR", campo: "Celular", ok: true },
  { excel: "DISTRITO", campo: "Distrito", ok: true },
  { excel: "PROFESION", campo: "Profesión", ok: true },
  { excel: "FECHA PAGO", campo: "Fecha de matrícula", ok: true },
  { excel: "LINK VOUCHER", campo: "Comprobante (Drive)", ok: true },
  { excel: "N CURSOS", campo: "N.° de compras", ok: true },
  { excel: "OBSERVACIONES", campo: "— sin asignar —", ok: false },
];

export function ImporterView() {
  return (
    <div className="view rise">
      <header className="page-head">
        <div>
          <p className="eyebrow">Carga de datos</p>
          <h1 className="page-title">Importar base de Excel</h1>
          <p className="page-sub">
            Sube tu archivo .xlsx una vez, empareja las columnas y el sistema crea o actualiza los registros
          </p>
        </div>
      </header>

      <ol className="steps">
        <li className="step is-done"><span>1</span> Subir archivo</li>
        <li className="step is-current"><span>2</span> Emparejar columnas</li>
        <li className="step"><span>3</span> Validar</li>
        <li className="step"><span>4</span> Importar</li>
      </ol>

      <div className="grid-import">
        <section className="card dropzone">
          <div className="dropzone-inner">
            <span className="dropzone-icon"><IconUpload size={26} /></span>
            <strong>Arrastra tu base aquí</strong>
            <p className="muted small">o haz clic para elegir un archivo .xlsx (máx. 10 MB)</p>
            <button className="btn btn-soft" onClick={() => alert("Aquí se abriría el selector de archivos.")}>
              Elegir archivo
            </button>
            <div className="file-chip">
              <span className="file-dot" /> base_nueva_sendas_2026.xlsx · 6,512 filas
            </div>
          </div>
        </section>

        <section className="card pad">
          <div className="card-head">
            <h3>Emparejado de columnas</h3>
            <span className="muted">10 de 11 reconocidas</span>
          </div>
          <table className="map-table">
            <thead>
              <tr>
                <th>Columna del Excel</th>
                <th>Campo del sistema</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {MAPEO.map((m) => (
                <tr key={m.excel}>
                  <td className="numeric-col">{m.excel}</td>
                  <td className={m.ok ? "" : "muted"}>{m.campo}</td>
                  <td>
                    <span className={`map-flag ${m.ok ? "ok" : "warn"}`}>
                      {m.ok ? "Emparejada" : "Ignorar"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="import-foot">
            <p className="muted small">
              Se detectaron <strong>6,512 alumnos</strong> · 0 duplicados por DNI · 18 fechas a revisar.
            </p>
            <button className="btn btn-primary" onClick={() => alert("Validaría e importaría los 6,512 registros.")}>
              Validar e importar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
