import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login - FlexDesk",
  description: "Sign in to your FlexDesk account",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <LoginClient />;
}
