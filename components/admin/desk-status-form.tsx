import {
  deleteDeskAction,
  updateDeskDayStatusAction,
  updateDeskDepartmentAction,
  updateDeskSlotsAction,
} from "@/app/actions/desk-actions";
import { Button } from "@/components/button";

type DeskStatusFormProps = {
  desk: {
    id: string;
    identifier: string;
    status: string;
    effectiveStatus: string;
    department: string | null;
    location: string | null;
    availableSlots: string[];
  };
  selectedDate: string;
};

export function DeskStatusForm({ desk, selectedDate }: DeskStatusFormProps) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-900">
        {desk.identifier}
      </td>

      <td className="px-4 py-3">
        <form
          action={updateDeskDepartmentAction}
          className="flex gap-2"
        >
          <input
            type="hidden"
            name="deskId"
            value={desk.id}
          />

          <input
            type="text"
            name="department"
            defaultValue={desk.department ?? ""}
            placeholder="Department"
            className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <Button
            type="submit"
            variant="secondary"
          >
            Update
          </Button>
        </form>
      </td>

      <td className="px-4 py-3 text-gray-700">{desk.location}</td>

      <td className="px-4 py-3">
        <form action={updateDeskDayStatusAction} className="flex gap-2">
          <input type="hidden" name="deskId" value={desk.id} />
          <input type="hidden" name="date" value={selectedDate} />

          <select
            name="status"
            defaultValue={desk.effectiveStatus}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <Button type="submit" variant="secondary">
            Save
          </Button>
        </form>
      </td>

      <td className="px-4 py-3">
        <form action={updateDeskSlotsAction}>
          <input type="hidden" name="deskId" value={desk.id} />

          <div className="flex flex-col gap-1 text-sm">
            <label>
              <input
                type="checkbox"
                name="availableSlots"
                value="MORNING"
                defaultChecked={desk.availableSlots.includes("MORNING")}
              />{" "}
              Morning
            </label>

            <label>
              <input
                type="checkbox"
                name="availableSlots"
                value="AFTERNOON"
                defaultChecked={desk.availableSlots.includes("AFTERNOON")}
              />{" "}
              Afternoon
            </label>

            <label>
              <input
                type="checkbox"
                name="availableSlots"
                value="FULL_DAY"
                defaultChecked={desk.availableSlots.includes("FULL_DAY")}
              />{" "}
              Full day
            </label>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="mt-2"
          >
            Update
          </Button>
        </form>
      </td>

      <td className="px-4 py-3">
        <form action={deleteDeskAction}>
          <input type="hidden" name="deskId" value={desk.id} />
          <Button type="submit" variant="danger">
            Delete
          </Button>
        </form>
      </td>
    </tr>
  );
}