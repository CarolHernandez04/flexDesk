import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata = {
  title: "Login | FlexDesk",
  description: "Sign in to FlexDesk.",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">
          Access your FlexDesk account.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Do not have an account?{" "}
          <Link href="/register" className="font-medium text-blue-600">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}