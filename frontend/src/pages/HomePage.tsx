import {
    Center,
    Container,
    Flex,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import GenerativeIconLoader from "../components/GenerativeIconLoader";

const HomePage = () => {
    const theme = useMantineTheme();

    return (
        <Container size='sm'>
            <Center>
                <Stack align='center' gap='xl'>
                    <Title visibleFrom='sm' ta='center'>
                        Dungeons & Generators
                    </Title>
                    <Title hiddenFrom='sm' ta='center'>
                        DnG
                    </Title>

                    <Text size='lg' fw={500}>
                        📖 Less prep, more play ⚔️
                    </Text>

                    <Flex w='90%' maw='300px' justify='space-between'>
                        <GenerativeIconLoader />
                        <GenerativeIconLoader />
                        <GenerativeIconLoader />
                    </Flex>
                    <Text size='md' ta='center' c={theme.colors.gray[7]}>
                        DnG helps game masters generate content tailored for
                        their adventures. Whether you’re building a new campaign
                        or fleshing out tonight’s session, get inspired and keep
                        the story moving.
                    </Text>
                </Stack>
            </Center>
        </Container>
    );
};

export default HomePage;
