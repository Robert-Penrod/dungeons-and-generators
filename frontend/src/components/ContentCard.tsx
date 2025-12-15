import { useSimpleTimer } from "@/hooks/useSimpleTimer";
import {
    ActionIcon,
    Box,
    Card,
    Divider,
    Group,
    Text,
    useMantineTheme,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { FaBookmark, FaClipboardCheck, FaCopy } from "react-icons/fa6";
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

    const accent1Color = `#E69A28`;
    const accent2Color = `#9D3A24`;
    const titleColor = accent2Color;
    const bottomColor = accent1Color;
    const buttonColor = accent2Color;

    const [isCopied, resetCopyTimer] = useSimpleTimer(500);

    // Content update on prop change
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <Box>
            <Card
                pt='lg'
                p='xl'
                pb='lg'
                style={{
                    borderTop: `6px solid ${accent1Color}`,
                    height: "fit-content",
                    borderBottomLeftRadius: "6px",
                    borderBottomRightRadius: "6px",
                }}
                shadow='lg'
                radius='3'
                withBorder
            >
                {/* Content */}
                <Box>
                    <Card.Section mb='-5px'>
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
                                style={{ color: titleColor }}
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
                        color={accent2Color}
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
                </Box>
            </Card>
            <Card
                style={{
                    backgroundColor: bottomColor,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    // borderRadius: 0,
                    // outline: "2px solid black",
                }}
                radius={6}
                mt={-6}
                mx={1}
            >
                <Card.Section p={5} px='xs'>
                    <Group justify='space-between'>
                        <Group></Group>
                        <Group>
                            <ActionIcon
                                color={isCopied ? "green" : buttonColor}
                                onClick={() => {
                                    if (!editor) return;

                                    const plainText = `${title}\n${editor.getText(
                                        {
                                            blockSeparator: "\n",
                                        }
                                    )}`;

                                    const htmlText = `<strong>${title}</strong>\n\n${editor.getHTML()}`;

                                    const clipBoardItem = new ClipboardItem({
                                        "text/html": new Blob([htmlText], {
                                            type: "text/html",
                                        }),
                                        "text/plain": new Blob([plainText], {
                                            type: "text/plain",
                                        }),
                                    });

                                    navigator.clipboard.write([clipBoardItem]);
                                    resetCopyTimer();
                                }}
                            >
                                {isCopied ? <FaClipboardCheck /> : <FaCopy />}
                            </ActionIcon>
                            <ActionIcon color={buttonColor}>
                                <FaBookmark />
                            </ActionIcon>
                        </Group>
                    </Group>
                </Card.Section>
            </Card>
        </Box>
    );
};

export default ContentCard;
