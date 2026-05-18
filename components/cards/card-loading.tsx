const CardLoading = () => {
    return (
        <div className="space-y-3">
            {
                Array.from({ length: 2 }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="size-10 rounded-xl bg-neutral-200" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-24 rounded-full bg-neutral-200" />
                                    <div className="h-2 w-16 rounded-full bg-neutral-100" />
                                </div>
                            </div>

                            <div className="h-5 w-10 rounded-full bg-neutral-200" />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CardLoading;