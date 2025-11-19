import { useEffect, useRef } from "react";
import type { ComponentProps } from "react";
import { Textarea } from "./textarea.tsx";

function AutoTextarea({ className, ...props }: ComponentProps<"textarea">) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const handleResize = () => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "auto"; // reset
    el.style.height = `${el.scrollHeight}px`; // grow
  };

  useEffect(() => {
    handleResize();
  }, []);

  return (
    <Textarea
      {...props}
      onInput={handleResize}
      className="w-full bg-transparent border border-transparent focus:border-neutral-700 rounded-2xl px-2 py-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight placeholder:text-neutral-600 resize-none focus:bg-neutral-800/40 overflow-hidden"
      rows={1}
    />
  );
}

export default AutoTextarea;
