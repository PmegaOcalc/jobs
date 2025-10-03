const badWords = [
    "us based",
    "onsite sf",
    "remote us",
    "us-only",
    "us only",
    "north america only",
    "remote us",
    "austin, tx",
    "remote canada",
    "remote india",
    "us-based remote",
    "us time zones only",
    "us remote",
    "us resident",
    "must be a us",
    "us timezone",
    "remote us-based",
    "remote in canada",
    "us only",
    "canada only",
    "us-remote",
    "usa pacific time",
    "remote in usa",
    "remote uk",
    ".net",
    "c#",
    "remote from the united states",
    "f#",
    "remote u.s.",
    "u.s. time zones required",
    "clojurescript",
    "est timezone",
    "bay area",
    "sf bay",
    "usa | remote",
];
const scoreWords = [
    { word: "profitable", score: 50 },
    { word: "bootstrapped", score: 50 },
    { word: "revenue", score: 50 },
    { word: 'revenue', score: 20 },
    {
        word: 'remote-first',
        score: 10,
    },
    {
        word: 'us/india',
        score: -100,
    },
    {
        word: 'london, uk',
        score: -70,
    },
    {
        word: 'fully-remote',
        score: 50,
    },
    {
        word: 'zurich',
        score: 70,
    },
    {
        word: 'switzerland',
        score: 70,
    },
    {
        word: 'next',
        score: 10,
    },
    {
        word: 'creative',
        score: 10,
    },
    {
        word: 'open-minded',
        score: 10,
    },
    {
        word: 'test',
        score: 10,
    },
    {
        word: 'trunk',
        score: 10,
    },
    {
        word: 'c#',
        score: -10,
    },
    {
        word: "€",
        score: 50,
    },
    {
        word: "$",
        score: 25,
    },
    {
        word: "central european",
        score: 5,
    },
    {
        word: "europe",
        score: 5,
    },
    {
        word: "cet",
        score: 5,
    },
    {
        word: "kafka",
        score: 10,
    },
    {
        word: "k8s",
        score: 10,
    },
    {
        word: "react",
        score: 20,
    },
    {
        word: "node.js",
        score: 10,
    },
    {
        word: "next.js",
        score: 40,
    },
    {
        word: 'onsite',
        score: -10,
    },
    {
        word: 'utc',
        score: 5,
    },
    {
        word: "typescript",
        score: 100,
    },
    {
        word: "postgres",
        score: 30,
    },
    {
        word: 'php',
        score: -100,
    },
    {
        word: "graphql",
        score: 20,
    },
    {
        word: "remote only",
        score: 50,
    },
    {
        word: "remote ok",
        score: 10,
    },
    {
        word: "salary",
        score: 20,
    },
    {
        word: "webassembly",
        score: 10,
    },
    {
        word: "golang",
        score: -20,
    },
    {
        word: "react native",
        score: -20,
    },
    {
        word: 'fully remote',
        score: 50,
    },
    {
        word: "several roles",
        score: 50,
    },
    {
        word: 'multiple roles',
        score: 50,
    },
    {
        word: 'multiple locations',
        score: 50,
    },
    {
        word: "remote company",
        score: 10,
    },
    {
        word: "remote",
        score: 30,
    },
    {
        word: 'hybrid',
        score: -20,
    },
    {
        word: 'on-site',
        score: -30,
    },
    {
        word: 'onsite',
        score: -30,
    },
    {
        word: "remote eu",
        score: 15,
    },
    {
        word: "remote anywhere",
        score: 15,
    },
    {
        word: "remote (worldwide",
        score: 5,
    },
    {
        word: "fully remote",
        score: 10,
    },
    {
        word: "series a",
        score: 5,
    },
    {
        word: "mysql",
        score: -10,
    },
    {
        word: "redux",
        score: -10,
    },
    {
        word: "blockchain",
        score: -150,
    },
    {
        word: "smart contracts",
        score: -100,
    },
    {
        word: "ror",
        score: -50,
    },
    {
        word: "rails",
        score: -50,
    },
    {
        word: "frontend engineer",
        score: 10,
    },
    {
        word: "full-stack engineer",
        score: 10,
    },
    {
        word: "backend engineer",
        score: 10,
    },
    {
        word: "ruby",
        score: -50,
    },
    {
        word: "python",
        score: -10,
    },
    {
        word: "java",
        score: -70,
    },
    {
        word: "kotlin",
        score: -15,
    },
    {
        word: "crypto",
        score: -100,
    },
    {
        word: "nft",
        score: -100,
    },
    {
        word: "defi",
        score: -100,
    },
    {
        word: "web3",
        score: -100,
    },
    {
        word: 'pst',
        score: -100,
    },
    {
        word: 'est',
        score: -100,
    },
    {
        word: "remote us only",
        score: -100,
    },
    {
        word: "postgresql",
        score: 20,
    },
    {
        word: "mongo",
        score: -10,
    },
    {
        word: "remote eu",
        score: 100,
    },
    {
        word: 'tanstack',
        score: 10,
    },
    {
        word: "in-person",
        score: -10,
    },
    {
        word: 'remote global',
        score: 50,
    },
    {
        word: "remote within eu",
        score: 100,
    },
    {
        word: 'remote europe',
        score: 100,
    },

    {
        word: "remote within uk",
        score: -100,
    },
    {
        word: "remote within us",
        score: -100,
    },
    {
        word: "remote within canada",
        score: -100,
    },

];

const Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    // Add other constants as needed
};

function extractText(node) {
    let text = "";
    if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue + " ";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        for (let i = 0; i < node.childNodes.length; i++) {
            text += extractText(node.childNodes[i]);
        }
    }
    return text;
}

export const parseJobBuilder =
    ({ survivors, textLengths }) =>
        (job) => {
            let text = "";
            text = extractText(job);

            let lowerText = text
                .toLowerCase()
                .replace(/\s\s+/g, " ")
                .replace(/\(/g, "")
                .replace(/\)/g, "");

            const textLength = text.length;
            textLengths.push(textLength * 1);
            // console.log(textLength);

            // update text to be single line
            lowerText = lowerText
                .replace(/\n/g, " ")
                .replace(/\r/g, " ")
                .replace(/\t/g, " ")
                .trim();

            // filter out [dead] or [flagged] jobs
            if (lowerText.includes("[dead]") || lowerText.includes("[flagged]")) {
                return;
            }

            // filter out empty strings
            if (lowerText.length < 1) {
                return;
            }

            let ok = true;
            for (let i = 0; i < badWords.length; i++) {
                if (lowerText.includes(badWords[i])) {
                    ok = false;
                    return;
                }
            }

            let jobScore = 0;
            let matchedScores = [];
            for (let i = 0; i < scoreWords.length; i++) {
                if (lowerText.includes(scoreWords[i].word)) {
                    jobScore += scoreWords[i].score;
                    matchedScores.push({ [scoreWords[i].word]: scoreWords[i].score });
                }
            }

            if (ok) {
                survivors.push({
                    textLength,
                    job: lowerText,
                    score: jobScore,
                    matchedScores,
                });
            }
        };
