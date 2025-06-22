import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-options";
import { redirect } from "next/navigation";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }
  
  return user;
}

export async function requireNoAuth() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect("/dashboard");
  }
} 