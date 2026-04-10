import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Zap, Lock, Users } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FlexDesk
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Manage your office desk bookings with ease. Perfect for hybrid teams.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg border border-blue-200 hover:border-blue-300 transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 py-20">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Zap className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Quick Booking</h3>
            <p className="text-gray-600">
              Book desks instantly with our intuitive calendar interface
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Lock className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Secure Access</h3>
            <p className="text-gray-600">
              Enterprise-grade security for your data and bookings
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <Users className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-lg mb-2">Team Management</h3>
            <p className="text-gray-600">
              Manage teams and optimize office space utilization
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
