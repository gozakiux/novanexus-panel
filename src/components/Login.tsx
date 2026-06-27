import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../lib/supabase";

export function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const u = usuario.trim();
    const email = u.includes("@") ? u : `${u}@novanexus.pe`;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Usuario o contraseña incorrectos.");
      setCargando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <span className="glyph"><span className="a" /><span className="b" /></span>
          <span>
            <strong>Sendas·Nexus</strong>
            <small>Panel de alumnos</small>
          </span>
        </div>
        <h1 className="login-title">Inicia sesión</h1>
        <p className="login-sub">Acceso del equipo · Nueva Sendas / Nova Nexus</p>
        <form className="login-form" onSubmit={onSubmit}>
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              placeholder="admin"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="contraseña"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" type="submit" disabled={cargando}>
            {cargando ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="login-foot">Tus datos están protegidos. Solo el equipo autorizado entra.</p>
      </div>
    </div>
  );
}
