import { Flex, Stack } from "@mantine/core";
import GenerativeIconLoader from "./GenerativeIconLoader";

const IconStoryLoader = () => {
    return (
        <Stack align='center' gap='xl' w='100%'>
            <Flex w='90%' maw='300px' justify='space-between'>
                <GenerativeIconLoader />
                <GenerativeIconLoader />
                <GenerativeIconLoader />
            </Flex>
        </Stack>
    );
};

export default IconStoryLoader;
