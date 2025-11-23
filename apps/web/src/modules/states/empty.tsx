export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-[65vh] flex flex-col items-center py-20 text-white">
      <h1 className="font-bold text-3xl mb-6">{title}</h1>
      <p className="text-neutral-400 text-lg">{description}</p>
    </div>
  );
}
