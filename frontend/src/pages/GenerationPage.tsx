import {
    ActionIcon,
    Alert,
    Button,
    Divider,
    Group,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { FaCoins, FaStop } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import ContentCard from "../components/ContentCard";
import GenerativeLoader from "../components/loaders/GenerativeLoader";
import { useGenerateContent } from "../features/generation/hooks/useGenerateContent";

interface GenerationPageProps {
    generatorType: string;
    onGenerate?: () => void;
}

const GenerationPage = (props: GenerationPageProps) => {
    const [prompt, setPrompt] = useState<string>("");
    const { data, isLoading, error, title, generate, cancel, canCancel } =
        useGenerateContent(props.generatorType);

    useEffect(() => {
        setPrompt("");
    }, [props.generatorType]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const tempSlider = (
    //     <Flex align='center' gap='sm' w='25%' style={{ minWidth: "250px" }}>
    //         <FaThermometerHalf color='orange' size={37} />

    //         {/* Make slider take the remaining space */}
    //         <Box style={{ flex: 1 }}>
    //             <Slider
    //                 color='#FFA500'
    //                 min={0}
    //                 max={2}
    //                 step={0.01}
    //                 value={temp}
    //                 onChange={setTemp}
    //                 label={(v) => v.toFixed(2)}
    //             />
    //         </Box>

    //         {/* Fixed-size slot for reset control */}
    //         <ActionIcon
    //             size='lg'
    //             variant='light'
    //             onClick={() => setTemp(1)}
    //             // keep the element mounted; just hide visually when not needed
    //             style={{
    //                 visibility: temp !== 1 ? "visible" : "hidden",
    //                 pointerEvents: temp !== 1 ? "auto" : "none",
    //             }}
    //             aria-label='Reset temperature'
    //         >
    //             <FaRotateLeft />
    //         </ActionIcon>
    //     </Flex>
    // );

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
                <Group>
                    <Button
                        onClick={() => {
                            generate(8, prompt);
                            if (props.onGenerate) props.onGenerate();
                        }}
                        leftSection={
                            <Group gap={7}>
                                <Text
                                    c={isLoading ? undefined : "gold"}
                                    size='lg'
                                    fw='bold'
                                >
                                    -
                                </Text>
                                <FaCoins
                                    color={isLoading ? undefined : "gold"}
                                    size={24}
                                />
                            </Group>
                        }
                        disabled={isLoading}
                    >
                        Generate
                    </Button>
                    {isLoading && (
                        <ActionIcon
                            variant='filled'
                            color='red'
                            size='lg'
                            onClick={cancel}
                            disabled={!canCancel}
                            aria-label='Stop'
                            title='Stop'
                        >
                            <FaStop size={16} />
                        </ActionIcon>
                    )}
                </Group>
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
                <GenerativeLoader />
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
                                iconString={item.iconString}
                            />
                        );
                    })}
                </SimpleGrid>
            )}
        </>
    );
};

export default GenerationPage;
