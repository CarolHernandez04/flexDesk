import { redirect } from "next/navigation";
import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";
import { CreateDeskForm } from "@/components/admin/create-desk-form";
import { DeskStatusForm } from "@/components/admin/desk-status-form";
import { getCurrentUser } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";

export const metadata = {
  title: "Admin | FlexDesk",
  description: "Admin dashboard for managing FlexDesk.",
};

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { users, desks, bookings } = await getAdminDashboardData();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Manage desks, users and bookings.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Desks</p>
          <p className="text-3xl font-bold text-gray-900">{desks.length}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        <CreateDeskForm />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Desks
          </h2>

          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">
                    Identifier
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {desks.map((desk) => (
                  <DeskStatusForm key={desk.id} desk={desk} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Bookings
          </h2>

          <AdminBookingsTable bookings={bookings} />
        </section>
      </div>
    </main>
  );
}