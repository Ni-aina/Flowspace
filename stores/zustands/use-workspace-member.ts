import { WorkspaceMember } from "@prisma/client";
import { create } from "zustand";

interface WorkspaceState {
  workspaceMember: WorkspaceMember | null;
  setWorkspaceMember: (member: WorkspaceMember) => void;
}

export const useWorkspaceMember = create<WorkspaceState>((set) => ({
  workspaceMember: null,
  setWorkspaceMember: (member) => set({ workspaceMember: member }),
}))
