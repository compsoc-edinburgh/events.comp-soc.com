export function ErrorState({
  title,
  description,
  refetch
}: {
  title: string;
  description: string;
  refetch: () => void;
}) {
  return (
    <div className="min-h-[68vh] flex flex-col items-center justify-center text-white bg-neutral-900">
      <h1 className="font-bold text-3xl mb-6">{title}</h1>
      <p className="text-neutral-400 text-lg mb-4">{description}</p>
      <button
        onClick={refetch}
        className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors text-sm font-medium"
      >
        Try again
      </button>
    </div>
  );
}
