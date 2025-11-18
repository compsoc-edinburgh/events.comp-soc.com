import { Spinner } from "../../components/spinner.tsx";

export function LoadingState() {
  return (
    <div className="min-h-[68vh] flex items-center justify-center text-white bg-neutral-900">
      <Spinner className="size-8 text-neutral-400" />
    </div>
  );
}
