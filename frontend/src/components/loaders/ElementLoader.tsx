import { Center, Transition } from "@mantine/core";
import React, { useEffect, useState } from "react";

interface ElementLoaderProps {
    elements: React.ReactNode[];
    interval?: number; // ms
}

export const ElementLoader = ({
    elements,
    interval = 5000,
}: ElementLoaderProps) => {
    const [shuffled, setShuffled] = useState<React.ReactNode[]>([]);
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    // Smooth wiggle animation style
    // const smoothWiggleAnimation: React.CSSProperties = {
    //     animation: "smooth-wiggle 10s ease-in-out infinite", // slow & smooth
    //     display: "inline-block", // ensure transform origin works
    // };

    // Inject keyframes into the document head (once)
    const injectWiggleKeyframes = () => {
        // Only inject once
        if (document.getElementById("smooth-wiggle-keyframes")) return;

        const style = document.createElement("style");
        style.id = "smooth-wiggle-keyframes";
        style.innerHTML = `
      @keyframes smooth-wiggle {
        0% { transform: rotate(2.5deg); }
        50% { transform: rotate(-2.5deg); }
        100% { transform: rotate(2.5deg); }
      }
    `;
        document.head.appendChild(style);
    };

    useEffect(() => {
        injectWiggleKeyframes();
    }, []);

    // Shuffle elements once at mount
    useEffect(() => {
        const shuffledElements = [...elements].sort(() => Math.random() - 0.5);
        setShuffled(shuffledElements);
    }, [elements]);

    // Cycle through shuffled elements
    useEffect(() => {
        if (shuffled.length <= 1) return;

        const timer = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % shuffled.length);
                setVisible(true);
            }, 300);
        }, interval);

        return () => clearInterval(timer);
    }, [shuffled, interval]);

    return (
        <Center style={{ height: "100%" }}>
            <Transition
                mounted={visible}
                transition='fade'
                duration={300}
                timingFunction='ease'
            >
                {(styles) => <div style={{ ...styles }}>{shuffled[index]}</div>}
            </Transition>
        </Center>
    );
};
