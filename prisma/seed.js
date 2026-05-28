const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({})

async function main() {
  // Bikin tenant demo
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-tenant' },
    update: {},
    create: {
      name: 'Demo Tenant',
      slug: 'demo-tenant',
      industry: 'RETAIL',
      timezone: 'Asia/Jakarta',
    },
  })

  // Bikin user demo
  const user = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      name: 'Admin Demo',
      role: 'ADMIN',
      tenantId: tenant.id,
      supabaseUid: 'placeholder-uid',
    },
  })

  // Bikin lead demo
  const lead = await prisma.lead.upsert({
    where: {
      tenantId_phoneNumber: {
        tenantId: tenant.id,
        phoneNumber: '6281234567890',
      },
    },
    update: {},
    create: {
      tenantId: tenant.id,
      phoneNumber: '6281234567890',
      contactName: 'Budi Santoso',
      pipelineStage: 'LEADS',
      tags: ['warm', 'promo'],
      notes: 'Tertarik dengan produk A',
    },
  })

  // Bikin percakapan demo
  const conv = await prisma.conversation.create({
    data: {
      tenantId: tenant.id,
      leadId: lead.id,
      status: 'AI_HANDLING',
      lastMessagePreview: 'Halo, saya mau tanya harga',
    },
  })

  // Bikin pesan inbound
  await prisma.message.create({
    data: {
      conversationId: conv.id,
      direction: 'INBOUND',
      content: 'Halo, saya mau tanya harga',
      waMessageId: 'msg-12345',
    },
  })

  // Bikin pesan outbound AI
  await prisma.message.create({
    data: {
      conversationId: conv.id,
      direction: 'OUTBOUND',
      content: 'Halo Budi! Harga produk A adalah Rp 100.000. Ada yang bisa saya bantu?',
      waMessageId: 'msg-12346',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
