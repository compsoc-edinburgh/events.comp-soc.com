import { z } from "zod";

export const BaseFieldSchema = z.object({
  id: z.string().min(1, "Field id is required"),
  label: z.string().min(1, "Label is required"),
  required: z.boolean().optional()
});

export const TextFieldSchema = BaseFieldSchema.extend({
  type: z.literal("text"),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional()
});

export const OptionSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

export const ButtonGroupFieldSchema = BaseFieldSchema.extend({
  type: z.literal("buttonGroup"),
  options: z.array(OptionSchema).min(1, "At least one option required"),
  defaultValue: z.string().optional()
});

export const SelectFieldSchema = BaseFieldSchema.extend({
  type: z.literal("select"),
  options: z.array(OptionSchema).min(1, "At least one option required"),
  defaultValue: z.string().optional()
});

export const FormFieldSchema = z.discriminatedUnion("type", [
  TextFieldSchema,
  ButtonGroupFieldSchema,
  SelectFieldSchema
]);

const FormSchema = z.object({
  fields: z.array(FormFieldSchema).min(1, "Form must have at least one field")
});

export default FormSchema;
