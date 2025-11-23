import type { EventCreateInput } from "@monorepo/types";
import { type Control, type UseFormRegister, Controller } from "react-hook-form";
import TagEditor from "../tag-editor";
import AutoResizeTextarea from "../../components/auto-textarea";

type HeroSectionProps = {
  control: Control<EventCreateInput>;
  register: UseFormRegister<EventCreateInput>;
};

function HeroSection({ control, register }: HeroSectionProps) {
  return (
    <div className="space-y-3">
      <div>
        <AutoResizeTextarea
          {...register("hero.title")}
          placeholder="Event title"
          className="w-full bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-lg placeholder:text-neutral-500 focus:bg-neutral-800/40"
        />
      </div>

      <div className="flex gap-2">
        <Controller
          name="hero.tags"
          control={control}
          render={({ field }) => (
            <TagEditor tags={field.value ?? []} onChange={(value) => field.onChange(value)} />
          )}
        />
      </div>
    </div>
  );
}

export default HeroSection;
