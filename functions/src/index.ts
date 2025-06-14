// See a full list of supported triggers at https://firebase.google.com/docs/functions
// https://firebase.google.com/docs/functions/typescript

import cors from "cors";
import express from "express";
import * as logger from "firebase-functions/logger";
import * as functions from "firebase-functions/v2/https";
import { chatCompletion } from "./openai";

const app = express();

app.use(express.json());

// allow all origins for dev, restrict later
app.use(cors({ origin: true }));

// Log requests
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Routes

app.get("/hello-world", (req, res) => {
    res.send("Hello from Firebase + Express!");
});

app.get("/generate-magic-item", async (req, res) => {
    console.log("boop?");
    try {
        const magicItemResponse = await chatCompletion(
            `Generate a D&D 5e magic item. Output only in this format:
Name: [Item Name]
Description: [Item effects and properties in 1-3 sentences.]`
        );
        res.send(magicItemResponse);
    } catch (err) {
        console.error("Error generating magic item:", err);
        res.status(500).send("Internal Server Error");
    }
});

export const api = functions.onRequest(app);
