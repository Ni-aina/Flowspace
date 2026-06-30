import { getBoardById, getBoardsByWorkspaceId } from "@/actions/boards/board.action";
import { getCardsGroupedByListId } from "@/actions/cards/card.action";
import { getListsByBoardId } from "@/actions/lists/list.action";
import { findWorkspaceMember, getWorkspaceMembers } from "@/actions/workspaces/member.action";
import BoardSpace from "@/components/status/grids/spaces";
import StoreCards from "@/components/cards/store-card";
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
        workspaceMember,
        members,
        boards,
        lists,
        cardsByList
    ] = await Promise.all([
        findWorkspaceMember(board.workspaceId),
        getWorkspaceMembers(board.workspaceId),
        getBoardsByWorkspaceId(board.workspaceId),
        getListsByBoardId(board.id),
        getCardsGroupedByListId(board.id)
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

            <StoreCards cardsByList={cardsByList} />

            <BoardSpace
                members={members.map(member => ({
                    id: member.id,
                    name: member.name,
                    avatarUrl: member.avatarUrl
                }))}
                board={board}
                lists={lists}
            />
        </>
    )
}

export default BoardPage;