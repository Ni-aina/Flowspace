"use client";

import { Tag } from "lucide-react";
import { Label as UILabel } from "@/components/ui/label";
import { addLabelToCard, removeLabelFromCard } from "@/actions/cards/card.action";
import { Label } from "@prisma/client";

interface LabelsSectionProps {
    cardId?: string;
    labels: Label[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
}

const LabelsSection = ({ cardId, labels, selectedIds, onChange }: LabelsSectionProps) => {

    const toggle = async (labelId: string) => {
        const isSelected = selectedIds.includes(labelId);
        onChange(isSelected ? selectedIds.filter(id => id !== labelId) : [...selectedIds, labelId])
        if (!cardId) return;
        isSelected ? await removeLabelFromCard(cardId, labelId) : await addLabelToCard(cardId, labelId)
    }

    return (
        <div className="flex flex-col gap-2">
            <UILabel>
                <span className="flex items-center gap-1.5">
                    <Tag size={13} className="text-muted-foreground" />
                    Labels
                </span>
            </UILabel>
            <div className="flex flex-wrap gap-1.5">
                {labels.map(label =>
                    <button
                        key={label.id}
                        type="button"
                        onClick={() => toggle(label.id)}
                        className={`px-2 py-1 rounded-full text-xs border transition-colors cursor-pointer
                        ${selectedIds.includes(label.id) ? "opacity-100 ring-2 ring-offset-1" : "opacity-50 hover:opacity-80"}`}
                        style={{ backgroundColor: `${label.color}20`, borderColor: label.color, color: label.color }}
                    >
                        {label.name}
                    </button>
                )}
            </div>
        </div>
    )
}

export default LabelsSection;