// Mock data simulating the Google Sheets CRM & Supabase DB from the n8n workflow
// This will be replaced with real API calls later

export type Stage = "LEADS" | "MEETING" | "CLOSING";
export type ConvStatus = "AI_HANDLING" | "WAITING_CS" | "CS_HANDLING" | "RESOLVED";
export type Direction = "INBOUND" | "OUTBOUND";
export type DocStatus = "PROCESSING" | "INDEXED" | "FAILED";

export interface Lead {
  id: string;
  phoneNumber: string;
  contactName: string;
  eventType: string;
  eventDate: string;
  location: string;
  venueName: string;
  guestCount: number;
  pipelineStage: Stage;
  lastInteraction: string;
  notes: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  lead: Lead;
  status: ConvStatus;
  assignedTo: string | null;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
  messages: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  direction: Direction;
  content: string;
  mediaUrls: string[];
  isRead: boolean;
  timestamp: string;
}

export interface KnowledgeDoc {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: DocStatus;
  chunkCount: number | null;
  uploadedAt: string;
  indexedAt: string | null;
}

export interface Activity {
  id: string;
  type: "message" | "stage_change" | "form_submit" | "handoff";
  title: string;
  description: string;
  timestamp: string;
  meta?: Record<string, string>;
}

// ──────────────────────────────────────────
// LEADS DATA
// ──────────────────────────────────────────
export const mockLeads: Lead[] = [
  {
    id: "lead-001",
    phoneNumber: "6281234567890",
    contactName: "Anisa Rahma",
    eventType: "Pernikahan",
    eventDate: "2026-08-15",
    location: "Jakarta Selatan",
    venueName: "Gedung Balai Kartini",
    guestCount: 500,
    pipelineStage: "CLOSING",
    lastInteraction: "2026-05-28T10:30:00Z",
    notes: "Sudah bayar DP 50%, sisa pelunasan H-14",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "lead-002",
    phoneNumber: "6289876543210",
    contactName: "Budi Santoso",
    eventType: "Resepsi",
    eventDate: "2026-09-20",
    location: "Bandung",
    venueName: "Hotel Savoy Homann",
    guestCount: 300,
    pipelineStage: "MEETING",
    lastInteraction: "2026-05-28T09:15:00Z",
    notes: "Jadwal test food minggu depan",
    createdAt: "2026-05-10T14:00:00Z",
  },
  {
    id: "lead-003",
    phoneNumber: "6282111222333",
    contactName: "Citra Dewi",
    eventType: "Catering",
    eventDate: "2026-07-10",
    location: "Depok",
    venueName: "Rumah Pribadi",
    guestCount: 150,
    pipelineStage: "LEADS",
    lastInteraction: "2026-05-28T08:45:00Z",
    notes: "",
    createdAt: "2026-05-25T16:30:00Z",
  },
  {
    id: "lead-004",
    phoneNumber: "6285333444555",
    contactName: "Diana Putri",
    eventType: "Pernikahan",
    eventDate: "2026-10-05",
    location: "Tangerang",
    venueName: "Gedung Sasono Utomo",
    guestCount: 800,
    pipelineStage: "MEETING",
    lastInteraction: "2026-05-27T15:20:00Z",
    notes: "Budget sekitar 100-150 juta, minta paket premium",
    createdAt: "2026-05-15T10:00:00Z",
  },
  {
    id: "lead-005",
    phoneNumber: "6287666777888",
    contactName: "Eko Prasetyo",
    eventType: "Corporate Events",
    eventDate: "2026-06-25",
    location: "Jakarta Pusat",
    venueName: "Ballroom The Ritz",
    guestCount: 200,
    pipelineStage: "CLOSING",
    lastInteraction: "2026-05-28T11:00:00Z",
    notes: "Catering prasmanan 200 pax, sudah ACC menu",
    createdAt: "2026-05-05T09:00:00Z",
  },
  {
    id: "lead-006",
    phoneNumber: "6281999888777",
    contactName: "Fatimah Zahra",
    eventType: "Pernikahan",
    eventDate: "2026-11-12",
    location: "Bogor",
    venueName: "Villa Bukit Danau",
    guestCount: 250,
    pipelineStage: "LEADS",
    lastInteraction: "2026-05-28T07:30:00Z",
    notes: "Baru tanya harga, belum detail",
    createdAt: "2026-05-27T20:00:00Z",
  },
  {
    id: "lead-007",
    phoneNumber: "6283444555666",
    contactName: "Galih Wicaksono",
    eventType: "Resepsi",
    eventDate: "2026-12-01",
    location: "Surabaya",
    venueName: "Gedung Graha",
    guestCount: 600,
    pipelineStage: "LEADS",
    lastInteraction: "2026-05-26T12:00:00Z",
    notes: "Minta brosur wedding dikirim",
    createdAt: "2026-05-20T11:00:00Z",
  },
  {
    id: "lead-008",
    phoneNumber: "6289111222333",
    contactName: "Hana Permata",
    eventType: "Catering",
    eventDate: "2026-07-28",
    location: "Bekasi",
    venueName: "Rumah Orang Tua",
    guestCount: 100,
    pipelineStage: "MEETING",
    lastInteraction: "2026-05-28T06:00:00Z",
    notes: "Test food dijadwalkan 2 Juni",
    createdAt: "2026-05-18T08:00:00Z",
  },
  {
    id: "lead-009",
    phoneNumber: "6285222333444",
    contactName: "Irfan Maulana",
    eventType: "Pernikahan",
    eventDate: "2026-09-08",
    location: "Yogyakarta",
    venueName: "Pendopo Agung",
    guestCount: 400,
    pipelineStage: "LEADS",
    lastInteraction: "2026-05-25T14:00:00Z",
    notes: "",
    createdAt: "2026-05-22T10:00:00Z",
  },
  {
    id: "lead-010",
    phoneNumber: "6281777888999",
    contactName: "Julia Sari",
    eventType: "Pernikahan",
    eventDate: "2026-08-22",
    location: "Jakarta Timur",
    venueName: "Hotel Le Meridien",
    guestCount: 350,
    pipelineStage: "CLOSING",
    lastInteraction: "2026-05-28T12:30:00Z",
    notes: "Full payment sudah lunas, tinggal finalisasi dekorasi",
    createdAt: "2026-04-28T09:00:00Z",
  },
];

