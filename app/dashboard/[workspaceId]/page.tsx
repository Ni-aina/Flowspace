import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { StoreInitializer } from "@/components/store-initializer";

interface WorkspaceProps {
    params: Promise<{ workspaceId: string }>
}

const Workspace = async ({ params }: WorkspaceProps) => {
    const { workspaceId } = await params;
    const workspaceMember = await findWorkspaceMember(workspaceId);

    return (
        <div>
            {workspaceMember && <StoreInitializer member={workspaceMember} />}

        </div>
    )
}

export default Workspace;