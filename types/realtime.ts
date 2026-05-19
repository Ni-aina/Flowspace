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

export type EntityType =
    | "workspace"
    | "board"
    | "list"
    | "card"
    | "comment"
    | "attachment"
    | "label"
    | "activity";

export type EntityMap = {
    workspace: Workspace;
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