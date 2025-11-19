import { useEffect, useRef, useState } from "react";
import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";

type TagEditorProps = {
  tags: string[];
  onChange: (value: string[]) => void;
};

function TagEditor({ tags, onChange }: TagEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) InputRef.current?.focus();
  }, [isAdding]);

  const handleAdd = () => {
    const value = draft.trim();
    if (!value) return;

    if (tags.includes(value)) {
      setDraft("");
      setIsAdding(false);
      return;
    }

    onChange([...tags, value]);
    setDraft("");
    setIsAdding(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
    if (e.key === "Escape") {
      setDraft("");
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {!isAdding ? (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-neutral-700 text-xs text-neutral-400 hover:text-white hover:border-neutral-500 transition">
          <PlusIcon className="w-3.5 h-3.5" />
          Add tag
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-neutral-600 bg-neutral-800">
          <input
            ref={InputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="New tag"
            className="bg-transparent text-sm text-neutral-200 outline-none w-24"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="text-neutral-300 hover:text-white transition">
            <CheckIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default TagEditor;
