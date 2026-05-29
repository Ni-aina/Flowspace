import { getBoardById, getBoardsByWorkspaceId } from "@/actions/boards/board.action";
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
        boards,
        workspaceMember
    ] = await Promise.all([
        getBoardsByWorkspaceId(board.workspaceId),
        findWorkspaceMember(board.workspaceId)
    ])

    if (!boards.find(board => board.id === boardId)) redirect("/not-found");

    return (
        <div>
            {
                workspaceMember &&
                <StoreInitializer
                    workspaceId={workspaceMember.workspaceId}
                    role={workspaceMember.role as RoleType}
                />
            }
            {
                board && <StoreBoard board={board} />
            }
            <BoardSpace />
        </div>
    )
}

export default BoardPage;