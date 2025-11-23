import { useState } from "react";
import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/button";
import type { FormFieldInput, FormInput } from "@monorepo/types/schemas";
import { QuestionList } from "./question-list";
import { QuestionCreator } from "./question-creator";

type FormBuilderProps = {
  value?: FormInput;
  onChange: (value?: FormInput) => void;
};

const fieldTypeLabels: Record<FormFieldInput["type"], string> = {
  text: "Short answer",
  select: "Dropdown",
  buttonGroup: "Choice chips"
};

const generateId = () => crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 9);

const toOptionValue = (label: string, fallback: string) => {
  const value = label.trim().toLowerCase();
  return value || fallback;
};

export function RegistrationFormBuilder({ value, onChange }: FormBuilderProps) {
  const [draftType, setDraftType] = useState<FormFieldInput["type"] | null>(null);
  const fields = value?.fields ?? [];

  const updateFormFields = (nextFields: FormFieldInput[]) => {
    if (!nextFields.length) {
      onChange(undefined);
      return;
    }
    onChange({ fields: nextFields });
  };

  const updateField = (fieldId: string, patch: Partial<FormFieldInput>) => {
    updateFormFields(
      fields.map((f) => {
        if (f.id !== fieldId) return f;

        if (f.type === "buttonGroup") {
          return {
            ...f,
            ...patch,
            type: "buttonGroup",
            options: "options" in patch && patch.options !== undefined ? patch.options : f.options
          };
        }

        if (f.type === "text") {
          return {
            ...f,
            ...patch,
            type: "text"
          };
        }

        if (f.type === "select") {
          return {
            ...f,
            ...patch,
            type: "select"
          };
        }

        return f;
      })
    );
  };

  const removeField = (fieldId: string) => {
    updateFormFields(fields.filter((f) => f.id !== fieldId));
  };

  const addField = (field: FormFieldInput) => {
    updateFormFields([...fields, field]);
    setDraftType(null);
  };

  const emptyBuilderState = !fields.length && !draftType;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex gap-2 flex-wrap">
        {(["text", "select", "buttonGroup"] as FormFieldInput["type"][]).map((type) => (
          <Button
            key={type}
            type="button"
            onClick={() => setDraftType(type)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500 cursor-pointer">
            <PlusIcon />
            {fieldTypeLabels[type]}
          </Button>
        ))}
      </div>

      {emptyBuilderState && (
        <div className="rounded-xl border border-dashed border-neutral-700 px-4 py-6 text-center text-sm text-neutral-500">
          No fields yet — choose a control above.
        </div>
      )}

      <QuestionList
        fields={fields}
        onUpdateField={updateField}
        onRemoveField={removeField}
        fieldTypeLabels={fieldTypeLabels}
      />

      {draftType && (
        <QuestionCreator
          fieldTypeLabels={fieldTypeLabels}
          onAdd={addField}
          onCancel={() => setDraftType(null)}
          toOptionValue={toOptionValue}
          generateId={generateId}
          initialType={draftType}
        />
      )}
    </div>
  );
}
