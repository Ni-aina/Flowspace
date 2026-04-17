import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import SignOut from "./sign-out"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="px-2">
        <SidebarGroup />
          <Link 
            href="/"
            className="flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">FS</span>
            </div>
            <span className="font-bold text-xl">Flowspace</span>
          </Link>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="flex justify-end">
        <SignOut />
      </SidebarFooter>
    </Sidebar>
  )
}