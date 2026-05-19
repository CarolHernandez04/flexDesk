import { redirect } from "next/navigation";
import { BookingTable } from "@/components/dashboard/booking-table";
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { DeskCard } from "@/components/dashboard/desk-card";
import { getCurrentUser } from "@/lib/auth";
import { getDesksForDate, getUserBookings } from "@/lib/data";

export const metadata = {
  title: "Dashboard | FlexDesk",
  description: "Book and manage your office desk reservations.",
};

type DashboardPageProps = {
  searchParams: Promise<{
    date?: string;
    department?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const selectedDate =
    params.date || new Date().toISOString().split("T")[0];

  const selectedDepartment = params.department || "";

  const [desks, bookings] = await Promise.all([
    getDesksForDate(selectedDate, selectedDepartment),
    getUserBookings(user.id),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {user.name || user.email}
        </p>
      </div>

      <div className="space-y-8">
        <DashboardFilters />

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Available desks
          </h2>

          {desks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {desks.map((desk) => (
                <DeskCard
                  key={desk.id}
                  desk={desk}
                  selectedDate={selectedDate}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <p className="text-gray-600">
                No desks found for the selected filters.
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            My bookings
          </h2>

          <BookingTable bookings={bookings} />
        </section>
      </div>
    </main>
  );
}