import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { parseJobBuilder } from "./parseJobBuilder.mjs";
import fs from "fs";

const name = "september-2025";

const url = `https://hnhiring.com/${name}`;

const rank = (htmlString) => {
    const survivors = [];
    let textLengths = [];

    const dom = new JSDOM(htmlString);
    const doc = dom.window.document;

    doc.querySelectorAll(`.job .body`).forEach(
        parseJobBuilder({
            survivors,
            textLengths,
        })
    );

    textLengths = textLengths.sort((a, b) => {
        return b - a;
    });

    const min = textLengths[textLengths.length - 1];
    const max = textLengths[0];

    survivors.forEach((survivor) => {
        const normalized = (survivor.textLength - min) / (max - min);
        survivor.normalized = normalized.toFixed(3);
        const bonus = 300 - normalized * normalized * normalized * 100;
        survivor.bonus = bonus;

        survivor.score = survivor.score + bonus;
    });

    const sorted = survivors.sort((a, b) => {
        return b.score - a.score;
    });

    fs.writeFileSync(`./${name}.txt`, ``);

    sorted.forEach((survivor, index) => {
        console.log(index, survivor.job);
        console.log(
            Math.round(survivor.score),
            survivor.normalized * 1,
            Math.round(survivor.bonus)
        );
        // save to file - just the ad
        fs.appendFileSync(`./${name}.txt`, `${survivor.job}\n`);
    });
};

const scrape = async () => {
    if (fs.existsSync(`./${name}.html`)) {
        const html = fs.readFileSync(`./${name}.html`, `utf8`);
        rank(html);
        return;
    }

    const html = await fetch(url).then((res) => res.text());
    fs.writeFileSync(`./${name}.html`, html);
    rank(html);
};

scrape();
