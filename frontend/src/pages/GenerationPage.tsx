import {
    ActionIcon,
    Alert,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    Loader,
    SimpleGrid,
    Slider,
    Stack,
    Textarea,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaThermometerHalf } from "react-icons/fa";
import { FaRotateLeft } from "react-icons/fa6";
import { RiAiGenerate, RiErrorWarningLine } from "react-icons/ri";
import ContentCard from "../components/ContentCard";
import { useGenerateContent } from "../features/generation/hooks/useGenerateContent";

interface GenerationPageProps {
    generatorType: string;
}

const GenerationPage = (props: GenerationPageProps) => {
    const [prompt, setPrompt] = useState<string>("");
    const { data, isLoading, error, title, generate } = useGenerateContent(
        props.generatorType
    );
    const [temp, setTemp] = useState<number>(1);

    useEffect(() => {
        setPrompt("");
    }, [props.generatorType]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const tempSlider = (
        <Flex align='center' gap='sm' w='25%' style={{ minWidth: "250px" }}>
            <FaThermometerHalf color='orange' size={37} />

            {/* Make slider take the remaining space */}
            <Box style={{ flex: 1 }}>
                <Slider
                    color='#FFA500'
                    min={0}
                    max={2}
                    step={0.01}
                    value={temp}
                    onChange={setTemp}
                    label={(v) => v.toFixed(2)}
                />
            </Box>

            {/* Fixed-size slot for reset control */}
            <ActionIcon
                size='lg'
                variant='light'
                onClick={() => setTemp(1)}
                // keep the element mounted; just hide visually when not needed
                style={{
                    visibility: temp !== 1 ? "visible" : "hidden",
                    pointerEvents: temp !== 1 ? "auto" : "none",
                }}
                aria-label='Reset temperature'
            >
                <FaRotateLeft />
            </ActionIcon>
        </Flex>
    );

    return (
        <>
            <Stack align='center' mb='xl'>
                <Title mx='auto'>{title} Generator</Title>
                <Textarea
                    onChange={(e) => {
                        setPrompt(e.target.value);
                    }}
                    value={prompt}
                    autosize
                    w='90%'
                    placeholder='(prompt)'
                />
                <Button
                    onClick={() => generate(8, prompt, temp)}
                    leftSection={<RiAiGenerate />}
                    disabled={isLoading}
                >
                    Generate
                </Button>
                <Divider w='100%' />
                {error && (
                    <Alert
                        color='red'
                        icon={<RiErrorWarningLine size='1rem' />}
                        title='Uh-oh!'
                    >
                        {error.message}
                    </Alert>
                )}
            </Stack>
            {isLoading ? (
                <Center>
                    <Loader type='dots' />
                </Center>
            ) : (
                <SimpleGrid
                    cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}
                >
                    {data?.map((item, index) => {
                        return (
                            <ContentCard
                                key={index}
                                title={item.name}
                                content={item.description}
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default GenerationPage;
