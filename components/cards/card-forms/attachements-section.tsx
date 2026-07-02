"use client";

import { Paperclip, ExternalLink, Trash2, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Attachment } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { addAttachments, deleteAttachment } from "@/actions/attachments/attachment.action";
import { useUploadThing } from "@/utils/uploadthing";

interface AttachmentsSectionProps {
    cardId: string;
}

const AttachmentsSection = ({ cardId }: AttachmentsSectionProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { startUpload, isUploading } = useUploadThing("attachmentUploader", {
        onClientUploadComplete: async (files) => {
            const result = await addAttachments(files.map(file => ({
                cardId,
                url: file.ufsUrl,
                uploadKey: file.key,
                filename: file.name,
                sizeBytes: file.size
            })))

            if (result.error) {
                setError(result.error);
                return;
            }

            setAttachments(result.attachments ?? []);
        },
        onUploadError: (uploadError) => {
            setError(uploadError.message);
        }
    })

    const handleUpload = (files: FileList | null) => {
        setError("");
        const selectedFiles = Array.from(files ?? []);

        if (!selectedFiles.length) return;

        startUpload(selectedFiles);
    }

    const handleDelete = async (attachmentId: string) => {
        const previousAttachments = attachments;
        setAttachments(prev => prev.filter(attachment => attachment.id !== attachmentId))

        try {
            const result = await deleteAttachment(attachmentId);

            if (!result.success) {
                setAttachments(previousAttachments)
            }
        } catch (deleteError) {
            const message = deleteError instanceof Error ? deleteError.message : "Failed to delete attachment";
            setError(message);
            setAttachments(previousAttachments)
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`/api/protected/cards/attachments/${cardId}`);
                const result = await response.json();

                if (result.status !== 200) throw new Error(`${result.error}`)

                setAttachments(result.data);
            } catch (fetchError) {
                const message = fetchError instanceof Error ? fetchError.message : "Failed to load attachments";
                setError(message);
            } finally {
                setLoading(false);
            }
        })()
    }, [cardId])

    return (
        <div className="flex flex-col gap-2">
            <Label>
                <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                        <Paperclip size={13} className="text-muted-foreground" />
                        Attachments
                    </span>
                    <button
                        type="button"
                        disabled={isUploading}
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center gap-1 px-2 py-1 rounded-md border border-input text-xs font-normal cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Upload size={11} />
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>
                </span>
            </Label>
            <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={(event) => handleUpload(event.target.files)}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
            {loading
                ? <div className="h-8 rounded-md bg-primary/20 animate-pulse" />
                : attachments.length === 0
                    ? <p className="text-xs text-muted-foreground">No attachments yet.</p>
                    : <div className="flex flex-col gap-1.5">
                        {attachments.map(attachment =>
                            <div
                                key={attachment.id}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-input hover:bg-muted transition-colors text-xs"
                            >
                                <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-w-0 flex-1 items-center gap-2"
                                >
                                    <Paperclip size={11} className="text-muted-foreground shrink-0" />
                                    <span className="flex-1 truncate">{attachment.filename}</span>
                                    <span className="text-muted-foreground shrink-0">{(attachment.sizeBytes / 1024).toFixed(1)}KB</span>
                                    <ExternalLink size={11} className="text-muted-foreground shrink-0" />
                                </a>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(attachment.id)}
                                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={11} />
                                </button>
                            </div>
                        )}
                    </div>
            }
        </div>
    )
}

export default AttachmentsSection;
