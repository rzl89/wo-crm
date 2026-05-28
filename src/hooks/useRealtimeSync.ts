"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useNotifStore } from "@/stores";
import { useRouter } from "next/navigation";

export function useRealtimeSync(tenantId: string) {
  const router = useRouter();
  const setWaitingCS = useNotifStore((s) => s.setWaitingCS);

  useEffect(() => {
    if (!tenantId) return;

    const supabase = createClient();

    // Subscribe to Conversation changes for this tenant
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Conversation',
          filter: `tenantId=eq.${tenantId}`,
        },
        (payload) => {
          console.log('Conversation change received!', payload);
          // Refresh the current route to fetch new data via server actions
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
        },
        (payload) => {
          // You could be more specific and check if the message belongs to this tenant's conversation
          console.log('Message change received!', payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId, router]);
}
