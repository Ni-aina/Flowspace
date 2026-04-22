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

interface AppSidebarProps {
  workspaceId: string;
  role: string;
}

export async function AppSidebar({ workspaceId, role }: AppSidebarProps) {
  const workspace = await getWorkspaceById(workspaceId);

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup className="flex flex-col space-y-2">
          <Account 
            workspace={workspace}
            role={role}
          />
          <Menu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}