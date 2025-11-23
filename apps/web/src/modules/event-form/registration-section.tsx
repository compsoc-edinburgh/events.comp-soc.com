import type { EventCreateInput } from "@monorepo/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { type Control, type UseFormRegister, Controller } from "react-hook-form";
import FieldLabel from "../../components/field-label";
import { Input } from "../../components/input";
import { Textarea } from "../../components/textarea";

type RegistrationSettingsProps = {
  control: Control<EventCreateInput>;
  register: UseFormRegister<EventCreateInput>;
  enabled: boolean;
};

function RegistrationSettings({ control, register, enabled }: RegistrationSettingsProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-md font-semibold">Registration button</p>
          <p className="text-sm text-neutral-500">
            Capture interest directly from the hero section.
          </p>
        </div>
        <Controller
          control={control}
          name="registration.enabled"
          render={({ field }) => (
            <label className="inline-flex items-center gap-2 text-sm">
              <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                className="size-4 accent-neutral-300"
              />
              Enable
            </label>
          )}
        />
      </div>

      {enabled && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <FieldLabel label="Registration headline" />
            <Input
              {...register("registration.title")}
              placeholder="Registration headline"
              className="w-full bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-lg px-3 py-2 text-neutral-100"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel label="Description" />
            <Textarea
              {...register("registration.description")}
              rows={3}
              placeholder="Explain why RSVPs matter."
              className="w-full bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <FieldLabel label="Button label" />
            <Input
              {...register("registration.buttonText")}
              placeholder="Button label"
              className="w-full border border-neutral-800 focus:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-900 bg-neutral-200 focus:bg-neutral-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default RegistrationSettings;
