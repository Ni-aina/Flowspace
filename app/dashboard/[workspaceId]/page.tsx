import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import WelcomeDashboard from "@/components/dashboards";
import { StoreInitializer } from "@/components/workspaces/store-initializer";
import { RoleType } from "@/stores/zustands/use-role";

interface WorkspaceProps {
    params: Promise<{ workspaceId: string }>
}

const Workspace = async ({ params }: WorkspaceProps) => {
    const { workspaceId } = await params;
    const workspaceMember = await findWorkspaceMember(workspaceId);

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
            <WelcomeDashboard />
        </>
    )
}

export default Workspace;