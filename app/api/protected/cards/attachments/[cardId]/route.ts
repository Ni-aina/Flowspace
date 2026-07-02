import { getCardAttachments } from "@/actions/cards/details.action";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    _request: NextRequest,
    { params }: { params: Promise<{ cardId: string }> }
) => {
    try {
        const { cardId } = await params;

        if (!cardId) {
            return NextResponse.json({ status: 400, message: "cardId is required" })
        }

        const attachments = await getCardAttachments(cardId);

        return NextResponse.json({ status: 200, data: attachments })
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Unknow error";

        return NextResponse.json({
            status: 500,
            error: `An error occured: ${errorMessage}`
        })
    }
}
