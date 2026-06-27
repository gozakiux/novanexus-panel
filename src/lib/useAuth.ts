import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vivo = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (vivo) setSession(data.session);
      })
      .catch(() => {})
      .finally(() => {
        if (vivo) setCargando(false);
      });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (vivo) {
        setSession(s);
        setCargando(false);
      }
    });
    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, cargando };
}
