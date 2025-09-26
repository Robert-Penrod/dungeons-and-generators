export type ContentData = { name: string; description: string };

export function parseContent(contentStrings: string[]): ContentData[] {
    const results: ContentData[] = [];

    console.log(contentStrings);

    for (const raw of contentStrings) {
        // Normalize line endings to \n to simplify the regex.
        const contentString = raw.replace(/\r\n?/g, "\n");

        // Block regex:
        // - (?:^|\n)\s*Name:   → allow leading spaces & match at start or after a newline
        // - (.+?)              → name = rest of that line (non-greedy)
        // - (?:\n([\s\S]*?))?  → optional body = lines until next Name: (non-greedy)
        // - (?=(?:\n)\s*Name:|$) → stop before next Name: or end of string
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

            // Bold labels that start a line: "Label:" or "Long Label:"
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

            results.push({ name, description });
        }

        if (!foundAny) {
            throw Error(
                "Error parsing content (no 'Name:' blocks found)\n" + raw
            );
        }
    }

    return results;
}
