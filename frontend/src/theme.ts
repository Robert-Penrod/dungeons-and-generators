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

    fontSizes: {
        xs: "0.875rem", // 12px
        sm: "1rem", // 14px
        md: "1.125rem", // 16px
        lg: "1.25rem", // 18px
        xl: "1.375rem", // 20px
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
