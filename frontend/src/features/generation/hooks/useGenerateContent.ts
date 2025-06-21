import { useCallback, useEffect, useState } from "react";
import { makeEndpoint, makeTitle } from "../lib/generatorCatalogue";
import { parseContent, type ContentData } from "./../lib/parseContent";

export function useGenerateContent(generatorType: string) {
    const [data, setData] = useState<ContentData[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const title = makeTitle(generatorType);

    useEffect(() => {
        setData(undefined);
        setIsLoading(false);
        setError(null);
    }, [generatorType]);

    const generate = useCallback(
        async (count: number, prompt: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `https://api.dng.quest/${makeEndpoint(generatorType)}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            count,
                            ...(prompt ? { userPrompt: prompt } : {}),
                        }),
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                setData(parseContent(json.data.items));
            } catch (e) {
                setError(e instanceof Error ? e : new Error(String(e)));
            } finally {
                setIsLoading(false);
            }
        },
        [generatorType]
    );

    return { data, isLoading, error, title, generate };
}
