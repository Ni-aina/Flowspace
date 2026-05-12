const ItemLoading = () => (
  <div className="relative grid h-[90vh] w-full place-items-center overflow-hidden">
    <div className="absolute h-72 w-72 rounded-full bg-neutral-200/50 blur-3xl" />

    <div className="relative flex flex-col items-center gap-6">
      <div className="relative">
        <div className="h-20 w-20 animate-spin rounded-full border border-neutral-200 border-t-neutral-900" />

        <div className="absolute inset-3 animate-pulse rounded-full bg-black/5 backdrop-blur-sm" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="h-3 w-3 rounded-full bg-neutral-900 shadow-[0_0_20px_rgba(0,0,0,0.2)]" />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <p className="text-sm font-medium tracking-[0.25em] text-neutral-600 uppercase">
          Initialising
        </p>

        <div className="flex items-center justify-center gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
        </div>
      </div>
    </div>
  </div>
)

export default ItemLoading;