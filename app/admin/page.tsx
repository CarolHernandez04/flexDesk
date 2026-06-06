import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminBookingsTable } from "@/components/admin/admin-bookings-table";
import { CreateDeskForm } from "@/components/admin/create-desk-form";
import { DeskStatusForm } from "@/components/admin/desk-status-form";
import { Button } from "@/components/button";
import { getCurrentUser } from "@/lib/auth";
import { getAdminDashboardData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Admin | FlexDesk",
  description: "Admin dashboard for managing FlexDesk.",
};

type AdminPageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

type AdminDesk = {
  id: string;
  identifier: string;
  status: string;
  effectiveStatus: string;
  department: string | null;
  location: string | null;
  availableSlots: string[];
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const selectedDate = params.date || new Date().toISOString().split("T")[0];

  const { users, desks, bookings } = await getAdminDashboardData(selectedDate);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage desks, users and bookings.
        </p>
      </div>

      <form className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Manage desks for date
        </label>

        <input
          id="date"
          name="date"
          type="date"
          defaultValue={selectedDate}
          className="mt-1 rounded-lg border border-gray-300 px-3 py-2"
        />

        <Button type="submit" variant="primary" className="ml-3">
          Load date
        </Button>
      </form>

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
          <p className="text-sm text-gray-600">Bookings for selected date</p>
          <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
        </div>
      </div>

      <div className="space-y-8">
        <CreateDeskForm />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Desks for {selectedDate}
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
                    Status for this day
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Delete
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {desks.map((desk: AdminDesk) => (
                  <DeskStatusForm
                    key={desk.id}
                    desk={desk}
                    selectedDate={selectedDate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Bookings for selected date
          </h2>

          <AdminBookingsTable bookings={bookings} />
        </section>
      </div>
    </main>
  );
}