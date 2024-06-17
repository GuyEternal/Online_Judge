import express from "express";
import path from "path";
import { generateFile } from "../utils/generateFile.js";
import { execCPP } from "../utils/execCPP.js";
import { fileURLToPath } from 'url'
import { execJAVA } from "../utils/execJAVA.js";
import { execPY } from "../utils/execPY.js";
import { unlink } from "fs";

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
        try {
            op = await execCPP(dirOutput, filePath, customInput, randomString);
        } catch (error) {
            op.error = error.message;
        } finally {
            // Delete code and .exe file only here. Input file will be deleted in execCPP funtion only
            // my code file is stored in filePath whcih already has .cpp in it
            // my output file is stored in dirOutput/randomString + ".cpp"
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .cpp file")
                    console.log(err);
                } else {
                    console.log("deleted .cpp file succesfully")
                }
            });
            unlink(dirOutput + '/' + randomString + '.exe', (err) => {
                if (err) {
                    console.log("error in deleting .exe file")
                    console.log(err);
                } else {
                    console.log("deleted .exe file succesfully")
                }
            });
        }
    }
    else if (lang === "py") {
        try {
            op = await execPY(dirOutput, filePath, customInput, randomString);
        } catch (error) {
            op.error = error.message;
        } finally {
            // Delete code and .exe file only here. Input file will be deleted in execCPP funtion only
            // my code file is stored in filePath whcih already has .cpp in it
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .py file")
                    console.log(err);
                } else {
                    console.log("deleted .py file succesfully")
                }
            });
        }
    }
    else if (lang === "java") {
        try {
            op = await execJAVA(dirOutput, filePath, customInput, randomString);
        } catch (error) {
            op.error = error.message;
        } finally {
            // Delete code and .class file only here. Input file will be deleted in execCPP funtion only
            // my code file is stored in filePath whcih already has .java in it
            // my output file is stored in dirOutput/randomString + ".class"
            unlink(filePath, (err) => {
                if (err) {
                    console.log("error in deleting .java file")
                    console.log(err);
                } else {
                    console.log("deleted .java file succesfully")
                }
            });
            unlink(dirOutput + '/' + randomString + '.class', (err) => {
                if (err) {
                    console.log("error in deleting .class file")
                    console.log(err);
                } else {
                    console.log("deleted .class file succesfully")
                }
            });
        }
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
