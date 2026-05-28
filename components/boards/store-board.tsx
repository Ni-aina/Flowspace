"use client";

import { useBoard } from "@/stores/zustands/use-board";
import { Board } from "@prisma/client";
import { redirect } from "next/navigation";

interface StoreBoardProps {
    board: Board;
}

const StoreBoard = ({ board }: StoreBoardProps) => {
    const setBoard = useBoard(state => state.setBoard);

    if (!board) return redirect("/dashboard");

    setBoard(board);

    return null;
}

export default StoreBoard;
