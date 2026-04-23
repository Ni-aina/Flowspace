import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { findWorkspaceMember } from "@/actions/workspaces/member.action"
import { getWorkspaces } from "@/actions/workspaces/workspace.action";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const [
    workspaceMember,
    workspaces
  ] = await Promise.all([
    findWorkspaceMember(),
    getWorkspaces()
  ])

  return (
    <SidebarProvider>
      <AppSidebar 
        workspaceMember={workspaceMember}
        workspaces={workspaces}
      />
      <main className="w-full h-full">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  )
}