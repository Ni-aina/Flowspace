import { getBoardsByWorkspaceId } from "@/actions/boards/board.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    try {
        const { workspaceId } = await params;

        if (!workspaceId) {
            return NextResponse.json({ status: 400, message: "workspaceId is required" })
        }

        const boards = await getBoardsByWorkspaceId(workspaceId);
        return NextResponse.json({ status: 200, data: boards })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknow error";
        return NextResponse.json({
            status: 500,
            error: `An error occured: ${errorMessage}`
        })
    }
}