import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { parseJobBuilder } from "./parseJobBuilder.mjs";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, "output");

const DEFAULT_MONTH = "february-2026";
const FETCH_TIMEOUT_MS = 15000;
const FETCH_ATTEMPTS = 3;

const parseArgs = (argv) => {
    const options = {
        month: DEFAULT_MONTH,
        refresh: false,
        help: false,
    };

    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === "--month" || arg === "-m") {
            const value = argv[i + 1];
            if (!value) {
                throw new Error("Missing value for --month");
            }
            options.month = value;
            i += 1;
            continue;
        }

        if (arg === "--refresh" || arg === "-r") {
            options.refresh = true;
            continue;
        }

        if (arg === "--help" || arg === "-h") {
            options.help = true;
            continue;
        }

        throw new Error(`Unknown argument: ${arg}`);
    }

    return options;
};

const fetchHtml = async (url) => {
    let lastError;

    for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
        try {
            const response = await fetch(url, {
                signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            lastError = error;
            if (attempt < FETCH_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, attempt * 500));
            }
        }
    }

    throw new Error(`Failed to fetch ${url}: ${lastError?.message ?? "Unknown error"}`);
};

const rank = async ({ htmlString, name }) => {
    const survivors = [];
    const textLengths = [];

    const dom = new JSDOM(htmlString);
    const doc = dom.window.document;

    doc.querySelectorAll(`.job .body`).forEach(
        parseJobBuilder({
            survivors,
            textLengths,
        })
    );

    const survivorLengths = survivors.map((survivor) => survivor.textLength);
    const min = survivorLengths.length > 0 ? Math.min(...survivorLengths) : 0;
    const max = survivorLengths.length > 0 ? Math.max(...survivorLengths) : 0;
    const range = max - min;

    survivors.forEach((survivor) => {
        const normalized = range === 0 ? 0 : (survivor.textLength - min) / range;
        survivor.normalized = Number(normalized.toFixed(3));
        const bonus = 300 - normalized * normalized * normalized * 100; // cubic bonus: shorter posts get exponentially more bonus
        survivor.bonus = bonus;

        survivor.score = survivor.score + bonus; // add bonus points to base score
    });

    const sorted = survivors.sort((a, b) => {
        return b.score - a.score; // sort jobs by total score (highest first)
    });

    const txtPath = path.join(OUTPUT_DIR, `${name}.txt`);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    const outputLines = [];

    sorted.forEach((survivor, index) => {
        console.log(index, survivor.job);
        console.log(
            `Score: ${Math.round(survivor.score)}, Normalized: ${survivor.normalized}, Bonus: ${Math.round(survivor.bonus)}`
        );
        console.log(`Matched scores:`, JSON.stringify(survivor.matchedScores));
        console.log('\n');
        outputLines.push(`${survivor.job}\n`);
    });

    await fs.writeFile(txtPath, outputLines.join(""), "utf8");
};

const scrape = async ({ name, refresh }) => {
    const url = `https://hnhiring.com/${name}`;
    const htmlPath = path.join(OUTPUT_DIR, `${name}.html`);
    if (!refresh) {
        const htmlExists = await fs
            .access(htmlPath)
            .then(() => true)
            .catch(() => false);

        if (htmlExists) {
            const html = await fs.readFile(htmlPath, "utf8");
            await rank({ htmlString: html, name });
            return;
        }
    }

    const html = await fetchHtml(url);
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(htmlPath, html, "utf8");
    await rank({ htmlString: html, name });
};

const main = async () => {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        console.log("Usage: node scrape.mjs [--month <month-year>] [--refresh]");
        return;
    }

    await scrape({
        name: options.month,
        refresh: options.refresh,
    });
};

main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
});
