import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Account } from "./workspaces/account";
import Menu from "./workspaces/menu";
import { Workspace } from "@prisma/client";

interface AppSidebarProps {
  workspaces: Workspace[];
}

export function AppSidebar({ workspaces }: AppSidebarProps) {

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup className="flex flex-col space-y-2">
          <Account workspaces={workspaces} />
          <Menu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
    </Sidebar>
  )
}