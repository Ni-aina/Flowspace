import { getBoardById } from "@/actions/boards/board.action";
import BoardSpace from "@/components/boards/spaces";
import StoreBoard from "@/components/boards/store-board";

interface BoardPageProps {
    params: Promise<{ boardId: string }>
}

const BoardPage = async ({ params }: BoardPageProps) => {
    const { boardId } = await params;

    const board = await getBoardById(boardId);

    return (
        <div>
            {
                board && <StoreBoard board={board} />
            }
            <BoardSpace boardId={boardId} />
        </div>
    )
}

export default BoardPage;