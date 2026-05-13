"use client";

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
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      if (response.status !== 200) return;
      const { data } = await response.json();
      setWorkspace(data);
    })()
  }, [workspaceId])

  return null;
}