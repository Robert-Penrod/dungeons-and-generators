// src/features/auth/authActions.ts
import { auth } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInAnonymously,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    type UserCredential,
} from "firebase/auth";

export async function signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

export async function signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function signInAnonymous() {
    return signInAnonymously(auth);
}

export function logout() {
    return signOut(auth);
}