// ──────────────────────────────────────────
// CONVERSATIONS DATA
// ──────────────────────────────────────────
export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    leadId: "lead-003",
    lead: mockLeads[2],
    status: "AI_HANDLING",
    assignedTo: null,
    lastMessageAt: "2026-05-28T08:45:00Z",
    lastMessagePreview: "Halo kak, mau tanya paket catering untuk 150 orang dong",
    unreadCount: 2,
    messages: [
      { id: "msg-001", conversationId: "conv-001", direction: "INBOUND", content: "Halo kak, mau tanya paket catering untuk 150 orang dong", mediaUrls: [], isRead: true, timestamp: "2026-05-28T08:40:00Z" },
      { id: "msg-002", conversationId: "conv-001", direction: "OUTBOUND", content: "Halo Kakak Citra! 🌸 Saya Mirna, AI assistant dari Wina Al-Husna Wedding & Catering.\n\nWah senang sekali Kakak tertarik dengan layanan catering kami! Untuk 150 tamu, kami punya beberapa pilihan paket:\n\n✨ Paket Prasmanan Silver — Rp 85.000/pax\n✨ Paket Prasmanan Gold — Rp 125.000/pax\n✨ Paket Prasmanan Platinum — Rp 165.000/pax\n\nSemua sudah termasuk setup, peralatan, dan crew. Kira-kira budget Kakak sekitar berapa?", mediaUrls: [], isRead: true, timestamp: "2026-05-28T08:41:00Z" },
      { id: "msg-003", conversationId: "conv-001", direction: "INBOUND", content: "Budget sekitar 15-20 juta kak, yang gold bisa?", mediaUrls: [], isRead: false, timestamp: "2026-05-28T08:45:00Z" },
    ],
  },
  {
    id: "conv-002",
    leadId: "lead-006",
    lead: mockLeads[5],
    status: "WAITING_CS",
    assignedTo: null,
    lastMessageAt: "2026-05-28T07:30:00Z",
    lastMessagePreview: "CS1",
    unreadCount: 1,
    messages: [
      { id: "msg-010", conversationId: "conv-002", direction: "INBOUND", content: "Assalamualaikum, saya mau tanya soal paket wedding islami", mediaUrls: [], isRead: true, timestamp: "2026-05-28T07:20:00Z" },
      { id: "msg-011", conversationId: "conv-002", direction: "OUTBOUND", content: "Wa'alaikumsalam Kakak Fatimah! 🌸 Saya Mirna dari Wina Al-Husna.\n\nKami sangat senang bisa membantu perencanaan pernikahan Islami Kakak! Kami spesialisasi di pernikahan Islami dengan slogan \"Halal & Amanah\".\n\nBoleh tahu kira-kira rencana acara kapan dan di mana, Kak?", mediaUrls: [], isRead: true, timestamp: "2026-05-28T07:21:00Z" },
      { id: "msg-012", conversationId: "conv-002", direction: "INBOUND", content: "Rencana November di Bogor, tapi saya mau ngobrol langsung sama orangnya bisa?", mediaUrls: [], isRead: true, timestamp: "2026-05-28T07:28:00Z" },
      { id: "msg-013", conversationId: "conv-002", direction: "INBOUND", content: "CS1", mediaUrls: [], isRead: false, timestamp: "2026-05-28T07:30:00Z" },
    ],
  },
  {
    id: "conv-003",
    leadId: "lead-002",
    lead: mockLeads[1],
    status: "CS_HANDLING",
    assignedTo: "Admin Wina",
    lastMessageAt: "2026-05-28T09:15:00Z",
    lastMessagePreview: "Baik pak, jadwal test food hari Sabtu jam 10 ya",
    unreadCount: 0,
    messages: [
      { id: "msg-020", conversationId: "conv-003", direction: "INBOUND", content: "Pak, saya mau jadwalkan test food dong", mediaUrls: [], isRead: true, timestamp: "2026-05-28T09:00:00Z" },
      { id: "msg-021", conversationId: "conv-003", direction: "OUTBOUND", content: "Baik pak Budi, untuk test food bisa hari Sabtu jam 10 pagi di kantor kami di Jl. Raya Cipinang No. 45. Apakah bisa?", mediaUrls: [], isRead: true, timestamp: "2026-05-28T09:10:00Z" },
      { id: "msg-022", conversationId: "conv-003", direction: "INBOUND", content: "Oke bisa pak, sampai ketemu Sabtu", mediaUrls: [], isRead: true, timestamp: "2026-05-28T09:15:00Z" },
    ],
  },
  {
    id: "conv-004",
    leadId: "lead-001",
    lead: mockLeads[0],
    status: "AI_HANDLING",
    assignedTo: null,
    lastMessageAt: "2026-05-28T10:30:00Z",
    lastMessagePreview: "Kak, untuk dekorasi bisa request tema garden party gak?",
    unreadCount: 1,
    messages: [
      { id: "msg-030", conversationId: "conv-004", direction: "INBOUND", content: "Kak, untuk dekorasi bisa request tema garden party gak?", mediaUrls: [], isRead: false, timestamp: "2026-05-28T10:30:00Z" },
    ],
  },
  {
    id: "conv-005",
    leadId: "lead-005",
    lead: mockLeads[4],
    status: "RESOLVED",
    assignedTo: "Admin Wina",
    lastMessageAt: "2026-05-28T11:00:00Z",
    lastMessagePreview: "Terima kasih, sudah kami proses ya pak",
    unreadCount: 0,
    messages: [
      { id: "msg-040", conversationId: "conv-005", direction: "INBOUND", content: "Menu sudah fix ya, tolong kirim invoice finalnya", mediaUrls: [], isRead: true, timestamp: "2026-05-28T10:50:00Z" },
      { id: "msg-041", conversationId: "conv-005", direction: "OUTBOUND", content: "Terima kasih pak Eko, invoice sudah kami kirim via email. Total Rp 35.000.000 untuk prasmanan 200 pax.", mediaUrls: [], isRead: true, timestamp: "2026-05-28T11:00:00Z" },
    ],
  },
];

