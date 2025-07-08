import { Card, Divider, Text, useMantineTheme } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface ContentCardProps {
    title: string;
    content: string;
}
const ContentCard = (props: ContentCardProps) => {
    const { title, content } = props;
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
        <Card p='xl'>
            <Card.Section>
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
            </Card.Section>
            <Divider mb={5} mt={3} mx={-20} size='md' />
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
                            tippyOptions={{ animation: "fade", duration: 250 }}
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
