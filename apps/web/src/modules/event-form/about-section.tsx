import type { EventCreateInput } from "@monorepo/types";
import type { UseFormRegister } from "react-hook-form";
import { Textarea } from "../../components/textarea";

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

export default AboutSection;
