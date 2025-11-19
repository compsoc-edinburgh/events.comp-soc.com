import { useEffect, useState } from "react";
import { Controller, type Control, type UseFormRegister, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SIGsCarousel } from "../../components/sigs-carousel";
import { formatTime } from "../../lib/utils";
import { EventState, Sigs } from "@monorepo/types/const";
import { PlusIcon, TrashIcon, Cross1Icon } from "@radix-ui/react-icons";
import SectionHeader from "../../modules/section-header.tsx";
import AutoResizeTextarea from "../../components/auto-textarea.tsx";
import { Textarea } from "../../components/textarea.tsx";
import { Input } from "../../components/input.tsx";
import { Checkbox } from "../../components/checkbox.tsx";
import TagEditor from "../../modules/tag-editor.tsx";
import { Button } from "../../components/button.tsx";
import {
  EventCreateSchema,
  type EventCreateInput,
  type FormFieldInput,
  type FormInput
} from "@monorepo/types/schemas";
import FieldLabel from "../../components/field-label.tsx";
import VisibilitySection from "../../modules/visibility-section.tsx";

const createDefaultEventInput = (): EventCreateInput => ({
  organizerSig: Sigs.Compsoc,
  state: EventState.Draft,
  hero: {
    title: "",
    tags: []
  },
  registration: {
    enabled: false,
    title: "",
    description: "",
    buttonText: ""
  },
  aboutMarkdown: "",
  location: {
    name: "",
    description: "",
    mapUrl: "",
    mapTitle: ""
  },
  date: "",
  time: {
    start: "",
    end: ""
  }
});

type StatusBanner =
  | { type: "success"; message: string }
  | { type: "draft"; message: string }
  | null;

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

