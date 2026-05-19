import { createBookingAction } from "@/app/actions/booking-actions";
import { Button } from "@/components/button";
import { TIME_SLOTS } from "@/lib/utils";

type BookingFormProps = {
  deskId: string;
  selectedDate: string;
};

export function BookingForm({ deskId, selectedDate }: BookingFormProps) {
  return (
    <form action={createBookingAction} className="space-y-4">
      <input type="hidden" name="deskId" value={deskId} />
      <input type="hidden" name="date" value={selectedDate} />

      <div>
        <label
          htmlFor={`timeSlot-${deskId}`}
          className="block text-sm font-medium text-gray-700"
        >
          Time slot
        </label>

        <select
          id={`timeSlot-${deskId}`}
          name="timeSlot"
          defaultValue="MORNING"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="MORNING">{TIME_SLOTS.MORNING}</option>
          <option value="AFTERNOON">{TIME_SLOTS.AFTERNOON}</option>
          <option value="FULL_DAY">{TIME_SLOTS.FULL_DAY}</option>
        </select>
      </div>

      <Button type="submit" variant="primary" className="w-full">
        Book this desk
      </Button>
    </form>
  );
}