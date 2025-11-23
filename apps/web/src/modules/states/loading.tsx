import { Spinner } from "../../components/spinner.tsx";

export function LoadingState() {
  return (
    <div className="min-h-[65vh] flex items-center justify-center text-white">
      <Spinner className="size-8 text-neutral-400" />
    </div>
  );
}
