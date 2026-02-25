import { MantineProvider } from "@mantine/core";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import { AuthProvider } from "./auth/AuthProvider.tsx";
import { GeneratorDataProvider } from "./context/GeneratorDataContext.tsx";
import { theme } from "./theme.ts";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MantineProvider theme={theme}>
                <AuthProvider>
                    <GeneratorDataProvider>
                        <App />
                    </GeneratorDataProvider>
                </AuthProvider>
            </MantineProvider>
        </BrowserRouter>
    </StrictMode>,
);
