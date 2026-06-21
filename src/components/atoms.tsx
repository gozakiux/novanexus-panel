import type { Brand, EstadoPago, Nivel } from "../data/types";
import { iniciales } from "../lib/format";

export function Avatar({ nombre, marca, size = 38 }: { nombre: string; marca: Brand; size?: number }) {
  const isNexus = marca === "Nova Nexus";
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: isNexus
          ? "linear-gradient(140deg, var(--plum), var(--plum-deep))"
          : "linear-gradient(140deg, var(--pine), var(--pine-deep))",
      }}
      aria-hidden
    >
      {iniciales(nombre)}
    </span>
  );
}

export function BrandTag({ marca }: { marca: Brand }) {
  const isNexus = marca === "Nova Nexus";
  return (
    <span className={`tag ${isNexus ? "tag-nexus" : "tag-sendas"}`}>
      <span className="dot" />
      {marca}
    </span>
  );
}

export function NivelTag({ nivel }: { nivel: Nivel }) {
  const cls = nivel === "Alto" ? "tag-alto" : nivel === "Medio" ? "tag-medio" : "tag-bajo";
  return <span className={`tag ${cls}`}>{nivel}</span>;
}

export function PagoTag({ estado }: { estado: EstadoPago }) {
  const cls =
    estado === "Validado"
      ? "tag-pago-validado"
      : estado === "Pendiente"
        ? "tag-pago-pendiente"
        : "tag-pago-sin";
  return <span className={`tag ${cls}`}>{estado}</span>;
}

export function KPI({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "pine" | "plum" | "clay" | "gold";
}) {
  return (
    <article className={`kpi kpi-${accent ?? "pine"}`}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value numeric">{value}</span>
      {hint && <span className="kpi-hint">{hint}</span>}
    </article>
  );
}
