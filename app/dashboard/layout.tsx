import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { getWorkspaces } from "@/actions/workspaces/workspace.action";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    workspaceId: string;
  }>
}

const Layout = async ({
  children,
  params
}: LayoutProps) => {
  const { workspaceId } = await params;

  const [
    workspaceMember,
    workspaces
  ] = await Promise.all([
    findWorkspaceMember(workspaceId),
    getWorkspaces()
  ])

  return (
    <SidebarProvider>
      <AppSidebar
        workspaceMember={workspaceMember}
        workspaces={workspaces}
      />
      <main className="flex-1">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout;