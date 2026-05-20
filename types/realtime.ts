import {
    Board,
    Card,
    List,
    Workspace,
    Comment,
    Attachment,
    Activity,
    Label
} from "@prisma/client";
import { WorkspacePosition } from "./workspacePosition";

export type EntityType =
    | "workspace"
    | "workspacePosition"
    | "board"
    | "list"
    | "card"
    | "comment"
    | "attachment"
    | "label"
    | "activity";

export type EntityMap = {
    workspace: Workspace;
    workspacePosition: WorkspacePosition;
    board: Board;
    list: List;
    card: Card;
    comment: Comment;
    attachment: Attachment;
    label: Label;
    activity: Activity;
}

export type WorkspaceEvent<E extends EntityType = EntityType> =
    | {
        entity: E;
        action: "created" | "updated" | "deleted";
        payload: EntityMap[E];
    }
    | {
        entity: E;
        action: "moved";
        payload: EntityMap[E][];
    }