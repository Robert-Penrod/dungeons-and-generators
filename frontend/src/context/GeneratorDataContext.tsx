import type { ContentData } from "@/features/lib/parseContent";
import React, { createContext, useState } from "react";

export type GeneratorEntry = {
    prompt: string;
    cardData: ContentData[];
    isLoading: boolean;
    isSeen: boolean;
    error: Error | null;
};

type GeneratorDataContextType = {
    generators: Record<string, GeneratorEntry>;
    setGenerators: React.Dispatch<
        React.SetStateAction<Record<string, GeneratorEntry>>
    >;
};

export const GeneratorDataContext = createContext<GeneratorDataContextType>({
    generators: {},
    setGenerators: () => {},
});

export function GeneratorDataProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [generators, setGenerators] = useState<
        Record<string, GeneratorEntry>
    >({});

    return (
        <GeneratorDataContext.Provider value={{ generators, setGenerators }}>
            {children}
        </GeneratorDataContext.Provider>
    );
}
