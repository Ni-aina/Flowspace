import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/sign-in")

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="cursor-pointer"/>
        {children}
      </main>
    </SidebarProvider>
  )
}