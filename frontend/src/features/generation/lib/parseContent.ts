export interface ContentData {
    name: string;
    description: string;
}

export function parseContent(contentStrings: string[]): ContentData[] {
    const dataArray: ContentData[] = contentStrings.map(
        (contentString: string) => {
            const parsed = contentString.match(
                /Name:\s*([\s\S]*?)\s*(\w+:[\s\S]*)/
            );
            if (!parsed) throw Error("Error parsing content");

            // Bold Labels, convert newlines to <p>line</p>
            parsed[2] = parsed[2]
                .replace(/(^|\n)(\w+):/g, "$1<strong>$2:</strong>")
                .split("\n")
                .map((line) => `<p>${line}</p>`)
                .join("");

            console.log(parsed[2]);

            const name = parsed[1];
            const desc = parsed[2];

            return {
                name: name,
                description: desc,
            };
        }
    );
    return dataArray;
}
