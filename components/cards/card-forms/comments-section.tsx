"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addComment, deleteComment } from "@/actions/cards/card.action";
import { CommentWithAuthor } from "@/actions/cards/details.action";
import { useState, useTransition } from "react";

interface CommentsSectionProps {
    cardId: string;
    initialComments: CommentWithAuthor[];
}

const CommentsSection = ({ cardId, initialComments }: CommentsSectionProps) => {
    const [comments, setComments] = useState(initialComments);
    const [body, setBody] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAdd = () => {
        if (!body.trim()) return;
        const formData = new FormData();
        formData.set("cardId", cardId);
        formData.set("body", body);
        startTransition(async () => {
            const result = await addComment(null, formData);
            if (result?.success) {
                setBody("");
            }
        })
    }

    const handleDelete = (commentId: string) => {
        startTransition(async () => {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId))
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <Label>
                <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-muted-foreground" />
                    Comments
                </span>
            </Label>
            <div className="flex flex-col gap-2">
                {comments.map(comment =>
                    <div key={comment.id} className="flex flex-col gap-1 p-2 rounded-md border border-input bg-muted/20">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{comment.author.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(comment.id)}
                                    className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{comment.body}</p>
                    </div>
                )}
            </div>
            <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="resize-none text-xs"
            />
            <button
                type="button"
                disabled={isPending || !body.trim()}
                onClick={handleAdd}
                className="self-end px-2 py-1 rounded-md bg-primary text-primary-foreground text-xs cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Posting..." : "Post"}
            </button>
        </div>
    )
}

export default CommentsSection;