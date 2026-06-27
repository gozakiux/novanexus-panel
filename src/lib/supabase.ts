import { createClient } from "@supabase/supabase-js";

// Estos valores son PUBLICOS por diseno: la clave "publishable"/anon va en el
// bundle del cliente a proposito. La seguridad real es RLS + login en Supabase.
// Las claves SECRETAS (service_role) NUNCA van aqui.
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://ksakxytijsexyhuscvjj.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_zL5zCRmoGpp6wnmEBourHg_uqNQtLTm";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
