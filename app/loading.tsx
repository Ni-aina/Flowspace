export default function AppLoading() {
  return (
    <div className="relative grid h-dvh w-full place-items-center overflow-hidden bg-neutral-950">
      <div className="absolute h-72 w-72 rounded-full bg-neutral-800/30 blur-3xl" />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 animate-spin rounded-full border border-neutral-700 border-t-white" />

          <div className="absolute inset-3 animate-pulse rounded-full bg-white/10 backdrop-blur-sm" />

          <div className="absolute inset-0 grid place-items-center">
            <div className="h-3 w-3 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-sm font-medium tracking-[0.25em] text-neutral-300 uppercase">
            Loading
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
}