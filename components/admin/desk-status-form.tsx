import {
  deleteDeskAction,
  updateDeskStatusAction,
} from "@/app/actions/desk-actions";
import { Button } from "@/components/button";

type DeskStatusFormProps = {
  desk: {
    id: string;
    identifier: string;
    status: string;
    department: string | null;
    location: string | null;
  };
};

export function DeskStatusForm({ desk }: DeskStatusFormProps) {
  return (
    <tr>
      <td className="px-4 py-3 font-medium text-gray-900">
        {desk.identifier}
      </td>
      <td className="px-4 py-3 text-gray-700">{desk.department}</td>
      <td className="px-4 py-3 text-gray-700">{desk.location}</td>
      <td className="px-4 py-3">
        <form action={updateDeskStatusAction} className="flex gap-2">
          <input type="hidden" name="deskId" value={desk.id} />
          <select
            name="status"
            defaultValue={desk.status}
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