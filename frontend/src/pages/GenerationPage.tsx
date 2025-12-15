import {
    ActionIcon,
    Alert,
    Box,
    Button,
    Divider,
    Group,
    SimpleGrid,
    Stack,
    Textarea,
    Title,
    useMantineTheme,
} from "@mantine/core";
import { type ReactNode } from "react";
import { FaStop } from "react-icons/fa6";
import { RiErrorWarningLine } from "react-icons/ri";
import ContentCard from "../components/ContentCard";
import GenerativeLoader from "../components/loaders/GenerativeLoader";
import { useGenerateContent } from "../hooks/useGenerateContent";

interface GenerationPageProps {
    generatorType: string;
    icon?: ReactNode;
    label: string;
    onGenerate?: () => void;
}

const GenerationPage = (props: GenerationPageProps) => {
    const {
        data,
        prompt,
        setPrompt,
        isLoading,
        error,
        generate,
        cancel,
        canCancel,
    } = useGenerateContent(props.generatorType);
    const theme = useMantineTheme();

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
                <Group>
                    <Title mx='auto'>
                        <Box
                            style={{ verticalAlign: "-4px" }}
                            display='inline-block'
                        >
                            {props.icon}
                        </Box>{" "}
                        {props.label}
                    </Title>
                </Group>
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
                            generate(6, prompt);
                            if (props.onGenerate) props.onGenerate();
                        }}
                        // leftSection={
                        //     <Group gap={7}>
                        //         <Text
                        //             c={isLoading ? undefined : "gold"}
                        //             size='lg'
                        //             fw='bold'
                        //         >
                        //             -
                        //         </Text>
                        //         <FaCoins
                        //             color={isLoading ? undefined : "gold"}
                        //             size={24}
                        //         />
                        //     </Group>
                        // }
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
                <Divider
                    w='100%'
                    size='md'
                    color={theme.colors.blue[2]}
                    opacity={0.5}
                />
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
                    spacing='md'
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
