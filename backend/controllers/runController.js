import express from "express";
import path from "path";
import { generateFile } from "../utils/generateFile.js";
import { execCPP } from "../utils/execCPP.js";
import { fileURLToPath } from 'url'
import { execJAVA } from "../utils/execJAVA.js";
import { execPY } from "../utils/execPY.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Controller responsible for the RUN button for a single custom input (Not all test cases)
// For the /submit route, refer to the createSubmission route in the ../routes/submissionRoutes.js
export const runController = async (req, res) => {
    console.log(req.body);
    const code = req.body.code;
    const lang = req.body.language;
    const customInput = req.body.customInput;
    console.log(code, lang);
    const { filePath, dirOutput, randomString } = generateFile(code, lang);
    let op;
    if (lang === "cpp") {
        op = await execCPP(dirOutput, filePath, customInput, randomString);
    }
    else if (lang === "py") {
        op = await execPY(dirOutput, filePath, customInput, randomString);
    }
    else if (lang === "java") {
        op = await execJAVA(dirOutput, filePath, customInput, randomString);
    }
    else {
        op = {
            error: "Invalid language",
            output: "",
            time: 0,
            memory: 0
        }
    }
    if (typeof op.output === 'object' && op.output !== null) {
        op.output = JSON.stringify(op.output);
    }
    res.json({
        op,
        code: code,
        lang: lang
    });
}
export default runController;
