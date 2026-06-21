# Panel Nueva Sendas · Nova Nexus

Panel web interno para gestionar alumnos de **dos marcas en un solo sistema** y
detectar candidatos a recompra con un puntaje de propensión.

- **Nueva Sendas** — base existente (~6,500 alumnos importados desde Excel).
- **Nova Nexus** — marca nueva; se llena captando a los alumnos "top" de Nueva
  Sendas para el **Diplomado de Actualización en Terapia Familiar TENCA**.

> Estado actual: **MVP visual** con datos de ejemplo y puntaje por reglas
> (placeholder del modelo real). Aún no conectado a backend.

## Pantallas

1. **Inicio** — KPIs, matrículas por mes, distribución de propensión y mejores
   candidatos al Diplomado TENCA.
2. **Alumnos** — directorio con búsqueda y filtros (distrito, profesión, nivel,
   pago, género) y ficha individual.
3. **Ficha del alumno** — puntaje 0–100 explicado por factores, datos, vivienda,
   matrícula y enlace al comprobante en Drive.
4. **Importar base** — flujo de carga de `.xlsx` con emparejado de columnas.

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- Sistema de diseño propio en CSS (tokens, sin frameworks de UI)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción
```

## Decisiones de diseño

- **Género** se captura y permite filtrar, pero **se excluye del puntaje** para
  evitar sesgo.
- El puntaje usa: recompras previas, estado de pago, profesión afín a terapia,
  recencia de la matrícula y distrito.

## Pendiente (siguientes etapas)

- Backend en **Supabase** (base de datos + autenticación del equipo).
- Importador real del Excel de alumnos.
- **Modelo predictivo en Python** entrenado con el historial real de recompras.
- Despliegue web con acceso por login.
