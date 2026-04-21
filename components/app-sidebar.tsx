import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import SignOut from "./sign-out"
import { Account } from "./workspaces/account"
import Menu from "./workspaces/menu"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup className="flex flex-col space-y-2">
          <Account />
          <Menu />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
    </Sidebar>
  )
}