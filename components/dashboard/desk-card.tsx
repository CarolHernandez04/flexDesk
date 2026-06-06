import { BookingForm } from "@/components/dashboard/booking-form";

type DeskCardProps = {
  desk: {
    id: string;
    identifier: string;
    status: string;
    effectiveStatus: string;
    department: string | null;
    location: string | null;
    availableSlots: string[];
    bookings: {
      id: string;
      timeSlot: string;
      status: string;
    }[];
  };
  selectedDate: string;
};

export function DeskCard({ desk, selectedDate }: DeskCardProps) {
  const isUnavailable = desk.effectiveStatus !== "AVAILABLE";

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="font-semibold text-gray-900">{desk.identifier}</h2>
        <p className="text-sm text-gray-600">{desk.department}</p>
        <p className="text-sm text-gray-600">{desk.location}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["MORNING", "AFTERNOON", "FULL_DAY"].map((slot) => {
          const booked = desk.bookings.some(
            (booking) =>
              booking.timeSlot === slot && booking.status !== "CANCELLED"
          );

          return (
            <span
              key={slot}
              className={`rounded px-2 py-1 text-xs ${
                booked
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {slot === "MORNING" ? "AM" : slot === "AFTERNOON" ? "PM" : "FD"}
            </span>
          );
        })}
      </div>

      {isUnavailable ? (
       <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
         This desk is currently {desk.effectiveStatus.toLowerCase()}.
       </p>
      ) : (
        <BookingForm
          deskId={desk.id}
          selectedDate={selectedDate}
          bookings={desk.bookings}
          availableSlots={desk.availableSlots}
        />
      )}
    </article>
  );
}