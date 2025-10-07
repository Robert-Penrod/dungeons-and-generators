import {
    Center,
    Container,
    Stack,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import IconStoryLoader from "../components/loaders/IconStoryLoader";

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

                    <IconStoryLoader />
                    <Text size='lg' ta='center' c={theme.colors.gray[7]}>
                        DnG helps game masters generate content tailored for
                        their adventures.
                        {"\n\n"}
                        Whether you’re building a new campaign or fleshing out
                        tonight’s session, get inspired and keep the story
                        moving!
                    </Text>
                </Stack>
            </Center>
        </Container>
    );
};

export default HomePage;