export function EventForm() {
  const [status, setStatus] = useState<StatusBanner>(null);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm<EventCreateInput>({
    resolver: zodResolver(EventCreateSchema),
    defaultValues: createDefaultEventInput()
  });

  const preview = watch();

  const prettyDate = preview.date
    ? new Date(preview.date).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short"
      })
    : "Add a date";

  const prettyTime = [preview.time?.start, preview.time?.end]
    .filter(Boolean)
    .map((time) => (time ? formatTime(time) : null))
    .join(" → ");

  const registrationEnabled = preview.registration?.enabled ?? false;

  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(t);
  }, [status]);

  const onSubmit = (values: EventCreateInput) => {
    const isUploaded = values.state === EventState.Uploaded;
    setStatus({
      type: isUploaded ? "success" : "draft",
      message: isUploaded
        ? "Hero looks great. Share it for a quick review, then publish."
        : "Saved as a draft."
    });
  };

  return (
    <div className="relative min-h-screen text-white bg-neutral-900">
      <main className="flex flex-col items-center pb-10">
        <div className="max-w-2xl w-full space-y-10">
          <Controller
            control={control}
            name="organizerSig"
            render={({ field }) => (
              <SIGsCarousel
                organizer={field.value}
                selectable
                isScrollable
                onSelect={(sig) => field.onChange(sig)}
              />
            )}
          />

          <HeroSection control={control} register={register} />

          <ScheduleSection register={register} prettyDate={prettyDate} prettyTime={prettyTime} />

          <SectionHeader title="About" />
          <AboutSection register={register} />

          <SectionHeader title="Location" />
          <LocationSection register={register} />

          <SectionHeader title="Registration form" />
          <RegistrationSettings
            control={control}
            register={register}
            enabled={registrationEnabled}
          />

          <Controller
            control={control}
            name="form"
            render={({ field }) => (
              <RegistrationFormBuilder value={field.value} onChange={field.onChange} />
            )}
          />

          <SectionHeader title="Visibility" />
          <VisibilitySection
            currentState={preview.state}
            isSubmitting={isSubmitting}
            onStateChange={(state) =>
              setValue("state", state, { shouldDirty: true, shouldValidate: true })
            }
            onSubmit={handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}

function Create() {
  return <EventForm />;
}

export default Create;

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

type ScheduleSectionProps = {
  register: UseFormRegister<EventCreateInput>;
  prettyDate: string;
  prettyTime: string;
};

function ScheduleSection({ register, prettyDate, prettyTime }: ScheduleSectionProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1 min-w-[12rem]">
          <FieldLabel label="Date" required />
          <Input
            type="date"
            {...register("date")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-[10rem]">
          <FieldLabel label="Start time" required />
          <Input
            type="time"
            {...register("time.start")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-[10rem]">
          <FieldLabel label="End time" />
          <Input
            type="time"
            {...register("time.end")}
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 text-sm placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-800/20 p-4 space-y-1">
        <p className="font-semibold text-white">{prettyDate}</p>
        <p className="text-neutral-300">{prettyTime || "Add a start and end time"}</p>
      </div>
    </div>
  );
}

type AboutSectionProps = {
  register: UseFormRegister<EventCreateInput>;
};

function AboutSection({ register }: AboutSectionProps) {
  return (
    <div className="rounded-xl space-y-2">
      <Textarea
        {...register("aboutMarkdown")}
        rows={8}
        placeholder="Long-form info. Markdown allowed."
        className="w-full bg-transparent border border-neutral-800 focus:border-neutral-700 rounded-xl px-3 py-3 text-base text-neutral-100 placeholder:text-neutral-600 focus:bg-neutral-800/40"
      />
    </div>
  );
}

type LocationSectionProps = {
  register: UseFormRegister<EventCreateInput>;
};

function LocationSection({ register }: LocationSectionProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1 min-w-[14rem]">
          <FieldLabel label="Venue name" required />
          <Input
            {...register("location.name")}
            placeholder="Venue name"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-[14rem]">
          <FieldLabel label="Room / instructions" />
          <Input
            {...register("location.description")}
            placeholder="Room, floor, or instructions"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 w-full">
        <div className="flex-1 flex flex-col gap-1 min-w-[14rem]">
          <FieldLabel label="Map URL" />
          <Input
            type="url"
            {...register("location.mapUrl")}
            placeholder="Map URL"
            className="bg-transparent border border-neutral-800 focus:border-neutral-600 rounded-xl px-3 py-2 placeholder:text-neutral-500 focus:bg-neutral-800/40"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-[14rem]">
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

type RegistrationFormBuilderProps = {
  value?: FormInput;
  onChange: (value?: FormInput) => void;
};

function RegistrationFormBuilder({ value, onChange }: RegistrationFormBuilderProps) {
  const [fieldDraft, setFieldDraft] = useState<FormFieldInput | null>(null);
  const fields = value?.fields ?? [];

  const updateFormFields = (nextFields: FormFieldInput[]) => {
    if (!nextFields.length) {
      onChange(undefined);
      return;
    }
    onChange({ fields: nextFields });
  };

  const beginDraft = (type: FormFieldInput["type"]) => {
    setFieldDraft(
      type === "text"
        ? {
            id: generateId(),
            type,
            label: "",
            required: false,
            placeholder: ""
          }
        : {
            id: generateId(),
            type,
            label: "",
            required: false,
            options: [1, 2].map((index) => {
              const label = `Option ${index}`;
              return { label, value: toOptionValue(label, `option-${index}`) };
            })
          }
    );
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
      updateFormFields([...fields, nextField]);
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

      updateFormFields([
        ...fields,
        {
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
        }
      ]);
    }

    setFieldDraft(null);
  };

  const updateDraftOptionLabel = (draftId: string, optionIndex: number, label: string) => {
    setFieldDraft((prev) => {
      if (!prev || prev.id !== draftId || prev.type === "text") return prev;
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

  const addDraftOption = (draftId: string) => {
    setFieldDraft((prev) => {
      if (!prev || prev.id !== draftId || prev.type === "text") return prev;
      const nextIndex = prev.options.length + 1;
      const label = `Option ${nextIndex}`;
      return {
        ...prev,
        options: [...prev.options, { label, value: toOptionValue(label, `option-${nextIndex}`) }]
      };
    });
  };

  const removeDraftOption = (draftId: string, optionIndex: number) => {
    setFieldDraft((prev) => {
      if (!prev || prev.id !== draftId || prev.type === "text") return prev;
      return {
        ...prev,
        options: prev.options.filter((_, index) => index !== optionIndex)
      };
    });
  };

  const emptyBuilderState = !fields.length && !fieldDraft;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
      <div className="flex gap-2 flex-wrap">
        {(["text", "select", "buttonGroup"] as FormFieldInput["type"][]).map((type) => (
          <Button
            key={type}
            type="button"
            onClick={() => beginDraft(type)}
            className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:border-neutral-500">
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

      {!!fields.length && (
        <div className="space-y-3">
          {fields.map((field) => (
            <div
              key={field.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <Input
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="w-full bg-transparent border border-transparent focus:border-neutral-600 rounded-lg px-2 py-1 text-sm font-semibold text-white placeholder:text-neutral-500"
                  />
                  <p className="text-xs uppercase tracking-wide text-neutral-500 mt-1">
                    {fieldTypeLabels[field.type]}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="text-neutral-500 hover:text-white transition">
                  <TrashIcon />
                </Button>
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
                <Checkbox
                  checked={Boolean(field.required)}
                  onCheckedChange={(checked) =>
                    updateField(field.id, { required: Boolean(checked) })
                  }
                  className="size-4 accent-neutral-300"
                />
                Required
              </label>

              {field.type === "text" && (
                <Input
                  value={field.placeholder ?? ""}
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
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
                          updateField(field.id, {
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
                      updateField(field.id, {
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
          ))}
        </div>
      )}

      {fieldDraft && (
        <div className="rounded-xl border border-neutral-700 bg-neutral-800/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              New {fieldTypeLabels[fieldDraft.type].toLowerCase()}
            </p>
            <Button
              type="button"
              onClick={() => setFieldDraft(null)}
              className="text-neutral-400 hover:text-white">
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
                    onChange={(e) => updateDraftOptionLabel(fieldDraft.id, index, e.target.value)}
                    className="flex-1 bg-transparent border border-neutral-700 focus:border-neutral-600 rounded-lg px-2 py-1 text-sm text-neutral-100"
                  />

                  <Button
                    type="button"
                    onClick={() => removeDraftOption(fieldDraft.id, index)}
                    className="text-neutral-500 hover:text-white">
                    <TrashIcon />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() => addDraftOption(fieldDraft.id)}
                className="text-xs text-neutral-300 hover:text-white">
                + Add option
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="button"
              onClick={commitDraft}
              className="rounded-lg bg-neutral-200 py-2 text-sm font-semibold text-neutral-900">
              Add to form
            </Button>

            <Button
              type="button"
              onClick={() => setFieldDraft(null)}
              className="rounded-lg border border-neutral-700 py-2 text-sm text-neutral-300 hover:border-neutral-500">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
