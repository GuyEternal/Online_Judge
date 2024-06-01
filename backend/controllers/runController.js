import express from "express";
import path from "path";
import { generateFile } from "../utils/generateFile.js";
import { execCPP } from "../utils/execCPP.js";
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// Controller responsible for the RUN button for a single custom input (Not all test cases)
// For the /submit route, refer to the createSubmission route in the ../routes/submissionRoutes.js
export const runController = async (req, res) => {
    const code = req.body.code;
    const lang = req.body.language
    const customInput = req.body.customInput;
    console.log(code, lang);
    const { filePath, dirOutput, randomString } = generateFile(code, lang);
    const op = await execCPP(dirOutput, filePath, customInput, randomString);
    res.json({
        op,
        code: code,
        lang: lang
    });
}
export default runController;
