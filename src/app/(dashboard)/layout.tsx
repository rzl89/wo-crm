import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUid: user.id },
    include: { tenant: true }
  });

  if (!dbUser) {
    // Edge case if user is in auth but not in DB yet
    return <div>Preparing your workspace...</div>;
  }

  const tenant = dbUser.tenant;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <AuthProvider user={dbUser} tenant={tenant}>
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
      </AuthProvider>
    </div>
  );
}
