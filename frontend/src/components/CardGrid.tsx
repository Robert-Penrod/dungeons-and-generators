import { Divider, SimpleGrid, Title, useMantineTheme } from "@mantine/core";
import type { ReactNode } from "react";
import type { ContentData } from "../features/lib/parseContent";
import ContentCard from "./ContentCard";

interface Props {
    header?: ReactNode;
    data: ContentData[];
}

const CardGrid = ({ header, data }: Props) => {
    const theme = useMantineTheme();

    return (
        <>
            <Title>{header}</Title>
            <Divider
                mb='md'
                w='100%'
                size='md'
                color={theme.colors.blue[6]}
                opacity={0.5}
            />
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
        </>
    );
};

export default CardGrid;
