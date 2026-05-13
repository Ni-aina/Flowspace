import { create } from "zustand";

export type RoleType = "owner" | "invited" | "member";

interface RoleState {
    role: RoleType;
    setRole: (role: RoleType) => void;
}

export const useRole = create<RoleState>((set) => ({
    role: "member" as RoleType,
    setRole: (role: RoleType) => set({ role })
}))