export type ContentData = {
    name: string;
    description: string;
    iconString: string; // e.g., "FaBeer" or "GiTorch"
};

export function parseContent(contentStrings: string[]): ContentData[] {
    const results: ContentData[] = [];

    for (const raw of contentStrings) {
        // Normalize line endings to \n
        const contentString = raw.replace(/\r\n?/g, "\n");

        // Capture blocks that start with "Name:" and run until the next "Name:" or end
        const blockRe =
            /(?:^|\n)\s*Name:\s*(.+?)(?:\n([\s\S]*?))?(?=(?:\n)\s*Name:|$)/g;

        let match: RegExpExecArray | null;
        let foundAny = false;

        while ((match = blockRe.exec(contentString)) !== null) {
            foundAny = true;

            const name = (match[1] ?? "").trim();
            let body = (match[2] ?? "").trim();

            // Body literally "null" → treat as empty
            if (/^null$/i.test(body)) body = "";

            // Remove lines that only contain ---
            body = body
                .split("\n")
                .filter((line) => line.trim() !== "---")
                .join("\n")
                .trim();

            // Extract "ReactIcon: <label>" line
            const reactIconRe = /(^|\n)\s*ReactIcon:\s*([^\n]+)\s*(?:\n|$)/i;
            let iconString = "";
            const iconMatch = reactIconRe.exec(body);
            if (iconMatch) {
                iconString = (iconMatch[2] ?? "").trim();
                body = body
                    .replace(reactIconRe, iconMatch[1] ? iconMatch[1] : "")
                    .trim();
            }

            // Bold labels
            if (body) {
                body = body.replace(
                    /(^|\n)([^:\n]+):/g,
                    "$1<strong>$2:</strong>"
                );
            }

            const description = body
                ? body
                      .split(/\n/)
                      .map((line) => `<p>${line}</p>`)
                      .join("")
                : "";

            results.push({ name, description, iconString });
        }

        // Fallback: no "Name:" block found
        if (!foundAny) {
            let body = contentString.trim();

            // Body literally "null" → treat as empty
            if (/^null$/i.test(body)) body = "";

            // Remove lines that only contain ---
            body = body
                .split("\n")
                .filter((line) => line.trim() !== "---")
                .join("\n")
                .trim();

            // Extract "ReactIcon: <label>" line
            const reactIconRe = /(^|\n)\s*ReactIcon:\s*([^\n]+)\s*(?:\n|$)/i;
            let iconString = "";
            const iconMatch = reactIconRe.exec(body);
            if (iconMatch) {
                iconString = (iconMatch[2] ?? "").trim();
                body = body
                    .replace(reactIconRe, iconMatch[1] ? iconMatch[1] : "")
                    .trim();
            }

            // Bold labels
            if (body) {
                body = body.replace(
                    /(^|\n)([A-Za-z][\w ]*?):/g,
                    "$1<strong>$2:</strong>"
                );
            }

            const description = body
                ? body
                      .split(/\n/)
                      .map((line) => `<p>${line}</p>`)
                      .join("")
                : "";

            results.push({
                name: "", // No name available
                description,
                iconString,
            });
        }
    }

    return results;
}
