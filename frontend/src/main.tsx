import { MantineProvider } from "@mantine/core";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { GeneratedCardProvider } from "./context/GeneratedCardContext.tsx";
import { AuthProvider } from "./features/auth/AuthContext.tsx";
import { theme } from "./theme.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MantineProvider theme={theme}>
                <AuthProvider>
                    <GeneratedCardProvider>
                        <App />
                    </GeneratedCardProvider>
                </AuthProvider>
            </MantineProvider>
        </BrowserRouter>
    </StrictMode>
);
