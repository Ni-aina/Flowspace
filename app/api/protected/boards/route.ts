import { getBoardsByWorkspaceId } from "@/actions/boards/board.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json(
                { error: "Workspace ID is required" },
                { status: 400 }
            )
        }

        const boards = await getBoardsByWorkspaceId(workspaceId);
        return NextResponse.json(boards);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknow error";
        return NextResponse.json({
            status: 500,
            error: `An error occured: ${errorMessage}`
        })
    }
}