import { getCardComments } from "@/actions/cards/details.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) {
    try {
        const { cardId } = await params;

        if (!cardId) {
            return NextResponse.json({ status: 400, message: "cardId is required" })
        }

        const cards = await getCardComments(cardId);

        return NextResponse.json({ status: 200, data: cards })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknow error";
        return NextResponse.json({
            status: 500,
            error: `An error occured: ${errorMessage}`
        })
    }
}