"use client";

import { useRef } from "react";
import { WorkspaceMember } from "@prisma/client";
import { useWorkspaceMember } from "@/stores/zustands/use-workspace-member";

export function StoreInitializer({ member }: { member: WorkspaceMember }) {
  const initialized = useRef(false);
  
  if (!initialized.current) {
    useWorkspaceMember.getState().setWorkspaceMember(member);
    initialized.current = true;
  }
  
  return null;
}