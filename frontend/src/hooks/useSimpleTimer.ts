import { useEffect, useRef, useState } from "react";

export function useSimpleTimer(timeout = 1200) {
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef<number | null>(null);

    const reset = () => {
        setIsActive(true);

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            setIsActive(false);
            timerRef.current = null;
        }, timeout);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, []);

    return [isActive, reset] as const;
}
