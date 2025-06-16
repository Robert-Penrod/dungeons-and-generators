import {
    Button,
    Card,
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

const MagicItemPage = () => {
    const [magicItemData, setMagicItemData] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleMagicItemGenerate = async () => {
        setIsGenerating(true);
        const response = await fetch(
            "https://api.dng.quest/generate-magic-item",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    count: 4,
                }),
            }
        );
        const responseData = await response.json();
        console.log(responseData.data.items);
        setMagicItemData(responseData.data.items);
        setIsGenerating(false);
    };

    return (
        <>
            <Stack align='center' mb='xl'>
                <Title mx='auto'>Magic Item Generator</Title>
                <Textarea autosize w='90%' placeholder='(prompt)' />
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
                <SimpleGrid cols={{ base: 2, sm: 1, md: 2, lg: 3, xl: 3 }}>
                    {magicItemData.map((magicItem, index) => {
                        return <Card key={index}>{magicItem}</Card>;
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default MagicItemPage;
