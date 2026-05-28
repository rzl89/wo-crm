"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

export function AuthProvider({ 
  children, 
  user, 
  tenant 
}: { 
  children: React.ReactNode;
  user: any;
  tenant: any;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const setTenant = useAuthStore((s) => s.setTenant);

  useEffect(() => {
    setUser(user);
    setTenant(tenant);
  }, [user, tenant, setUser, setTenant]);

  // Hook realtime for this tenant
  useRealtimeSync(tenant?.id);

  return <>{children}</>;
}
