import { createTheme, type MantineTheme } from "@mantine/core";

export const theme = createTheme({
    primaryColor: "blue",
    colors: {
        blue: [
            "#eef3ff",
            "#dee2f2",
            "#bdc2de",
            "#98a0ca",
            "#7a84ba",
            "#6672b0",
            "#113946", // Button
            "#4c5897",
            "#424e88",
            "#364379",
        ],
    },

    components: {
        Title: {
            styles: (theme: MantineTheme) => ({
                root: {
                    color: theme.colors.blue[6],
                },
            }),
        },
    },
});
