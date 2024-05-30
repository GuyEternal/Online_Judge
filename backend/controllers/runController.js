import express from "express";
import { generateFile } from "../utils/generateFile.js";

// Controller responsible for the RUN button for a single custom input (Not all test cases)
// For the /submit route, refer to the createSubmission route in the ../routes/submissionRoutes.js
export const runController = async (req, res) => {
    // Get the langauge and code from the request body along with the custom Input
    const lang = req.body.language;
    const code = req.body.code;
    const input = req.body.customInput;

    // Generate a file for the code with the necessary extension
    const filePath = generateFile(code, lang);

    // Run the code for the custom input only
    switch (lang) {
        case "python":
            // Execute the python code with the custom input
            break;
        case "java":
            // Execute the c code with the custom input
            break;
        case "cpp":
            // Execute the cpp code with the custom input
            break;
        default:
            // Handle the error for the language not supported
            break;
    }
    // Update res with the output and show in frontend, handle errors not for the webapp but for the executing of the code given in request i.e. stderr
    res.status(200).json({ success: true, req: req.body, filePath: filePath });

}
export default runController;
