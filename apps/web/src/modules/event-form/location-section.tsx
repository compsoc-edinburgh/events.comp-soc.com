import type { EventCreateInput } from "@monorepo/types";
import type { UseFormRegister } from "react-hook-form";
import FieldLabel from "../../components/field-label";
import { Input } from "../../components/input";

type LocationSectionProps = {
  register: UseFormRegister<EventCreateInput>;
};

function LocationSection({ register }: LocationSectionProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Venue name" required />
          <Input
            {...register("location.name")}
            placeholder="Venue name"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Room / instructions" />
          <Input
            {...register("location.description")}
            placeholder="Room, floor, or instructions"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Map URL" />
          <Input
            type="url"
            {...register("location.mapUrl")}
            placeholder="Map URL"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Map title" />
          <Input
            {...register("location.mapTitle")}
            placeholder="Map title"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
      </div>
    </div>
  );
}

export default LocationSection;
