"use client";

import { LayoutList } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Block } from "@prisma/client";

interface BlocksSectionProps {
    blocks: Block[];
}

const BlocksSection = ({ blocks }: BlocksSectionProps) => (
    <div className="flex flex-col gap-2">
        <Label>
            <span className="flex items-center gap-1.5">
                <LayoutList size={13} className="text-muted-foreground" />
                Blocks
            </span>
        </Label>
        {blocks.length === 0
            ? <p className="text-xs text-muted-foreground">No blocks yet.</p>
            : <div className="flex flex-col gap-1.5">
                {blocks.map(block =>
                    <div key={block.id} className="px-2 py-1.5 rounded-md border border-input bg-muted/20 text-xs">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{block.type}</span>
                        <p className="mt-0.5">{(block.content as { text?: string }).text ?? ""}</p>
                    </div>
                )}
            </div>
        }
    </div>
)

export default BlocksSection;