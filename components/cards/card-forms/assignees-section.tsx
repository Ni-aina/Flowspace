"use client";

import { Users } from "lucide-react";
import { Label } from "@/components/ui/label";

interface User {
    id: string;
    name: string;
    avatarUrl: string | null;
}

interface AssigneesSectionProps {
    members: User[];
    assignedIds: string[];
    onChange: (ids: string[]) => void;
}

const AssigneesSection = ({ members, assignedIds, onChange }: AssigneesSectionProps) => {

    const toggle = async (userId: string) => {
        const isAssigned = assignedIds.includes(userId);
        onChange(isAssigned ? assignedIds.filter(id => id !== userId) : [...assignedIds, userId])
    }

    return (
        <div className="flex flex-col gap-2">
            <Label>
                <span className="flex items-center gap-1.5">
                    <Users size={13} className="text-muted-foreground" />
                    Assignees
                </span>
            </Label>
            <input type="hidden" name="members" value={members.map(member => member.id).join(",")} />
            <input type="hidden" name="assignedIds" value={assignedIds} />
            <div className="flex flex-wrap gap-1.5">
                {members.map(member =>
                    <button
                        key={member.id}
                        type="button"
                        onClick={() => toggle(member.id)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border transition-colors cursor-pointer
                        ${assignedIds.includes(member.id) ? "bg-primary text-primary-foreground border-primary" : "border-input hover:bg-muted"}`}
                    >
                        {member.name}
                    </button>
                )}
            </div>
        </div>
    )
}

export default AssigneesSection;