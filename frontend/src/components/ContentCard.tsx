import { Card, Divider, Text } from "@mantine/core";

interface ContentCardProps {
    title: string;
    content: string;
}
const ContentCard = (props: ContentCardProps) => {
    const { title, content } = props;

    return (
        <Card p='xl'>
            <Card.Section>
                <Text
                    contentEditable
                    suppressContentEditableWarning
                    size='lg'
                    fw={1000}
                >
                    {title}
                </Text>
            </Card.Section>
            <Divider mb={5} mt={3} mx={-20} size='xl' />
            <Card.Section>
                <Text contentEditable suppressContentEditableWarning>
                    {content}
                </Text>
            </Card.Section>
        </Card>
    );
};

export default ContentCard;
