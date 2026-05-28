import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <Header />
      <main
        className="transition-all duration-300"
        style={{
          marginLeft: "var(--sidebar-width)",
          paddingTop: "var(--header-height)",
        }}
      >
        <div className="p-6 max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
