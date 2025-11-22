import type { Nullable } from "../utils";

type BaseField = {
  id: string;
  label: string;
  required: Nullable<boolean>;
};

export type TextField = BaseField & {
  type: "text";
  placeholder: Nullable<string>;
  defaultValue: Nullable<string>;
};

export type ButtonGroupField = BaseField & {
  type: "buttonGroup";
  options: {
    label: string;
    value: string;
  }[];
  defaultValue: Nullable<string>;
};

export type SelectField = BaseField & {
  type: "select";
  options: {
    label: string;
    value: string;
  }[];
  defaultValue: Nullable<string>;
};

export type FormField = TextField | ButtonGroupField | SelectField;

export type Form = {
  fields: FormField[];
};
