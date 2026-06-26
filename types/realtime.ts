import {
    Board,
    Card,
    List,
    Workspace,
    Comment,
    Attachment,
    Activity
} from "@prisma/client";
import { WorkspacePosition } from "./workspace-position";

export type EntityType =
    | "workspace"
    | "workspacePosition"
    | "board"
    | "list"
    | "card"
    | "comment"
    | "attachment"
    | "activity";

export type EntityMap = {
    workspace: Workspace;
    workspacePosition: WorkspacePosition;
    board: Board;
    list: List;
    card: Card;
    comment: Comment;
    attachment: Attachment;
    activity: Activity;
}

export type WorkspaceEvent<E extends EntityType = EntityType> =
    | {
        entity: E;
        action: "created" | "updated" | "deleted";
        room: string;
        payload: EntityMap[E];
    }
    | {
        entity: E;
        action: "moved";
        room: string;
        payload: EntityMap[E][];
    }