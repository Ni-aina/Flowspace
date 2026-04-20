import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import SignOut from "./sign-out"
import { Account } from "./workspaces/account"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup />
          <Account/>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="flex justify-end">
        <SignOut />
      </SidebarFooter>
    </Sidebar>
  )
}