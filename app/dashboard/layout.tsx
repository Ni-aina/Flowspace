import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { getWorkspacesPosition } from "@/actions/workspaces/member.action";
import { StoreInitializer } from "@/components/workspaces/store-initializer";
import { RoleType } from "@/stores/zustands/use-role";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({
  children
}: LayoutProps) => {

  const [
    workspaceMember,
    workspacesPosition
  ] = await Promise.all([
    findWorkspaceMember(),
    getWorkspacesPosition()
  ])

  return (
    <SidebarProvider>
      {
        workspaceMember &&
        <StoreInitializer
          workspaceMemberId={workspaceMember.id}
          workspaceId={workspaceMember.workspaceId}
          role={workspaceMember.role as RoleType}
        />
      }
      <AppSidebar workspacesPosition={workspacesPosition} />
      <main className="flex-1">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default Layout;