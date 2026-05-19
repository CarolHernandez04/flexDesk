import { cancelBookingAction } from "@/app/actions/booking-actions";
import { Button } from "@/components/button";
import { BOOKING_STATUSES, formatDate, TIME_SLOTS } from "@/lib/utils";

type BookingTableProps = {
  bookings: {
    id: string;
    date: Date;
    timeSlot: string;
    status: string;
    desk: {
      identifier: string;
      department: string | null;
      location: string | null;
    };
  }[];
};

export function BookingTable({ bookings }: BookingTableProps) {
  const activeBookings = bookings.filter(
    (booking) => booking.status !== "CANCELLED"
  );

  if (activeBookings.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <p className="text-gray-600">You do not have active bookings yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">
              Desk
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">
              Date
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">
              Time slot
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left font-semibold text-gray-900">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {activeBookings.map((booking) => (
            <tr key={booking.id}>
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">
                  {booking.desk.identifier}
                </p>
                <p className="text-xs text-gray-600">
                  {booking.desk.department}
                </p>
              </td>

              <td className="px-6 py-4 text-gray-700">
                {formatDate(new Date(booking.date))}
              </td>

              <td className="px-6 py-4 text-gray-700">
                {TIME_SLOTS[booking.timeSlot as keyof typeof TIME_SLOTS]}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    BOOKING_STATUSES[
                      booking.status as keyof typeof BOOKING_STATUSES
                    ].color
                  }`}
                >
                  {
                    BOOKING_STATUSES[
                      booking.status as keyof typeof BOOKING_STATUSES
                    ].label
                  }
                </span>
              </td>

              <td className="px-6 py-4">
                <form action={cancelBookingAction}>
                  <input type="hidden" name="bookingId" value={booking.id} />
                  <Button type="submit" variant="danger">
                    Cancel
                  </Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}