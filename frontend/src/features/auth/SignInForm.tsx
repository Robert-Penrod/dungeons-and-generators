import {
    Alert,
    Button,
    Group,
    PasswordInput,
    Stack,
    TextInput,
} from "@mantine/core";
import { useState } from "react";
import { BiCheck } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { TbAlertTriangle } from "react-icons/tb";
import {
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail,
} from "./authActions";

export function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{
        kind: "success" | "error";
        text: string;
    } | null>(null);

    async function wrap(promise: Promise<unknown>, success: string) {
        setLoading(true);
        setMsg(null);
        try {
            await promise;
            setMsg({ kind: "success", text: success });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            setMsg({ kind: "error", text: message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Stack miw='300px'>
            {msg && (
                <Alert
                    variant='light'
                    color={msg.kind === "success" ? "teal" : "red"}
                    icon={
                        msg.kind === "success" ? (
                            <BiCheck />
                        ) : (
                            <TbAlertTriangle />
                        )
                    }
                    withCloseButton
                    onClose={() => setMsg(null)}
                >
                    {msg.text}
                </Alert>
            )}

            <TextInput
                label='Email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                required
            />
            <PasswordInput
                label='Password'
                placeholder='Your password'
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
            />

            <Group grow>
                <Button
                    loading={loading}
                    onClick={() =>
                        wrap(signInWithEmail(email, password), "Signed in!")
                    }
                >
                    Sign in
                </Button>
                <Button
                    variant='light'
                    loading={loading}
                    onClick={() =>
                        wrap(
                            signUpWithEmail(email, password),
                            "Account created!"
                        )
                    }
                >
                    Create account
                </Button>
            </Group>

            <Button
                variant='default'
                leftSection={<FcGoogle />}
                loading={loading}
                onClick={() =>
                    wrap(signInWithGoogle(), "Signed in with Google!")
                }
            >
                Continue with Google
            </Button>
        </Stack>
    );
}
