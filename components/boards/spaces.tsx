"use client";

import { useBoards } from "@/stores/zustands/use-boards";
import { redirect } from "next/navigation";

interface BoardSpaceProps {
    boardId: string;
}

const BoardSpace = ({ boardId }: BoardSpaceProps) => {
    const boards = useBoards(state => state.boards);

    if (!boards.find(board => board.id === boardId)) return redirect("/dashboard");

    return (
        <div>

        </div>
    )
}

export default BoardSpace;