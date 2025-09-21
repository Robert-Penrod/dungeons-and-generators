import {
    Center,
    Container,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";

const HomePage = () => {
    const theme = useMantineTheme();

    return (
        <Container size='sm'>
            <Center>
                <Stack align='center'>
                    <Title>Dungeons & Generators</Title>
                    <Text size='lg' fw={500}>
                        Less prep, more play.
                    </Text>
                    <Text size='md' ta='center' c={theme.colors.gray[7]}>
                        DnG helps dungeon masters generate content tailored for
                        your adventures. Whether you’re building a new campaign
                        or fleshing out tonight’s session, get inspired and keep
                        the story moving.
                    </Text>
                </Stack>
            </Center>
        </Container>
    );
};

export default HomePage;
