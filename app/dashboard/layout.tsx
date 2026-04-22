import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { findWorkspaceMember } from "@/actions/workspaces/member.action"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const workspaceMember = await findWorkspaceMember();

  const {
    workspaceId,
    role
  } = workspaceMember!;

  return (
    <SidebarProvider>
      <AppSidebar 
        workspaceId={workspaceId}
        role={role}
      />
      <main>
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  )
}