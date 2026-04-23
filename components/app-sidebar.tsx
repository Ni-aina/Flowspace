import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Account } from "./workspaces/account"
import Menu from "./workspaces/menu"
import { getWorkspaceById } from "@/actions/workspaces/workspace.action";
import { Workspace, WorkspaceMember } from "@prisma/client";

interface AppSidebarProps {
  workspaceMember: WorkspaceMember | null;
  workspaces: Workspace[];
}

export async function AppSidebar({ workspaceMember, workspaces }: AppSidebarProps) {
  const workspace = await getWorkspaceById(workspaceMember!.workspaceId);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup className="flex flex-col space-y-2">
          <Account 
            workspace={workspace}
            role={workspaceMember!.role}
            workspaces={workspaces}
          />
          <Menu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}