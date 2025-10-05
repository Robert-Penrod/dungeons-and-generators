import { Center, Text, Transition, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface WordLoaderProps {
    messages: string[];
    interval?: number; // in milliseconds
}

export const WordLoader: React.FC<WordLoaderProps> = ({
    messages,
    interval = 2000,
}) => {
    const [shuffledMessages, setShuffledMessages] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);
    const theme = useMantineTheme();

    // Shuffle messages once
    useEffect(() => {
        const shuffled = [...messages].sort(() => Math.random() - 0.5);
        setShuffledMessages(shuffled);
    }, [messages]);

    // Animation + message rotation
    useEffect(() => {
        if (shuffledMessages.length <= 1) return;

        const timer = setInterval(() => {
            // Fade out
            setVisible(false);

            // Change message after fade-out duration (300ms)
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % shuffledMessages.length);
                setVisible(true); // Fade back in
            }, 300);
        }, interval);

        return () => clearInterval(timer);
    }, [shuffledMessages, interval]);

    return (
        <Center style={{ height: "100%" }}>
            <Transition
                mounted={visible}
                transition='fade'
                duration={300}
                timingFunction='ease'
            >
                {(styles) => (
                    <Text
                        c={theme.colors.blue[6]}
                        style={styles}
                        size='lg'
                        ta='center'
                        w={500}
                    >
                        {shuffledMessages[index] || ""}
                    </Text>
                )}
            </Transition>
        </Center>
    );
};
