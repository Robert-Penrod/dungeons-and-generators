import { Center, Text, Transition, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface WordLoaderProps {
    messages: string[];
    interval?: number;
}

export const WordLoader: React.FC<WordLoaderProps> = ({
    messages,
    interval = 2000,
}) => {
    const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const [dotIndex, setDotIndex] = useState(0);
    const theme = useMantineTheme();

    const dotFrames = ["", ".", "..", "..."];

    // Shuffle once
    useEffect(() => {
        const shuffled = [...messages].sort(() => Math.random() - 0.5);
        setShuffledMessages(shuffled);
    }, [messages]);

    // Rotate messages
    useEffect(() => {
        if (shuffledMessages.length <= 1) return;

        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % shuffledMessages.length);
                setDotIndex(0); // ✅ reset dots when message changes
                setVisible(true);
            }, 300);
        }, interval);

        return () => clearInterval(timer);
    }, [shuffledMessages, interval]);

    // Animate dots
    useEffect(() => {
        const dotTimer = setInterval(() => {
            setDotIndex((prev) => (prev + 1) % dotFrames.length);
        }, 1600);
        return () => clearInterval(dotTimer);
    }, []);

    return (
        <Center style={{ height: "100%" }}>
            <Transition
                mounted={visible}
                transition='fade'
                duration={300}
                timingFunction='ease'
            >
                {(styles) => (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Text
                            c={theme.colors.blue[6]}
                            size='lg'
                            style={{
                                ...styles,
                                whiteSpace: "nowrap",
                                marginLeft: "1.5em",
                            }}
                            ta='left'
                        >
                            {shuffledMessages[index]}
                            <span
                                style={{
                                    display: "inline-block",
                                    minWidth: "1.5em",
                                }}
                            >
                                {dotFrames[dotIndex]}
                                <span style={{ visibility: "hidden" }}>
                                    ...
                                </span>
                            </span>
                        </Text>
                    </div>
                )}
            </Transition>
        </Center>
    );
};
