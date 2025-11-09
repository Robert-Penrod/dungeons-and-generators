import { initializeApp } from "firebase/app";
import {
    browserLocalPersistence,
    getAuth,
    setPersistence,
} from "firebase/auth";

// Setup
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Keep users signed in across refreshes/tabs
setPersistence(auth, browserLocalPersistence);
