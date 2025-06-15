import { chatCompletion } from "./openai";

(async () => {
    const result = await chatCompletion("Generate a magic item");
    console.log(result);
})();
