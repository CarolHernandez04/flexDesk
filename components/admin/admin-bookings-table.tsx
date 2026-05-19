import { cancelBookingAction } from "@/app/actions/booking-actions";
import { Button } from "@/components/button";
import { formatDate, TIME_SLOTS } from "@/lib/utils";

type AdminBookingsTableProps = {
  bookings: {
    id: string;
    date: Date;
    timeSlot: string;
    status: string;
    user: {
      name: string | null;
      email: string;
    };
    desk: {
      identifier: string;
      department: string | null;
    };
  }[];
};

export function AdminBookingsTable({ bookings }: AdminBookingsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              User
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Desk
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Date
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Time slot
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Status
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-900">
              Action
            </th>
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
                {formatDate(new Date(booking.date))}
              </td>
              <td className="px-4 py-3">
                {TIME_SLOTS[booking.timeSlot as keyof typeof TIME_SLOTS]}
              </td>
              <td className="px-4 py-3">{booking.status}</td>
              <td className="px-4 py-3">
                {booking.status !== "CANCELLED" && (
                  <form action={cancelBookingAction}>
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <Button type="submit" variant="danger">
                      Cancel
                    </Button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}