# Panel Nueva Sendas · Nova Nexus

**🌐 En vivo (oficial):** https://novanexus-panel.pages.dev/

Panel web interno para gestionar alumnos de **dos marcas en un solo sistema**
(Nueva Sendas y Nova Nexus), con **login del equipo** y un puntaje de propensión
a recompra. Datos reales en Supabase, protegidos por login + RLS.

> Despliegue: cada `push` a `main` reconstruye y publica en **Cloudflare Pages**
> (integración Git). Esta es la URL oficial.

## Qué hace

- **Login** del equipo (Supabase Auth). El panel solo se ve tras iniciar sesión.
- **Directorio** de ~6,500 alumnos reales (desde Supabase) con búsqueda (nombre,
  correo, celular, DNI) y filtros (nivel, recompra).
- **Ficha** por alumno: puntaje explicado, programas, años, contacto.
- **Puntaje de propensión** a recomprar (reglas; base para un modelo futuro).
- **Segmentos** clicables (candidatos, recompradores, contactables…) con
  exportación a CSV.
- **Guardar en Nova Nexus**: marca candidatos para el Diplomado TENCA (persiste
  en Supabase).
- **Importar base**: sube un `.xlsx`, detecta columnas, calcula puntaje e inserta
  en Supabase con upsert (sin duplicar a quienes ya están).

## Stack

- Vite + React 18 + TypeScript; sistema de diseño propio en CSS.
- **Supabase** (Postgres + Auth) — datos reales protegidos por RLS.
- Lectura de Excel con SheetJS (`xlsx`), cargado en un chunk aparte (lazy).
- Hosting: **Cloudflare Pages** (`public/_headers` define seguridad y caché).

## Datos y seguridad

- La PII de los alumnos **vive en Supabase**, no en el repo ni en el bundle.
- Acceso por **login**; las políticas **RLS** controlan quién lee/escribe.
- En el cliente solo va la clave **publishable** (pública por diseño). Las claves
  **secretas** nunca se versionan: públicas en `.env.example`, secretas en
  `.env.server.example` (solo para scripts locales de `tools/`).

## Desarrollo

```bash
cp .env.example .env.local    # completa las claves públicas (VITE_*)
npm install
npm run dev                   # http://localhost:5173
npm run build                 # build de producción
```

## Estructura

- `src/` — app: componentes, hooks (`useAuth`, `useAlumnos`), `lib/`.
- `public/_headers` — headers de seguridad (CSP, X-Frame-Options…) y caché.
- `tools/` — scripts locales (carga inicial, importación). **Gitignored.**

## Pendiente

- Endurecer **RLS** para limitar por rol quién lee/exporta/edita (no solo
  "authenticated").
- Tests automatizados y ESLint.
- Modelo de scoring entrenado en Python con el historial real de recompras.
