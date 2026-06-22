"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import React, { memo } from "react";

interface CardFieldsProps {
    initialTitle: string;
    initialDescription: string;
    initialDueDate: string;
}

const CardFields = memo(({ initialTitle, initialDescription, initialDueDate }: CardFieldsProps) => {
    const [title, setTitle] = React.useState(initialTitle);
    const [description, setDescription] = React.useState(initialDescription);
    const [dueDate, setDueDate] = React.useState(initialDueDate);

    return (
        <>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder="Card title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Add a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="dueDate">
                    <span className="flex items-center gap-1.5">
                        <CalendarIcon size={13} className="text-muted-foreground" />
                        Due Date
                    </span>
                </Label>
                <Input
                    id="dueDate"
                    name="dueDate"
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
        </>
    )
})

export default CardFields;