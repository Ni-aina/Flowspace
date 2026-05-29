import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Account } from "../workspaces/account";
import Menu from "../workspaces/menu";
import { WorkspacePosition } from "@/types/workspacePosition";

interface AppSidebarProps {
  workspacesPosition: WorkspacePosition[];
}

export function AppSidebar({ workspacesPosition }: AppSidebarProps) {

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup className="flex flex-col space-y-2">
          <Account
            workspacesPosition={workspacesPosition}
          />
          <Menu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
    </Sidebar>
  )
}