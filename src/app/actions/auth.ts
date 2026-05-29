"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const tenantName = formData.get("tenantName") as string;
  const supabase = await createClient();

  // 1. SignUp to Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { error: authError?.message || "Gagal mendaftarkan akun" };
  }

  try {
    // 2. Create Tenant & User in Prisma
    const tenantSlug = tenantName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    // Check if user already exists in DB to prevent conflicts
    const existingUser = await prisma.user.findUnique({
      where: { supabaseUid: authData.user.id }
    });

    if (!existingUser) {
      await prisma.tenant.create({
        data: {
          name: tenantName,
          slug: tenantSlug + "-" + Math.floor(Math.random() * 1000), // Ensure uniqueness
          users: {
            create: {
              supabaseUid: authData.user.id,
              email: email,
              name: fullName,
              role: "OWNER",
            }
          }
        }
      });
    }

  } catch (dbError) {
    console.error("Failed to create Tenant/User in DB:", dbError);
    // Note: in a real app, we might want to compensate or rollback Supabase Auth here
    return { error: "Gagal menyimpan data perusahaan." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
