"use client";

import { Paperclip, ExternalLink } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Attachment } from "@prisma/client";

interface AttachmentsSectionProps {
    attachments: Attachment[];
}

const AttachmentsSection = ({ attachments }: AttachmentsSectionProps) => (
    <div className="flex flex-col gap-2">
        <Label>
            <span className="flex items-center gap-1.5">
                <Paperclip size={13} className="text-muted-foreground" />
                Attachments
            </span>
        </Label>
        {attachments.length === 0
            ? <p className="text-xs text-muted-foreground">No attachments yet.</p>
            : <div className="flex flex-col gap-1.5">
                {attachments.map(a =>
                    <a
                        key={a.id}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-input hover:bg-muted transition-colors text-xs"
                    >
                        <Paperclip size={11} className="text-muted-foreground shrink-0" />
                        <span className="flex-1 truncate">{a.filename}</span>
                        <span className="text-muted-foreground shrink-0">{(a.sizeBytes / 1024).toFixed(1)}KB</span>
                        <ExternalLink size={11} className="text-muted-foreground shrink-0" />
                    </a>
                )}
            </div>
        }
    </div>
)

export default AttachmentsSection;