import { Workspace } from "@prisma/client";

export type WorkspacePosition = Workspace & {
    workspaceMemberId: string;
    position: number;
}