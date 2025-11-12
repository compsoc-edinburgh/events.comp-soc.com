interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <>
      <h2 className="text-xs sm:text-sm text-neutral-400 mb-2 sm:mb-3">
        {title}
      </h2>
      <div className="border-t border-neutral-700 mb-4 sm:mb-6" />
    </>
  );
}

export default SectionHeader;
