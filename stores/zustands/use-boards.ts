import { Board } from "@prisma/client";
import { create } from "zustand";

interface BoardsState {
    boards: Board[];
    setBoards: (boards: Board[]) => void;
}

export const useBoards = create<BoardsState>((set) => ({
    boards: [],
    setBoards: (boards: Board[]) => set({ boards })
}))