interface WelcomeDashboardInterface {
    workspaceCount: number;
    boardCountByUser: number;
    cardCount: number;
}

const WelcomeDashboard = ({
    workspaceCount,
    boardCountByUser,
    cardCount
}: WelcomeDashboardInterface) => {

    const stats = [
        {
            label: "Workspaces",
            value: workspaceCount
        },
        {
            label: "Boards",
            value: boardCountByUser
        },
        {
            label: "Tasks",
            value: cardCount
        }
    ]

    return (
        <section className="min-h-screen w-full bg-linear-to-br from-white via-zinc-50 to-indigo-50 text-zinc-900">
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-screen overflow-hidden px-6 py-8 lg:px-14 lg:py-12 gap-5">
                <div className="flex flex-col gap-5 lg:gap-10 lg:col-span-2">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-lg 
                            font-semibold text-white shadow-lg shadow-zinc-300"
                        >
                            F
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">
                                Flowspace
                            </h2>

                            <p className="text-sm text-zinc-500">
                                Creative workspace dashboard
                            </p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className="space-y-5 max-w-3xl">
                            <span
                                className="w-fit rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1 
                                text-xs tracking-[0.3em] text-indigo-500 uppercase"
                            >
                                Dashboard Overview
                            </span>

                            <div className="mt-5 space-y-4">
                                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight lg:text-7xl">
                                    Welcome back to your digital universe
                                </h1>

                                <p className="max-w-2xl text-base leading-relaxed text-zinc-500 lg:text-lg">
                                    Manage projects, track activity, and keep your workflow orbiting smoothly inside one elegant control center.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid gap-5">
                    {
                        stats.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl"
                            >
                                <p className="text-sm text-zinc-500">
                                    {item.label}
                                </p>

                                <div className="mt-4 flex items-end justify-between">
                                    <h2 className="text-4xl font-semibold tracking-tight">
                                        {item.value}
                                    </h2>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default WelcomeDashboard;