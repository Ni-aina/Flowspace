"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addComment, deleteComment } from "@/actions/comments/comment.action";
import { CommentWithAuthor } from "@/actions/cards/details.action";
import { useEffect, useState, useTransition } from "react";
import { Separator } from "@/components/ui/separator";

interface CommentsSectionProps {
    cardId: string;
}

const CommentsSection = ({ cardId }: CommentsSectionProps) => {
    const [comments, setComments] = useState<CommentWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [body, setBody] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAdd = () => {
        if (!body.trim()) return;
        const formData = new FormData();
        formData.set("cardId", cardId);
        formData.set("body", body);
        startTransition(async () => {
            const result = await addComment(null, formData);
            if (result?.comment) {
                const { comment } = result;
                setComments(prev => [...prev, comment])
                setBody("");
            }
        })
    }

    const handleDelete = async (commentId: string) => {
        try {
            setComments(prev => prev.filter(c => c.id !== commentId))
            await deleteComment(commentId);
        } catch {
            setComments(comments);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/api/protected/cards/comments/${cardId}`);
                const result = await response.json();

                if (result.status !== 200) throw new Error(`${result.error}`)
                const { data } = result;
                setComments(data);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        })()
    }, [cardId])

    return (
        <div className="flex flex-col gap-2">
            <Label>
                <span className="flex items-center gap-1.5">
                    <MessageSquare size={13} className="text-muted-foreground" />
                    Comments
                </span>
            </Label>
            {
                loading ?
                    <div className="flex-1 space-y-2 animate-pulse py-2">
                        <div className="h-4 w-1/2 rounded-full bg-primary/20" />
                        <div className="h-3 w-1/3 rounded-full bg-primary/20" />
                    </div>
                    :
                    comments.length ?
                        <div className="flex flex-col gap-2">
                            {comments.map(comment =>
                                <div key={comment.id} className="flex flex-col p-2 rounded-md border border-input bg-muted/20">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium">{comment.author.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(comment.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                        >
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between gap-2">
                                        <p className="text-xs text-muted-foreground">
                                            {comment.body}
                                        </p>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                        :
                        <div className="flex flex-col gap-2 pb-2">
                            <Separator />
                            <p className="text-sm text-muted-foreground">No comments yet</p>
                        </div>
            }
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