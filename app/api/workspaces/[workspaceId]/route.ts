import { getWorkspaceById } from "@/actions/workspaces/workspace.action";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string }> }
) => {
    try {
        const { workspaceId } = await params;

        if (!workspaceId) {
            return NextResponse.json({ status: 400, message: "workspaceId is required" })
        }

        const workspace = await getWorkspaceById(workspaceId);
        revalidatePath("/dashboard");

        return NextResponse.json({ status: 200, data: workspace })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ status: 500, message })
    }
}