function NotFoundLayout() {
  return (
    <div className="w-full h-[85vh] flex items-center justify-center">
      <div className="max-w-105 rounded-lg border border-neutral-800 bg-neutral-900/80 shadow-xl">
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
          <span className="text-sm text-neutral-300">System Message</span>
          <div className="flex gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-neutral-400">
            CompSocOS isn't ready to display this page yet.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundLayout
