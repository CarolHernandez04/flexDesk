import { createDeskAction } from "@/app/actions/desk-actions";
import { Button } from "@/components/button";

export function CreateDeskForm() {
  return (
    <form
      action={createDeskAction}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900">
        Create desk
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-700"
          >
            Identifier
          </label>

          <input
            id="identifier"
            name="identifier"
            placeholder="DESK-D01"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>

          <select
            id="department"
            name="department"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          >
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>

          <input
            id="location"
            name="location"
            placeholder="Floor 1, Zone A"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-700">
          Available time slots
        </p>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableSlots"
              value="MORNING"
              defaultChecked
            />
            Morning
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableSlots"
              value="AFTERNOON"
              defaultChecked
            />
            Afternoon
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="availableSlots"
              value="FULL_DAY"
              defaultChecked
            />
            Full day
          </label>
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="mt-4"
      >
        Create desk
      </Button>
    </form>
  );
}