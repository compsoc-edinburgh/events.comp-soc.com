import type { FormFieldInput } from "@monorepo/types/schemas";
import { QuestionCard } from "./question-card.tsx";

type QuestionListProps = {
  fields: FormFieldInput[];
  onUpdateField: (id: string, patch: Partial<FormFieldInput>) => void;
  onRemoveField: (id: string) => void;
  fieldTypeLabels: Record<FormFieldInput["type"], string>;
};

export function QuestionList({
  fields,
  onUpdateField,
  onRemoveField,
  fieldTypeLabels
}: QuestionListProps) {
  if (!fields.length) return null;

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <QuestionCard
          key={field.id}
          field={field}
          onUpdate={onUpdateField}
          onRemove={onRemoveField}
          fieldTypeLabels={fieldTypeLabels}
        />
      ))}
    </div>
  );
}
