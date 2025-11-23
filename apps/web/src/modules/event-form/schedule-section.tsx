import type { EventCreateInput } from "@monorepo/types";
import type { UseFormRegister } from "react-hook-form";
import FieldLabel from "../../components/field-label";
import { Input } from "../../components/input";

type ScheduleSectionProps = {
  register: UseFormRegister<EventCreateInput>;
  date: string;
  time: string;
};

function ScheduleSection({ register, date, time }: ScheduleSectionProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Date" required />
          <Input
            type="date"
            {...register("date")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="Start time" required />
          <Input
            type="time"
            {...register("time.start")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <FieldLabel label="End time" />
          <Input
            type="time"
            {...register("time.end")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800/20 p-4 space-y-1">
        <p className="font-semibold text-white">{date}</p>
        <p className="text-neutral-300">{time || "Add a start and end time"}</p>
      </div>
    </div>
  );
}

export default ScheduleSection;
