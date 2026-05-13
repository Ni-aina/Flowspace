"use client";

import { getWorkspaceById, revalidateDashboard } from "@/actions/workspaces/workspace.action";
import { RoleType } from "@/stores/zustands/use-role";
import { useRole } from "@/stores/zustands/use-role";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect } from "react";

interface StorInitializerInterface {
  workspaceId: string;
  role: RoleType;
}

export const StoreInitializer = ({ workspaceId, role }: StorInitializerInterface) => {
  const setRole = useRole((s) => s.setRole);
  const setWorkspace = useWorkspace((s) => s.setWorkspace);

  useEffect(() => {
    setRole(role);
  }, [role])

  useEffect(() => {
    (async () => {
      const workspace = await getWorkspaceById(workspaceId);
      await revalidateDashboard();
      setWorkspace(workspace);
    })()
  }, [workspaceId])

  return null;
}