// ──────────────────────────────────────────
// KNOWLEDGE BASE DATA
// ──────────────────────────────────────────
export const mockDocuments: KnowledgeDoc[] = [
  { id: "doc-001", fileName: "Pricelist Wedding 2026.pdf", fileType: "pdf", fileSize: 2450000, status: "INDEXED", chunkCount: 24, uploadedAt: "2026-05-01T10:00:00Z", indexedAt: "2026-05-01T10:05:00Z" },
  { id: "doc-002", fileName: "Menu Catering Premium.xlsx", fileType: "xlsx", fileSize: 850000, status: "INDEXED", chunkCount: 15, uploadedAt: "2026-05-05T14:00:00Z", indexedAt: "2026-05-05T14:03:00Z" },
  { id: "doc-003", fileName: "FAQ Wedding Islami.pdf", fileType: "pdf", fileSize: 1200000, status: "INDEXED", chunkCount: 18, uploadedAt: "2026-05-10T09:00:00Z", indexedAt: "2026-05-10T09:04:00Z" },
  { id: "doc-004", fileName: "Katalog Dekorasi 2026.pdf", fileType: "pdf", fileSize: 5600000, status: "PROCESSING", chunkCount: null, uploadedAt: "2026-05-28T08:00:00Z", indexedAt: null },
  { id: "doc-005", fileName: "Data Venue Partner.csv", fileType: "csv", fileSize: 320000, status: "INDEXED", chunkCount: 8, uploadedAt: "2026-05-15T11:00:00Z", indexedAt: "2026-05-15T11:02:00Z" },
  { id: "doc-006", fileName: "Testimoni Client.docx", fileType: "docx", fileSize: 780000, status: "FAILED", chunkCount: null, uploadedAt: "2026-05-20T16:00:00Z", indexedAt: null },
];

