import { EventState } from "@monorepo/types";
import { cn } from "../lib/utils.ts";
import { Button } from "../components/button.tsx";

type VisibilitySectionProps = {
  currentState: EventState;
  isSubmitting: boolean;
  onStateChange: (state: EventState) => void;
  onSubmit: () => void;
};

function VisibilitySection({
  currentState,
  isSubmitting,
  onStateChange,
  onSubmit
}: VisibilitySectionProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/10 p-3 space-y-6">
      <div className="grid gap-3">
        {[EventState.Draft, EventState.Uploaded].map((state) => (
          <button
            key={state}
            type="button"
            onClick={() => onStateChange(state)}
            className={cn(
              "rounded-xl border px-3 py-3 text-left text-sm transition",
              currentState === state
                ? "border-neutral-600 bg-neutral-800"
                : "border-neutral-800 hover:border-neutral-600"
            )}>
            <p className="font-semibold">{state === EventState.Draft ? "Draft" : "Active"}</p>
            <p className="text-neutral-400">
              {state === EventState.Draft
                ? "Only organisers can see this."
                : "Appears in search once approved."}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-1">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-lg bg-neutral-200 text-neutral-900 py-2 px-4 text-sm font-semibold hover:bg-white disabled:opacity-75">
          {currentState === EventState.Uploaded ? "Upload" : "Save"}
        </Button>
      </div>
    </div>
  );
}

export default VisibilitySection;
