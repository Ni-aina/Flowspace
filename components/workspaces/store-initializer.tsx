"use client";

import { useBoards, useLoadingBoards } from "@/stores/zustands/use-boards";
import { RoleType } from "@/stores/zustands/use-role";
import { useRole } from "@/stores/zustands/use-role";
import { useWorkspace } from "@/stores/zustands/use-workspace";
import { useEffect } from "react";

interface StorInitializerInterface {
  workspaceMemberId: string;
  workspaceId: string;
  role: RoleType;
}

export const StoreInitializer = ({
  workspaceMemberId,
  workspaceId,
  role
}: StorInitializerInterface) => {
  const setRole = useRole((s) => s.setRole);
  const setWorkspace = useWorkspace((s) => s.setWorkspace);
  const { setBoards } = useBoards(state => state);
  const { setLoading } = useLoadingBoards();

  useEffect(() => {
    setRole(role);
  }, [role])

  useEffect(() => {
    (async () => {
      try {
        const [
          _,
          resWorkspace,
          resBoards,
        ] = await Promise.all([
          fetch(`/api/protected/workspace-member/${workspaceMemberId}`),
          fetch(`/api/protected/workspaces/${workspaceId}`),
          fetch(`/api/protected/boards/${workspaceId}`)
        ])

        if (resWorkspace.status !== 200) throw new Error(resWorkspace.statusText);
        const { data: workspaceData } = await resWorkspace.json();
        setWorkspace(workspaceData);

        if (resBoards.status !== 200) throw new Error(resBoards.statusText);
        const { data: boardsData } = await resBoards.json();
        setBoards(boardsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })()
  }, [workspaceMemberId, workspaceId])

  return null;
}