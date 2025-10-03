import rules from "./rules.mjs";



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
            for (let i = 0; i < rules.badWords.length; i++) {
                if (lowerText.includes(rules.badWords[i])) {
                    ok = false;
                    return;
                }
            }

            let jobScore = 0;
            let matchedScores = [];
            for (let i = 0; i < rules.scoreWords.length; i++) {
                if (lowerText.includes(rules.scoreWords[i].word)) {
                    jobScore += rules.scoreWords[i].score;
                    matchedScores.push({ [rules.scoreWords[i].word]: rules.scoreWords[i].score });
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
