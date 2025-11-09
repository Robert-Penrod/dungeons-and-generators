import type { ContentData } from "@/features/generation/lib/parseContent";
import React, { createContext, useState } from "react";

type GeneratedCardContextType = {
    cardData: ContentData[][];
    addContentCard: (tabIndex: number, card: ContentData) => void;
    setCardData: React.Dispatch<React.SetStateAction<ContentData[][]>>;
    clearContentCards: (tabIndex: number) => void;
};

export const GeneratedCardContext =
    createContext<GeneratedCardContextType | null>(null);

export function GeneratedCardProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cardData, setCardData] = useState<ContentData[][]>([]);

    const addContentCard = (tabIndex: number, card: ContentData) => {
        setCardData((prev) => {
            const newCards = [...prev];
            if (!newCards[tabIndex]) newCards[tabIndex] = []; // create tab if missing
            newCards[tabIndex] = [...newCards[tabIndex], card]; // add new card
            return newCards;
        });
    };

    const clearContentCards = (tabIndex: number) => {
        setCardData((prev) => {
            const newCards = [...prev];
            if (newCards[tabIndex]) newCards[tabIndex] = [];
            return newCards;
        });
    };

    return (
        <GeneratedCardContext.Provider
            value={{ cardData, setCardData, addContentCard, clearContentCards }}
        >
            {children}
        </GeneratedCardContext.Provider>
    );
}
