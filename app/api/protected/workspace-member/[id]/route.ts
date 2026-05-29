import { setWorkspaceLastUsed } from "@/actions/workspaces/member.action";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ status: 400, message: "workspace member id is required" })
        }
        await setWorkspaceLastUsed(id);

        return NextResponse.json({ status: 200, data: true })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ status: 500, message })
    }
}