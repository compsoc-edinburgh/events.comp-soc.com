import { z } from "zod";

const BaseFieldSchema = z.object({
  id: z.string().min(1, "Field id is required"),
  label: z.string().min(1, "Label is required"),
  required: z.boolean().optional()
});

const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional()
});

const OptionSchema = z.object({
  label: z.string().min(1, "Option label is required"),
  value: z.string().min(1, "Option value is required")
});

const ButtonGroupFieldSchema = BaseFieldSchema.extend({
  type: z.literal("buttonGroup"),
  options: z.array(OptionSchema).min(1, "At least one option required"),
  defaultValue: z.string().optional()
});

const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(OptionSchema).min(1, "At least one option required"),
  defaultValue: z.string().optional()
});

export const FormFieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  ButtonGroupFieldSchema,
  SelectFieldSchema
]);

export const FormSchema = z.object({
  fields: z.array(FormFieldSchema).min(1, "Form must have at least one field")
});

export type FormFieldInput = z.infer<typeof FormFieldSchema>;
export type FormInput = z.infer<typeof FormSchema>;
