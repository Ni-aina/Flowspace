import { getBoardById, getBoardsByWorkspaceId } from "@/actions/boards/board.action";
import { getListsByBoardId } from "@/actions/lists/list.action";
import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import BoardSpace from "@/components/boards/spaces";
import StoreBoard from "@/components/boards/store-board";
import { StoreInitializer } from "@/components/workspaces/store-initializer";
import { RoleType } from "@/stores/zustands/use-role";
import { redirect } from "next/navigation";

interface BoardPageProps {
    params: Promise<{ boardId: string }>
}

const BoardPage = async ({ params }: BoardPageProps) => {
    const { boardId } = await params;

    const board = await getBoardById(boardId);

    const [
        lists,
        boards,
        workspaceMember
    ] = await Promise.all([
        getListsByBoardId(board.id),
        getBoardsByWorkspaceId(board.workspaceId),
        findWorkspaceMember(board.workspaceId)
    ])

    if (!boards.find(board => board.id === boardId)) redirect("/not-found");

    return (
        <>
            {
                workspaceMember &&
                <StoreInitializer
                    workspaceMemberId={workspaceMember.id}
                    workspaceId={workspaceMember.workspaceId}
                    role={workspaceMember.role as RoleType}
                />
            }
            {
                board && <StoreBoard board={board} />
            }
            <BoardSpace
                board={board}
                lists={lists}
            />
        </>
    )
}

export default BoardPage;