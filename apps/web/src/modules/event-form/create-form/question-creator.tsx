import { Cross1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/button.tsx";
import { Checkbox } from "../../../components/checkbox.tsx";
import { Input } from "../../../components/input.tsx";
import type { FormFieldInput } from "@monorepo/types/schemas";
import { useState } from "react";

type QuestionCreatorProps = {
  fieldTypeLabels: Record<FormFieldInput["type"], string>;
  onAdd: (field: FormFieldInput) => void;
  onCancel: () => void;
  toOptionValue: (label: string, fallback: string) => string;
  generateId: () => string;
  initialType: FormFieldInput["type"];
};

export function QuestionCreator({
  fieldTypeLabels,
  onAdd,
  onCancel,
  toOptionValue,
  generateId,
  initialType
}: QuestionCreatorProps) {
  const [fieldDraft, setFieldDraft] = useState<FormFieldInput | null>(() => {
    return initialType === "text"
      ? {
          id: generateId(),
          type: initialType,
          label: "",
          required: false,
          placeholder: ""
        }
      : {
          id: generateId(),
          type: initialType,
          label: "",
          required: false,
          options: [1, 2].map((index) => {
            const label = `Option ${index}`;
            return { label, value: toOptionValue(label, `option-${index}`) };
          })
        };
  });

  if (!fieldDraft) return null;

  const updateDraftOptionLabel = (optionIndex: number, label: string) => {
    setFieldDraft((prev) => {
      if (!prev || prev.type === "text") return prev;
      const fallback = `option-${optionIndex + 1}`;
      return {
        ...prev,
        options: prev.options.map((option, index) =>
          index === optionIndex
            ? { ...option, label, value: toOptionValue(label, fallback) }
            : option
        )
      };
    });
  };

  const addDraftOption = () => {
    setFieldDraft((prev) => {
      if (!prev || prev.type === "text") return prev;
      const nextIndex = prev.options.length + 1;
      const label = `Option ${nextIndex}`;
      return {
        ...prev,
        options: [...prev.options, { label, value: toOptionValue(label, `option-${nextIndex}`) }]
      };
    });
  };

  const removeDraftOption = (optionIndex: number) => {
    setFieldDraft((prev) => {
      if (!prev || prev.type === "text") return prev;
      return {
        ...prev,
        options: prev.options.filter((_, index) => index !== optionIndex)
      };
    });
  };

  const commitDraft = () => {
    if (!fieldDraft) return;
    const { id, type, label, required } = fieldDraft;
    const trimmedLabel = label.trim() || "Untitled question";

    if (type === "text") {
      const nextField: FormFieldInput = {
        id,
        type: "text",
        label: trimmedLabel,
        required,
        placeholder: fieldDraft.placeholder
      };
      onAdd(nextField);
    } else {
      const safeOptions = fieldDraft.options
        .map((opt, index) => {
          const trimmed = opt.label.trim();
          if (!trimmed) return null;
          const fallback = `option-${index + 1}`;
          return {
            label: trimmed,
            value: toOptionValue(trimmed, fallback)
          };
        })
        .filter(Boolean) as { label: string; value: string }[];

      onAdd({
        id,
        type,
        label: trimmedLabel,
        required,
        options:
          safeOptions.length > 0
            ? safeOptions
            : [
                {
                  label: "Option 1",
                  value: toOptionValue("Option 1", "option-1")
                }
              ]
      });
    }
  };

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          New {fieldTypeLabels[fieldDraft.type].toLowerCase()}
        </p>
        <Button
          type="button"
          onClick={onCancel}
          className="text-neutral-400 hover:text-white cursor-pointer">
          <Cross1Icon />
        </Button>
      </div>

      <Input
        value={fieldDraft.label}
        onChange={(e) => setFieldDraft({ ...fieldDraft, label: e.target.value })}
        placeholder="Question label"
        className="w-full bg-transparent border border-neutral-700 focus:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-100"
      />

      <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
        <Checkbox
          checked={fieldDraft.required}
          onCheckedChange={(checked) =>
            setFieldDraft((prev) => (prev ? { ...prev, required: Boolean(checked) } : prev))
          }
          className="size-4 accent-neutral-300"
        />
        Required
      </label>

      {fieldDraft.type === "text" ? (
        <Input
          value={fieldDraft.placeholder ?? ""}
          onChange={(e) => setFieldDraft({ ...fieldDraft, placeholder: e.target.value })}
          placeholder="Placeholder (optional)"
          className="w-full bg-transparent border border-neutral-700 focus:border-neutral-600 rounded-lg px-3 py-2 text-sm text-neutral-100"
        />
      ) : (
        <div className="space-y-2">
          {fieldDraft.options.map((option, index) => (
            <div key={`${fieldDraft.id}-${index}`} className="flex items-center gap-2">
              <Input
                value={option.label}
                onChange={(e) => updateDraftOptionLabel(index, e.target.value)}
                className="flex-1 bg-transparent border border-neutral-700 focus:border-neutral-600 rounded-lg px-2 py-1 text-sm text-neutral-100"
              />

              <Button
                type="button"
                onClick={() => removeDraftOption(index)}
                className="text-neutral-500 hover:text-white hover:cursor-pointer cursor-pointer">
                <TrashIcon />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            onClick={addDraftOption}
            className="text-xs text-neutral-300 hover:text-white cursor-pointer">
            + Add option
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          onClick={commitDraft}
          className="rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-neutral-900 cursor-pointer">
          Add to form
        </Button>

        <Button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 hover:border-neutral-500 cursor-pointer">
          Cancel
        </Button>
      </div>
    </div>
  );
}
