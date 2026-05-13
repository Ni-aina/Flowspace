import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { StoreInitializer } from "@/components/store-initializer";
import { RoleType } from "@/stores/zustands/use-role";

interface WorkspaceProps {
    params: Promise<{ workspaceId: string }>
}

const Workspace = async ({ params }: WorkspaceProps) => {
    const { workspaceId } = await params;
    const workspaceMember = await findWorkspaceMember(workspaceId);

    return (
        <div>
            {
                workspaceMember &&
                <StoreInitializer
                    workspaceId={workspaceMember.workspaceId}
                    role={workspaceMember.role as RoleType}
                />
            }
        </div>
    )
}

export default Workspace;