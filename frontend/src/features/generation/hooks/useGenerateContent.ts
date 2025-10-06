import { useCallback, useEffect, useRef, useState } from "react";
import { makeEndpoint, makeTitle } from "../lib/generatorCatalogue";
import { parseContent, type ContentData } from "./../lib/parseContent";

export function useGenerateContent(generatorType: string) {
    const [data, setData] = useState<ContentData[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const title = makeTitle(generatorType);

    // Keep track of the current request so we can cancel/ignore stale results
    const controllerRef = useRef<AbortController | null>(null);
    const requestIdRef = useRef(0);

    useEffect(() => {
        // Cancel in-flight request when the type changes
        controllerRef.current?.abort();
        controllerRef.current = null;

        setData(undefined);
        setIsLoading(false);
        setError(null);
    }, [generatorType]);

    // Abort on unmount
    useEffect(() => {
        return () => {
            controllerRef.current?.abort();
            controllerRef.current = null;
        };
    }, []);

    const generate = useCallback(
        async (count: number, prompt: string, temperature: number = 1) => {
            // New request id
            const reqId = ++requestIdRef.current;

            // Prepare controller and state
            controllerRef.current?.abort(); // optional: cancel any previous request immediately
            const controller = new AbortController();
            controllerRef.current = controller;

            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `https://api.dng.quest/${makeEndpoint(generatorType)}`, // Prod Backend
                    // `http://localhost:5001/dng-app-5f39e/us-central1/api/${makeEndpoint(generatorType)}`, // Local Testing
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        signal: controller.signal,
                        body: JSON.stringify({
                            count,
                            temperature, // you were logging it; now included in the payload
                            ...(prompt ? { userPrompt: prompt } : {}),
                        }),
                    }
                );

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();

                // Only apply if this is still the latest request
                if (reqId === requestIdRef.current) {
                    setData(parseContent(json.data.items));
                }
            } catch (e) {
                // Swallow AbortError as a non-error UX, but keep other errors
                if ((e as DOMException)?.name !== "AbortError") {
                    if (reqId === requestIdRef.current) {
                        setError(e instanceof Error ? e : new Error(String(e)));
                    }
                }
            } finally {
                // Clear controller if it's ours
                if (controllerRef.current === controller) {
                    controllerRef.current = null;
                }
                // Only flip loading if we're still the latest request
                if (reqId === requestIdRef.current) {
                    setIsLoading(false);
                }
            }
        },
        [generatorType]
    );

    const cancel = useCallback(() => {
        controllerRef.current?.abort();
        controllerRef.current = null;
        // Optional: reflect cancellation immediately in UI
        requestIdRef.current++; // invalidate in-flight request
        setIsLoading(false);
    }, []);

    const canCancel = !!controllerRef.current;

    return { data, isLoading, error, title, generate, cancel, canCancel };
}
