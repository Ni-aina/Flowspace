interface WorkspaceProps {
    params: Promise<{ workspaceId: string }>
}

const Workspace = async ({ params }: WorkspaceProps) => {
    const { workspaceId } = await params;

    return (
        <div>

        </div>
    )
}

export default Workspace;