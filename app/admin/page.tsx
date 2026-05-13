import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

export const metadata = {
  title: "Admin Dashboard | FlexDesk",
  description: "Admin dashboard for managing FlexDesk bookings and desks.",
};

export default async function AdminPage() {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [users, desks, bookings] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
      },
    }),
    prisma.desk.findMany({
      orderBy: { identifier: "asc" },
      select: {
        id: true,
        identifier: true,
        status: true,
        department: true,
        location: true,
      },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        desk: {
          select: {
            identifier: true,
            department: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of users, desks and recent bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600">Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600">Desks</p>
          <p className="text-3xl font-bold text-gray-900">{desks.length}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-600">Recent Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Desks</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">Identifier</th>
                <th className="text-left px-4 py-3">Department</th>
                <th className="text-left px-4 py-3">Location</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {desks.map((desk) => (
                <tr key={desk.id}>
                  <td className="px-4 py-3 font-medium">{desk.identifier}</td>
                  <td className="px-4 py-3">{desk.department || "-"}</td>
                  <td className="px-4 py-3">{desk.location || "-"}</td>
                  <td className="px-4 py-3">{desk.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Bookings
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Desk</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Time Slot</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-3">
                    {booking.user.name || booking.user.email}
                  </td>
                  <td className="px-4 py-3">{booking.desk.identifier}</td>
                  <td className="px-4 py-3">
                    {new Intl.DateTimeFormat("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }).format(new Date(booking.date))}
                  </td>
                  <td className="px-4 py-3">{booking.timeSlot}</td>
                  <td className="px-4 py-3">{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}