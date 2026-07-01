import { getBoardCountByUser } from "@/actions/boards/board.action";
import { getCardCountByUser } from "@/actions/cards/details.action";
import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { getWorkspaceCountByUser } from "@/actions/workspaces/workspace.action";
import WelcomeDashboard from "@/components/dashboards";
import { StoreInitializer } from "@/components/workspaces/store-initializer";
import { RoleType } from "@/stores/zustands/use-role";

interface WorkspaceProps {
    params: Promise<{ workspaceId: string }>
}

const Workspace = async ({ params }: WorkspaceProps) => {
    const { workspaceId } = await params;
    const [
        workspaceCount,
        workspaceMember,
        boardCount,
        cardCount
    ] = await Promise.all([
        getWorkspaceCountByUser(),
        findWorkspaceMember(workspaceId),
        getBoardCountByUser(workspaceId),
        getCardCountByUser(workspaceId)
    ])


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
            <WelcomeDashboard
                workspaceCount={workspaceCount}
                boardCount={boardCount}
                cardCount={cardCount}
            />
        </>
    )
}

export default Workspace;