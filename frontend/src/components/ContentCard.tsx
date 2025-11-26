import { Card, Divider, Group, Text, useMantineTheme } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { DynamicIcon } from "./DynamicIcon";

interface ContentCardProps {
    title: string;
    content: string;
    iconString: string;
}
const ContentCard = (props: ContentCardProps) => {
    const { title, content, iconString } = props;
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: true,
    });
    const theme = useMantineTheme();

    // Content update on prop change
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <Card
            p='xl'
            style={{ paddingTop: "1.25em" }}
            shadow='lg'
            radius='md'
            withBorder
        >
            <Card.Section>
                <Group>
                    <DynamicIcon
                        name={iconString}
                        size={24}
                        color={theme.colors.blue[6]}
                    />
                    <Text
                        contentEditable
                        suppressContentEditableWarning
                        size='lg'
                        fw={1000}
                        spellCheck={false}
                        style={{ color: theme.colors.blue[6] }}
                    >
                        {title}
                    </Text>
                </Group>
            </Card.Section>
            <Divider
                mb={5}
                mt={3}
                mx={-20}
                size='md'
                color={theme.colors.blue[2]}
            />
            <Card.Section>
                <RichTextEditor
                    variant='subtle'
                    editor={editor}
                    style={{ border: "none" }}
                    spellCheck={false}
                >
                    {editor && (
                        <BubbleMenu
                            editor={editor}
                            tippyOptions={{
                                placement: "bottom",
                                animation: "fade",
                                duration: 250,
                            }}
                        >
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                            </RichTextEditor.ControlsGroup>
                        </BubbleMenu>
                    )}
                    <RichTextEditor.Content />
                </RichTextEditor>
            </Card.Section>
        </Card>
    );
};

export default ContentCard;
