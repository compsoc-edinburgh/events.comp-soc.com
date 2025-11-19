type FieldLabelProps = {
  label: string;
  required?: boolean;
};

function FieldLabel({ label, required }: FieldLabelProps) {
  return (
    <p className="text-xs font-semibold text-neutral-400 mb-1.5 flex items-center gap-1">
      {label}
      {required && <span className="text-red-400">*</span>}
    </p>
  );
}

export default FieldLabel;
