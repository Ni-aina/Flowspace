interface CardNotFoundProps {
    title?: string;
    description?: string;
}

const CardNotFound = ({
    title = "Nothing here",
    description = "No items found yet."
}: CardNotFoundProps) => {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="space-y-1">
                <h3 className="text-sm font-medium text-neutral-900">
                    {title}
                </h3>

                <p className="text-xs text-neutral-500">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CardNotFound;