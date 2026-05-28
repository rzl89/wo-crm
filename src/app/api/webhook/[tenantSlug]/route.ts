import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { tenantSlug: string } }
) {
  try {
    const tenantSlug = params.tenantSlug;
    
    // 1. Validasi Tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const body = await req.json();

    // 2. Parse Evolution API Payload (messages.upsert event)
    // Asumsi payload Evolution API v2
    if (body.event !== "messages.upsert" && !body.data) {
      return NextResponse.json({ success: true, message: "Ignored event" });
    }

    const msgData = body.data?.message;
    if (!msgData) return NextResponse.json({ success: true });

    const remoteJid = msgData.key?.remoteJid || "";
    // Hanya proses pesan dari user biasa (bukan grup atau status)
    if (!remoteJid.endsWith("@s.whatsapp.net")) {
      return NextResponse.json({ success: true, message: "Ignored group/status" });
    }

    const isFromMe = msgData.key?.fromMe;
    // Jangan proses pesan yang kita kirim sendiri kecuali untuk sync
    if (isFromMe) return NextResponse.json({ success: true });

    const waMessageId = msgData.key?.id;
    const pushName = msgData.pushName || "Unknown";
    
    // Ekstrak text (bisa di .conversation atau .extendedTextMessage.text)
    const textContent =
      msgData.message?.conversation ||
      msgData.message?.extendedTextMessage?.text ||
      "";
      
    if (!textContent) {
       return NextResponse.json({ success: true, message: "No text content" });
    }

    // Normalisasi Nomor Telepon (628xxx)
    const phoneNumber = remoteJid.split("@")[0];

    // 3. Upsert Lead (Bikin baru jika belum ada)
    const lead = await prisma.lead.upsert({
      where: {
        tenantId_phoneNumber: {
          tenantId: tenant.id,
          phoneNumber: phoneNumber,
        },
      },
      create: {
        tenantId: tenant.id,
        phoneNumber: phoneNumber,
        contactName: pushName,
        pipelineStage: "LEADS",
        lastInteraction: new Date(),
      },
      update: {
        contactName: pushName, // update nama jika berubah
        lastInteraction: new Date(),
      },
    });

    // 4. Cari atau buat Percakapan (Conversation) aktif
    let conversation = await prisma.conversation.findFirst({
      where: { tenantId: tenant.id, leadId: lead.id },
      orderBy: { createdAt: "desc" },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          tenantId: tenant.id,
          leadId: lead.id,
          status: "AI_HANDLING",
          lastMessageAt: new Date(),
          lastMessagePreview: textContent,
          unreadCount: 1,
        },
      });
    }

    // Cek duplikasi pesan berdasarkan waMessageId
    const existingMsg = await prisma.message.findFirst({
      where: { waMessageId },
    });

    if (!existingMsg) {
      // 5. Simpan Pesan Inbound
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          direction: "INBOUND",
          content: textContent,
          waMessageId: waMessageId,
          timestamp: new Date((msgData.messageTimestamp || Date.now() / 1000) * 1000),
        },
      });

      // 6. Cek trigger CS Handoff ("CS1")
      const isHandoffRequest = textContent.trim().toUpperCase() === "CS1";
      
      const newStatus = isHandoffRequest ? "WAITING_CS" : conversation.status;
      
      // Update metadata percakapan
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          status: newStatus,
          lastMessageAt: new Date(),
          lastMessagePreview: textContent,
          unreadCount: { increment: 1 },
        },
      });

      // TODO: Jika status masih AI_HANDLING, masukkan ke queue RAG AI processing
      // (Bisa memanggil endpoint /api/ai/process atau menggunakan Upstash QStash)
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
