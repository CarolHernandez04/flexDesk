import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Register - FlexDesk",
  description: "Create a new FlexDesk account",
};

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <RegisterClient />;
}
