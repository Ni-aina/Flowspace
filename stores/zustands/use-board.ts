import { Board } from "@prisma/client";
import { create } from "zustand";

interface BoardState {
    board: Board;
    setBoard: (board: Board) => void;
}

export const useBoard = create<BoardState>((set) => ({
    board: {} as Board,
    setBoard: (board: Board) => set({ board })
}))