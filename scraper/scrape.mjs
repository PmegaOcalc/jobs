import jsdom from "jsdom";
const { JSDOM } = jsdom;
import { parseJobBuilder } from "./parseJobBuilder.mjs";
import fs from "fs";

const name = "october-2025";

const url = `https://hnhiring.com/${name}`;

const rank = (htmlString) => {
    const survivors = [];
    let textLengths = []; // stores text lengths of all job postings

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

    const min = textLengths[textLengths.length - 1]; // shortest job posting text length
    const max = textLengths[0]; // longest job posting text length

    survivors.forEach((survivor) => {
        const normalized = (survivor.textLength - min) / (max - min); // normalize text length to 0-1 range
        survivor.normalized = normalized.toFixed(3); // store as 3 decimal places
        const bonus = 300 - normalized * normalized * normalized * 100; // cubic bonus: shorter posts get exponentially more bonus
        survivor.bonus = bonus;

        survivor.score = survivor.score + bonus; // add bonus points to base score
    });

    const sorted = survivors.sort((a, b) => {
        return b.score - a.score; // sort jobs by total score (highest first)
    });

    fs.writeFileSync(`./${name}.txt`, ``);

    sorted.forEach((survivor, index) => {
        console.log(index, survivor.job);
        console.log(
            `Score: ${Math.round(survivor.score)}, Normalized: ${survivor.normalized * 1}, Bonus: ${Math.round(survivor.bonus)}`
        );
        console.log(`Matched scores:`, JSON.stringify(survivor.matchedScores));
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
