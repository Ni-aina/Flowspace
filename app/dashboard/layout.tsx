import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { getWorkspaces } from "@/actions/workspaces/workspace.action";
import { StoreInitializer } from "@/components/store-initializer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({
  children
}: LayoutProps) => {

  const [
    workspaceMember,
    workspaces
  ] = await Promise.all([
    findWorkspaceMember(),
    getWorkspaces()
  ])

  return (
    <SidebarProvider>
      {workspaceMember && <StoreInitializer member={workspaceMember} />}
      <AppSidebar workspaces={workspaces} />
      <main className="flex-1">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout;