/** Title = Capitalise words, replacing "-" with " ". */
export const makeTitle = (key: string) =>
    key
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");

/** Endpoint = "generate-" + key, unless overridden. */
export const makeEndpoint = (key: string) => `generate/${key}`;
