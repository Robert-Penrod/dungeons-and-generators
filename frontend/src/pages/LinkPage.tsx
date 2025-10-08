import { SimpleGrid } from "@mantine/core";
import Microlink from "@microlink/react";

const LinkPage = () => {
    return (
        <SimpleGrid cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 3, xl: 3 }}>
            <Microlink url='https://watabou.itch.io/' />
            <Microlink url='https://www.herebetaverns.com/' />
            <Microlink url='https://inkarnate.com/' />
        </SimpleGrid>
    );
};

export default LinkPage;
