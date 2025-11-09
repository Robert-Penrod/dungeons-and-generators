// src/features/auth/Protected.tsx
import { Center, Loader } from "@mantine/core";
import type { JSX } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

export function Protected({ children }: { children: JSX.Element }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Center h='60vh'>
                <Loader />
            </Center>
        );
    }

    return user ? children : <Navigate to='/signin' replace />;
}
