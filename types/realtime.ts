import {
    Board,
    List,
    Workspace,
    Comment,
    Attachment,
    Activity
} from "@prisma/client";
import { WorkspacePosition } from "./workspace-position";
import { CardWithAssignees } from "@/actions/cards/details.action";

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
    card: CardWithAssignees;
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