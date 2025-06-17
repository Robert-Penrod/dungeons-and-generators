import {
    Button,
    Card,
    Center,
    Divider,
    Loader,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { useState } from "react";
import { RiAiGenerate } from "react-icons/ri";

interface MagicItemData {
    name: string;
    description: string;
}

const MagicItemPage = () => {
    const [magicItemData, setMagicItemData] = useState<MagicItemData[]>();
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

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
                <SimpleGrid
                    cols={{ base: 2, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
                >
                    {magicItemData?.map((magicItem, index) => {
                        return (
                            <Card key={index} p='xl'>
                                <Card.Section>
                                    <Text contentEditable size='lg' fw={1000}>
                                        {magicItem.name}
                                    </Text>
                                </Card.Section>
                                <Divider mb={5} mt={3} mx={-20} size='xl' />
                                <Card.Section>
                                    <Text contentEditable>
                                        {magicItem.description}
                                    </Text>
                                </Card.Section>
                            </Card>
                        );
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default MagicItemPage;
