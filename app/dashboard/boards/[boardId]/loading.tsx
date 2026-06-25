import BoardSpace from "@/components/boards/spaces";
import CardLoading from "@/components/card-loading";
import { Board } from "@prisma/client";

const BoardLoading = () => (
    <div className="flex-1">
        <BoardSpace board={{} as Board} />
        <div className="px-4 lg:px-8 flex flex-wrap items-center gap-5">
            {
                Array.from({ length: 3 }).map((_, index) => (
                    <CardLoading key={index} />
                ))
            }
        </div>
    </div>
)

export default BoardLoading;