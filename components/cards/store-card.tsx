"use client";

import { useCards } from "@/stores/zustands/use-cards";
import { Card } from "@prisma/client";

interface StoreCardsProps {
    cardsByList: Record<string, Card[]>;
}

const StoreCards = ({ cardsByList }: StoreCardsProps) => {
    const setCardsByList = useCards(state => state.setCardsByList);

    setCardsByList(cardsByList);

    return null;
}

export default StoreCards;