"use client";

import { CardWithAssignees } from "@/actions/cards/details.action";
import { useCards } from "@/stores/zustands/use-cards";
import { useEffect } from "react";

interface StoreCardsProps {
    cardsByList: Record<string, CardWithAssignees[]>;
}

const StoreCards = ({ cardsByList }: StoreCardsProps) => {
    const setCardsByList = useCards(state => state.setCardsByList);

    useEffect(() => {
        setCardsByList(cardsByList);
    }, [])

    return null;
}

export default StoreCards;