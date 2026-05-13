import { create } from "zustand";

export type RoleType = "owner" | "invited" | null;

interface RoleState {
    role: RoleType;
    setRole: (role: RoleType) => void;
}

export const useRole = create<RoleState>((set) => ({
    role: null,
    setRole: (role: RoleType) => set({ role })
}))