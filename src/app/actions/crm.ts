"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

    throw new Error("Unauthorized: User not found in database");
  } catch (error) {
    console.error("Failed to get tenant ID:", error);
    throw error;
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
    console.error("Failed to get dashboard metrics:", error);
    return {
      totalLeads: 0,
      activeConversations: 0,
      waitingCS: 0,
      closingCount: 0,
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

    return leads.map((lead: any) => ({
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
    console.error("Failed to get leads:", error);
    return [];
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

    return conversations.map((c: any) => ({
      id: c.id,
      name: c.lead.contactName || "Unknown",
      phone: c.lead.phoneNumber,
      status: c.status,
      lastMessage: c.lastMessagePreview || "",
      time: c.lastMessageAt || c.updatedAt,
      unread: c.unreadCount,
      messages: c.messages.map((m: any) => ({
        id: m.id,
        content: m.content,
        direction: m.direction,
        timestamp: m.timestamp
      }))
    }));
  } catch (error) {
    console.error("Failed to get conversations:", error);
    return [];
  }
}

export async function getLeadById(id: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

    const lead = await prisma.lead.findUnique({
      where: { id, tenantId },
      include: {
        conversations: {
          include: {
            messages: {
              orderBy: { timestamp: "asc" }
            }
          },
          orderBy: { updatedAt: "desc" },
          take: 1
        }
      }
    });

    if (!lead) return null;

    return {
      id: lead.id,
      contactName: lead.contactName || "Unknown",
      phoneNumber: lead.phoneNumber,
      pipelineStage: lead.pipelineStage,
      eventType: lead.eventType,
      eventDate: lead.eventDate?.toISOString(),
      location: lead.location,
      venueName: lead.venueName,
      guestCount: lead.guestCount,
      lastInteraction: lead.lastInteraction?.toISOString() || lead.updatedAt.toISOString(),
      notes: lead.notes,
      createdAt: lead.createdAt.toISOString(),
      conversation: lead.conversations[0] || null
    };
  } catch (error) {
    console.error("Failed to get lead by id:", error);
    return null;
  }
}

export async function getRecentActivities() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

    const stageHistory = await prisma.stageHistory.findMany({
      where: { lead: { tenantId } },
      include: { lead: true },
      orderBy: { changedAt: "desc" },
      take: 5
    });

    const messages = await prisma.message.findMany({
      where: { conversation: { tenantId } },
      include: { conversation: { include: { lead: true } } },
      orderBy: { timestamp: "desc" },
      take: 5
    });

    const activities = [
      ...stageHistory.map(h => ({
        id: `stage_${h.id}`,
        type: "stage_change",
        title: `Stage diubah ke ${h.toStage}`,
        description: `Lead ${h.lead.contactName || h.lead.phoneNumber}`,
        timestamp: h.changedAt.toISOString()
      })),
      ...messages.map(m => ({
        id: `msg_${m.id}`,
        type: "message",
        title: m.direction === "INBOUND" ? "Pesan masuk" : "Pesan terkirim",
        description: `Lead ${m.conversation.lead.contactName || m.conversation.lead.phoneNumber}: ${m.content}`,
        timestamp: m.timestamp.toISOString()
      }))
    ];

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return activities.slice(0, 5);
  } catch (error) {
    console.error("Failed to get recent activities:", error);
    return [];
  }
}

export async function getKnowledgeDocuments() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

    const docs = await prisma.knowledgeDocument.findMany({
      where: { tenantId },
      orderBy: { uploadedAt: "desc" }
    });

    return docs.map((d: any) => ({
      id: d.id,
      fileName: d.fileName,
      fileType: d.fileType,
      fileSize: d.fileSize,
      status: d.status,
      chunkCount: d.chunkCount,
      uploadedAt: d.uploadedAt.toISOString(),
      indexedAt: d.indexedAt?.toISOString() || null,
    }));
  } catch (error) {
    console.error("Failed to get knowledge documents:", error);
    return [];
  }
}

export async function getFormSubmissions() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("No tenant");

    const forms = await prisma.formSubmission.findMany({
      where: { tenantId },
      orderBy: { submittedAt: "desc" }
    });

    return forms.map((f: any) => ({
      id: f.id,
      phoneNumber: f.phoneNumber,
      contactName: f.contactName,
      eventType: f.eventType,
      eventDate: f.eventDate?.toISOString() || null,
      location: f.location,
      venueName: f.venueName,
      guestCount: f.guestCount,
      isProcessed: f.isProcessed,
      submittedAt: f.submittedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to get form submissions:", error);
    return [];
  }
}

export async function getMeetingCount() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return 0;

    return await prisma.lead.count({
      where: { tenantId, pipelineStage: "MEETING" }
    });
  } catch (error) {
    console.error("Failed to get meeting count:", error);
    return 0;
  }
}
