import {
    Box,
    Divider,
    SimpleGrid,
    Title,
    useMantineTheme,
} from "@mantine/core";
import type { ReactNode } from "react";
import type { ContentData } from "../features/lib/parseContent";
import ContentCard from "./ContentCard";

interface Props {
    header?: ReactNode;
    data: ContentData[];
}

const CardGrid = ({ header, data }: Props) => {
    const theme = useMantineTheme();

    if (data.length === 0) {
        return <></>;
    }

    return (
        <>
            <Title
                style={{
                    display: "flex",
                    justifyContent: "left",
                }}
            >
                <Box
                    style={{
                        backgroundColor: theme.colors.blue[6],
                        borderRadius: "5px 5px 0px 0px",
                        color: "white",
                        verticalAlign: "middle",
                        justifyContent: "center",
                        textAlign: "center",
                        justifyItems: "center",
                        display: "inline-flex",
                        padding: "5px",
                    }}
                    mb='-2px'
                >
                    {header}
                </Box>
            </Title>
            <Divider
                mb='md'
                w='100%'
                size='lg'
                color={theme.colors.blue[6]}
                opacity={1}
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
