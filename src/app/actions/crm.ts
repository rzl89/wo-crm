"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { mockLeads, mockMetrics, mockConversations } from "@/lib/mock-data";

// Helper function to get current Tenant ID from Auth Session
async function getTenantId() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseUid: user.id },
        select: { tenantId: true }
      });
      if (dbUser) return dbUser.tenantId;
    }

    const fallback = await prisma.tenant.findFirst();
    return fallback?.id || "";
  } catch (error) {
    console.error("Database not connected yet", error);
    return null;
  }
}

export async function getDashboardMetrics() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

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
  } catch (error) {
    // Fallback to mock data if database is not connected
    return {
      totalLeads: (mockMetrics as any).totalLeads || (mockMetrics as any).leadsCount || 0,
      activeConversations: mockMetrics.activeConversations,
      waitingCS: mockMetrics.waitingCS,
      closingCount: (mockMetrics as any).closingCount || 0,
    };
  }
}

export async function getLeads(search?: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

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

    return leads.map(lead => ({
      id: lead.id,
      name: lead.contactName || "Unknown",
      phone: lead.phoneNumber,
      status: lead.pipelineStage,
      lastActive: lead.lastInteraction || lead.updatedAt,
      tags: (lead as any).tags || [],
      unread: 0,
      convStatus: lead.conversations[0]?.status || "AI_HANDLING"
    }));
  } catch (error) {
    return mockLeads;
  }
}

export async function getConversations() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

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

    return conversations.map(c => ({
      id: c.id,
      name: c.lead.contactName || "Unknown",
      phone: c.lead.phoneNumber,
      status: c.status,
      lastMessage: c.lastMessagePreview || "",
      time: c.lastMessageAt || c.updatedAt,
      unread: c.unreadCount,
      messages: c.messages.map(m => ({
        id: m.id,
        content: m.content,
        direction: m.direction,
        timestamp: m.timestamp
      }))
    }));
  } catch (error) {
    return mockConversations;
  }
}
