interface TagProps {
  children: React.ReactNode;
}

function Tag({ children }: TagProps) {
  return (
    <span className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-800 rounded-full whitespace-nowrap">
      {children}
    </span>
  );
}

export default Tag;
