import BoardSpace from "@/components/boards/spaces";
import CardLoading from "@/components/card-loading";

const BoardLoading = () => (
    <div className="flex-1">
        <BoardSpace boardId="" />
        <div className="px-4 lg:px-8 flex flex-wrap items-center gap-5">
            {
                Array.from({ length: 4 }).map((_, index) => (
                    <CardLoading key={index} />
                ))
            }
        </div>
    </div>
)

export default BoardLoading;