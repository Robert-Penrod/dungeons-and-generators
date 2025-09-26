import {
    Alert,
    Button,
    Center,
    Divider,
    Loader,
    SimpleGrid,
    Stack,
    Textarea,
    Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        setPrompt("");
    }, [props.generatorType]);

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
                    onClick={() => generate(6, prompt)}
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
                    <Loader />
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
