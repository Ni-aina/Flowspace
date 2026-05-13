import { Workspace } from "@prisma/client";
import { create } from "zustand";

interface WorkspaceState {
  workspace: Workspace | null;
  setWorkspace: (workspace: Workspace | null) => void;
}

export const useWorkspace = create<WorkspaceState>((set) => ({
  workspace: null,
  setWorkspace: (workspace) => set({ workspace })
}))