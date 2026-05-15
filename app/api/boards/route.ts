import { getBoards } from "@/actions/workspaces/board.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
    try {
        const boards = await getBoards();
        return NextResponse.json(boards);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknow error";
        return NextResponse.json({
            status: 500,
            error: `An error occured: ${errorMessage}`
        })
    }
}