// ──────────────────────────────────────────
// ACTIVITY FEED DATA
// ──────────────────────────────────────────
export const mockActivities: Activity[] = [
  { id: "act-001", type: "message", title: "Pesan masuk dari Citra Dewi", description: "Budget sekitar 15-20 juta kak, yang gold bisa?", timestamp: "2026-05-28T08:45:00Z" },
  { id: "act-002", type: "handoff", title: "Fatimah Zahra minta CS", description: 'Mengetik "CS1" — menunggu agen', timestamp: "2026-05-28T07:30:00Z" },
  { id: "act-003", type: "stage_change", title: "Anisa Rahma → CLOSING", description: "Pembayaran DP diterima, stage berubah otomatis", timestamp: "2026-05-28T06:00:00Z" },
  { id: "act-004", type: "form_submit", title: "Form baru: Galih Wicaksono", description: "Pernikahan, 600 tamu, Surabaya", timestamp: "2026-05-26T12:00:00Z" },
  { id: "act-005", type: "message", title: "Pesan masuk dari Diana Putri", description: "Kak mau lihat dekorasi tema rustic dong", timestamp: "2026-05-27T15:20:00Z" },
  { id: "act-006", type: "stage_change", title: "Budi Santoso → MEETING", description: "Jadwal test food dikonfirmasi", timestamp: "2026-05-27T10:00:00Z" },
  { id: "act-007", type: "form_submit", title: "Form baru: Irfan Maulana", description: "Pernikahan, 400 tamu, Yogyakarta", timestamp: "2026-05-22T10:00:00Z" },
  { id: "act-008", type: "message", title: "Pesan masuk dari Julia Sari", description: "Finalisasi dekorasi meja VIP", timestamp: "2026-05-28T12:30:00Z" },
];

// ──────────────────────────────────────────
// DASHBOARD METRICS
// ──────────────────────────────────────────
export const mockMetrics = {
  totalLeadsToday: 3,
  activeConversations: 4,
  waitingCS: 1,
  closingThisMonth: 3,
  leadsCount: mockLeads.filter((l) => l.pipelineStage === "LEADS").length,
  meetingCount: mockLeads.filter((l) => l.pipelineStage === "MEETING").length,
  closingCount: mockLeads.filter((l) => l.pipelineStage === "CLOSING").length,
};
