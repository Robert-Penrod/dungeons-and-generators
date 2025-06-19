import {
    Button,
    Center,
    Divider,
    Loader,
    SimpleGrid,
    Stack,
    Textarea,
    Title,
} from "@mantine/core";
import { useState } from "react";
import { RiAiGenerate } from "react-icons/ri";
import ContentCard from "../components/ContentCard";

interface MagicItemData {
    name: string;
    description: string;
}

const MagicItemPage = () => {
    const [magicItemData, setMagicItemData] = useState<MagicItemData[]>();
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [prompt, setPrompt] = useState<string>("");

    const handleMagicItemGenerate = async () => {
        setIsGenerating(true);

        // Request Magic Items
        const response = await fetch(
            "https://api.dng.quest/generate-magic-item",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    count: 4,
                    ...(prompt ? { userPrompt: prompt } : {}),
                }),
            }
        );

        // Parse magic item data
        const responseData = await response.json();
        const itemStrings = responseData.data.items;
        console.log(itemStrings);
        const dataArray: MagicItemData[] = itemStrings.map(
            (itemString: string) => {
                const parsed = itemString.match(
                    /Name:\s*([\s\S]*?)\s*(\w+:[\s\S]*)/
                );
                if (!parsed) return {};

                // Bold Labels, convert newlines to <p>line</p>
                parsed[2] = parsed[2]
                    .replace(/(\w+):/g, "<strong>$1:</strong>")
                    .split("\n")
                    .map((line) => `<p>${line}</p>`)
                    .join("");

                console.log(parsed[2]);

                const name = parsed[1];
                const desc = parsed[2];

                return {
                    name: name,
                    description: desc,
                };
            }
        );

        console.log(dataArray);
        setMagicItemData(dataArray);
        setIsGenerating(false);
    };

    return (
        <>
            <Stack align='center' mb='xl'>
                <Title mx='auto'>Magic Item Generator</Title>
                <Textarea
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                    autosize
                    w='90%'
                    placeholder='(prompt)'
                />
                <Button
                    onClick={handleMagicItemGenerate}
                    leftSection={<RiAiGenerate />}
                >
                    Generate
                </Button>
                <Divider w='100%' />
            </Stack>
            {isGenerating ? (
                <Center>
                    <Loader />
                </Center>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                >
                    {magicItemData?.map((magicItem, index) => {
                        return (
                            <ContentCard
                                key={index}
                                title={magicItem.name}
                                content={magicItem.description}
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default MagicItemPage;
