type BaseField = {
  key: string;
  label: string;
  required?: boolean;
};

export type TextField = BaseField & {
  type: "text";
  placeholder?: string;
  defaultValue?: string;
};

export type ButtonGroupField = BaseField & {
  type: "buttonGroup";
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
};

export type SelectField = BaseField & {
  type: "select";
  options: {
    label: string;
    value: string;
  }[];
  defaultValue?: string;
};

export type FormField = TextField | ButtonGroupField | SelectField;

export type Form = {
  fields: FormField[];
};
