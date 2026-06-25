import { Card } from "@prisma/client";
import { create } from "zustand";

interface CardsState {
    cardsByList: Record<string, Card[]>
    setCardsByList: (cardsByList: Record<string, Card[]>) => void
    addCard: (listId: string, card: Card) => void
    removeCard: (listId: string, cardId: string) => void
    setCardsForList: (listId: string, cards: Card[]) => void
}

export const useCards = create<CardsState>((set) => ({
    cardsByList: {},
    setCardsByList: (cardsByList) =>
        set({ cardsByList }),
    addCard: (listId, card) =>
        set((state) => ({
            cardsByList: {
                ...state.cardsByList,
                [listId]: [...(state.cardsByList[listId] || []), card]
            }
        })),
    removeCard: (listId, cardId) =>
        set((state) => ({
            cardsByList: {
                ...state.cardsByList,
                [listId]: (state.cardsByList[listId] || []).filter((card) => card.id !== cardId)
            }
        })),
    setCardsForList: (listId, cards) =>
        set((state) => ({
            cardsByList: {
                ...state.cardsByList,
                [listId]: cards
            }
        }))
}))