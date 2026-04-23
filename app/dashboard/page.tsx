import { findWorkspaceMember } from "@/actions/workspaces/member.action";
import { redirect } from "next/navigation";

const Dashboard = async () => {
    const workspaceMember = await findWorkspaceMember();

    return redirect(`/dashboard/${workspaceMember?.workspaceId}`);
}
 
export default Dashboard;