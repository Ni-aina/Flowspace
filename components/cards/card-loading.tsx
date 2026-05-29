const CardLoading = () => {
    return (
        <div className="space-y-3">
            <div
                className="animate-pulse rounded-xl bg-white p-3 shadow-sm"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="size-10 rounded-xl bg-neutral-100" />

                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-24 rounded-full bg-neutral-100" />
                            <div className="h-2 w-16 rounded-full bg-neutral-50" />
                        </div>
                    </div>

                    <div className="h-5 w-10 rounded-full bg-neutral-100" />
                </div>
            </div>
        </div>
    )
}

export default CardLoading;