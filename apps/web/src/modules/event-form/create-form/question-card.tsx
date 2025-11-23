import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/button.tsx";
import { Checkbox } from "../../../components/checkbox.tsx";
import { Input } from "../../../components/input.tsx";
import type { FormFieldInput } from "@monorepo/types/schemas";

type QuestionCardProps = {
  field: FormFieldInput;
  onUpdate: (id: string, patch: Partial<FormFieldInput>) => void;
  onRemove: (id: string) => void;
  fieldTypeLabels: Record<FormFieldInput["type"], string>;
};

const toOptionValue = (label: string, fallback: string) => {
  const value = label.trim().toLowerCase();
  return value || fallback;
};

export function QuestionCard({ field, onUpdate, onRemove, fieldTypeLabels }: QuestionCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <Input
            value={field.label}
            onChange={(e) => onUpdate(field.id, { label: e.target.value })}
            className="w-full bg-transparent border border-transparent focus:border-neutral-600 rounded-lg px-2 py-1 text-sm font-semibold text-white placeholder:text-neutral-500"
          />
          <p className="text-xs uppercase tracking-wide text-neutral-500 mt-1">
            {fieldTypeLabels[field.type]}
            {field.required && <span className="text-red-400 ml-1">*</span>}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => onRemove(field.id)}
          className="text-neutral-500 hover:text-white transition hover:cursor-pointer">
          <TrashIcon />
        </Button>
      </div>

      <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
        <Checkbox
          checked={Boolean(field.required)}
          onCheckedChange={(checked) => onUpdate(field.id, { required: Boolean(checked) })}
          className="size-4 accent-neutral-300"
        />
        Required
      </label>

      {field.type === "text" && (
        <Input
          value={field.placeholder ?? ""}
          onChange={(e) => onUpdate(field.id, { placeholder: e.target.value })}
          placeholder="Placeholder"
          className="w-full bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-lg px-2 py-1 text-sm text-neutral-200"
        />
      )}

      {field.type !== "text" && (
        <div className="space-y-2">
          {field.options?.map((option, index) => (
            <div key={`${field.id}-${index}`} className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(e) => {
                  const nextLabel = e.target.value;
                  onUpdate(field.id, {
                    options: field.options?.map((o, i) =>
                      i === index
                        ? {
                            ...o,
                            label: nextLabel,
                            value: toOptionValue(nextLabel, `option-${index + 1}`)
                          }
                        : o
                    )
                  });
                }}
                placeholder="Option label"
                className="flex-1 bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-lg px-2 py-1 text-sm text-neutral-200"
              />
            </div>
          ))}

          <Button
            type="button"
            onClick={() => {
              const nextIndex = (field.options?.length ?? 0) + 1;
              const nextLabel = `Option ${nextIndex}`;
              onUpdate(field.id, {
                options: [
                  ...(field.options ?? []),
                  {
                    label: nextLabel,
                    value: toOptionValue(nextLabel, `option-${nextIndex}`)
                  }
                ]
              });
            }}
            className="text-xs text-neutral-400 hover:text-white transition">
            + Add option
          </Button>
        </div>
      )}
    </div>
  );
}
