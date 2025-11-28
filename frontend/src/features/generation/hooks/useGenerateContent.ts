import {
    GeneratorDataContext,
    type GeneratorEntry,
} from "@/context/GeneratorDataContext";
import { useCallback, useContext, useEffect, useRef } from "react";
import { makeEndpoint, makeTitle } from "../lib/generatorCatalogue";
import { parseContent } from "../lib/parseContent";

const emptyEntry: GeneratorEntry = {
    prompt: "",
    cardData: [],
    isLoading: false,
    isSeen: false,
    error: null,
};

export function useGenerateContent(generatorType: string) {
    const { generators, setGenerators } = useContext(GeneratorDataContext);
    const title = makeTitle(generatorType);

    // We only track the *current* request for this hook for `cancel()`
    const controllerRef = useRef<AbortController | null>(null);

    const entry = generators[generatorType] ?? emptyEntry;

    useEffect(() => {
        const generator = generators[generatorType];
        if (
            generator?.cardData?.length > 0 &&
            !generator.isLoading &&
            !generator.isSeen
        ) {
            setGenerators((prev) => {
                const prevEntry: GeneratorEntry =
                    prev[generatorType] ?? emptyEntry;

                return {
                    ...prev,
                    [generatorType]: {
                        ...prevEntry,
                        isSeen: true,
                    },
                };
            });
        }
    }, [generatorType, generators, setGenerators]);

    const generate = useCallback(
        async (count: number, prompt: string, temperature: number = 1) => {
            // New controller for this request (previous one is *not* auto-aborted)
            const controller = new AbortController();
            controllerRef.current = controller;

            // Mark this generatorType as loading, clear error
            setGenerators((prev) => {
                const prevEntry: GeneratorEntry =
                    prev[generatorType] ?? emptyEntry;

                return {
                    ...prev,
                    [generatorType]: {
                        ...prevEntry,
                        isLoading: true,
                        isSeen: false,
                        error: null,
                    },
                };
            });

            try {
                const res = await fetch(
                    `https://api.dng.quest/${makeEndpoint(generatorType)}`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        signal: controller.signal,
                        body: JSON.stringify({
                            count,
                            temperature,
                            ...(prompt ? { userPrompt: prompt } : {}),
                        }),
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                const items = parseContent(json.data.items);

                // Update data + loading for this generatorType
                setGenerators((prev) => {
                    const prevEntry: GeneratorEntry =
                        prev[generatorType] ?? emptyEntry;

                    return {
                        ...prev,
                        [generatorType]: {
                            ...prevEntry,
                            cardData: items,
                            isLoading: false,
                            error: null,
                        },
                    };
                });
            } catch (e) {
                // Ignore AbortError as a "non-error"
                if ((e as DOMException)?.name === "AbortError") {
                    return;
                }

                setGenerators((prev) => {
                    const prevEntry: GeneratorEntry =
                        prev[generatorType] ?? emptyEntry;

                    return {
                        ...prev,
                        [generatorType]: {
                            ...prevEntry,
                            isLoading: false,
                            error:
                                e instanceof Error ? e : new Error(String(e)),
                        },
                    };
                });
            } finally {
                // If this controller is still the current one, clear it
                if (controllerRef.current === controller) {
                    controllerRef.current = null;
                }
            }
        },
        [generatorType, setGenerators]
    );

    const cancel = useCallback(() => {
        if (controllerRef.current) {
            controllerRef.current.abort();
            controllerRef.current = null;
        }

        // Reflect cancellation in UI for this generatorType
        setGenerators((prev) => {
            const prevEntry: GeneratorEntry = prev[generatorType] ?? emptyEntry;

            return {
                ...prev,
                [generatorType]: {
                    ...prevEntry,
                    isLoading: false,
                },
            };
        });
    }, [generatorType, setGenerators]);

    const canCancel = !!controllerRef.current;

    function setPrompt(prompt: string) {
        setGenerators((prev) => {
            const prevEntry: GeneratorEntry = prev[generatorType] ?? emptyEntry;

            return {
                ...prev,
                [generatorType]: {
                    ...prevEntry,
                    prompt: prompt,
                },
            };
        });
    }

    return {
        data: entry.cardData,
        isLoading: entry.isLoading,
        error: entry.error,
        prompt: entry.prompt,
        setPrompt,
        title,
        generate,
        cancel,
        canCancel,
    };
}
