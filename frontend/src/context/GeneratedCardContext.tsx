import type { ContentData } from "@/features/generation/lib/parseContent";
import { createContext, useState } from "react";

export const GeneratedCardContext = createContext<GeneratedCardContextType>({
    cardData: {},
    setCardData: () => {},
});

type GeneratedCardContextType = {
    cardData: Record<string, ContentData[]>;
    setCardData: React.Dispatch<
        React.SetStateAction<Record<string, ContentData[]>>
    >;
};

export function GeneratedCardProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cardData, setCardData] = useState<Record<string, ContentData[]>>({});

    return (
        <GeneratedCardContext.Provider value={{ cardData, setCardData }}>
            {children}
        </GeneratedCardContext.Provider>
    );
}
