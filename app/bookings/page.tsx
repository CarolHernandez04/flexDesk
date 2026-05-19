import { redirect } from "next/navigation";
import { BookingTable } from "@/components/dashboard/booking-table";
import { getCurrentUser } from "@/lib/auth";
import { getUserBookings } from "@/lib/data";

export const metadata = {
  title: "My Bookings | FlexDesk",
  description: "View and manage your desk bookings.",
};

export default async function BookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const bookings = await getUserBookings(user.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">
          View and cancel your current desk reservations.
        </p>
      </div>

      <BookingTable bookings={bookings} />
    </main>
  );
}