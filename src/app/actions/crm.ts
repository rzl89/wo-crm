"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// Helper function to get current Tenant ID from Auth Session
async function getTenantId() {
  // TODO: Implement get tenantId from Supabase Auth user metadata
  // For now, return a placeholder or the first tenant for development
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    // Return user.user_metadata.tenantId
    const dbUser = await prisma.user.findUnique({
      where: { supabaseUid: user.id },
      select: { tenantId: true }
    });
    if (dbUser) return dbUser.tenantId;
  }

  // Fallback to first tenant for Phase 2 development demo if no auth
  const fallback = await prisma.tenant.findFirst();
  return fallback?.id || "";
}

export async function getDashboardMetrics() {
  const tenantId = await getTenantId();
  if (!tenantId) return null;

  const totalLeads = await prisma.lead.count({ where: { tenantId } });
  const activeConversations = await prisma.conversation.count({
    where: { tenantId, status: { not: "RESOLVED" } }
  });
  const waitingCS = await prisma.conversation.count({
    where: { tenantId, status: "WAITING_CS" }
  });
  const closingCount = await prisma.lead.count({
    where: { tenantId, pipelineStage: "CLOSING" }
  });

  return {
    totalLeads,
    activeConversations,
    waitingCS,
    closingCount,
  };
}

export async function getLeads(search?: string) {
  const tenantId = await getTenantId();
  if (!tenantId) return [];

  const leads = await prisma.lead.findMany({
    where: {
      tenantId,
      ...(search ? {
        OR: [
          { contactName: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } }
        ]
      } : {})
    },
    orderBy: { updatedAt: "desc" },
    include: {
      conversations: {
        select: { status: true },
        orderBy: { updatedAt: "desc" },
        take: 1
      }
    }
  });

  return leads;
}

export async function getConversations() {
  const tenantId = await getTenantId();
  if (!tenantId) return [];

  const conversations = await prisma.conversation.findMany({
    where: { tenantId },
    orderBy: { updatedAt: "desc" },
    include: {
      lead: true,
      messages: {
        orderBy: { timestamp: "asc" }
      }
    }
  });

  return conversations;
}
