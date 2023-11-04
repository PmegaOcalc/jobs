const n = [
    "us based",
    "remote us",
    "us-only",
    "us only",
    "north america only",
    "remote us",
    "remote canada",
    "us-based remote",
    "us time zones only",
    "us remote",
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
    "f#",
    "u.s. time zones required",
    "clojurescript",
];
const scoreWords = [
    { word: "profitable", score: 50 },
    { word: "bootstrapped", score: 50 },
    { word: "revenue", score: 50 },
    {
        word: "€",
        score: 100,
    },
    {
        word: "$",
        score: 100,
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
        word: "typescript",
        score: 50,
    },
    {
        word: "postgres",
        score: 30,
    },
    {
        word: "graphql",
        score: 10,
    },
    {
        word: "remote only",
        score: 50,
    },
    {
        word: "remote ok",
        score: -10,
    },
    {
        word: "salary",
        score: 10,
    },
    {
        word: "webassembly",
        score: 10,
    },
    {
        word: "tailwind",
        score: -10,
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
        word: "remote company",
        score: 10,
    },
    {
        word: "remote",
        score: 10,
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
        word: "mongo",
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
        score: -50,
    },
    {
        word: "java",
        score: -50,
    },
    {
        word: "kotlin",
        score: -25,
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
];

export const parseJobBuilder =
    ({ survivors, textLengths }) =>
    (job) => {
        let text = "";
        text = job.textContent;

        let lowerText = text
            .toLowerCase()
            // replace multiple spaces with a single space globally
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
        for (let i = 0; i < n.length; i++) {
            if (lowerText.includes(badWords[i])) {
                ok = false;
                return;
            }
        }

        let jobScore = 0;
        for (let i = 0; i < scoreWords.length; i++) {
            if (lowerText.includes(scoreWords[i].word)) {
                jobScore += scoreWords[i].score;
            }
        }

        if (ok) {
            survivors.push({
                textLength,
                job: lowerText,
                score: jobScore,
            });
        }
    };
