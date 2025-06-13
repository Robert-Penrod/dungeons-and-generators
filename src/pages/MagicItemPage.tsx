import {
    Button,
    Card,
    Divider,
    SimpleGrid,
    Stack,
    Textarea,
    Title,
} from "@mantine/core";
import { RiAiGenerate } from "react-icons/ri";

const MagicItemPage = () => {
    return (
        <>
            <Stack align='center' mb='xl'>
                <Title mx='auto'>Magic Item Generator</Title>
                <Textarea autosize w='90%' placeholder='(prompt)' />
                <Button leftSection={<RiAiGenerate />}>Generate</Button>
                <Divider w='100%' />
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3, xl: 3 }}>
                <Card>Card</Card>
                <Card>Card</Card>
                <Card>Card</Card>
                <Card>Card</Card>
            </SimpleGrid>
        </>
    );
};

export default MagicItemPage;
