import BoardSpace from "@/components/boards/spaces";

const BoardLoading = () => (
    <div className="flex flex-col gap-5">
        <BoardSpace />
        <div className="grid h-[70vh] w-full place-items-center">
            <div className="flex items-center justify-center gap-3">
                <span className="h-3 w-3 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.3s]" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-neutral-300 [animation-delay:-0.15s]" />
                <span className="h-3 w-3 animate-bounce rounded-full bg-neutral-300" />
            </div>
        </div>
    </div>
)

export default BoardLoading;