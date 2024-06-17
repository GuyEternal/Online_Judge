import { exec } from 'child_process';
import { writeFile, unlink } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runProcess = async (op, dirOutput, randomString, inputFilePath) => new Promise((resolve, reject) => {
    const start = new Date();
    try {
        const proc = exec(`cd ${dirOutput} && cd .. && cd codes && python ${randomString}.py < ${inputFilePath}`, (err, stdout, stderr) => {
            if (err) {
                console.log("Runtime Error : " + err);
                op.error.message = err;
                reject(err);
            }
            if (stderr) {
                console.log("Runtime Error : " + stderr);
                op.error.message = stderr;
                reject(stderr);
            }
            console.log("Output : " + stdout);
            op.output += stdout;
            const end = new Date();
            op.time = end - start; // convert to milliseconds
            op.memory = process.memoryUsage().heapUsed / 1024 / 1024; // convert to MB
            resolve(op);
        });
    } catch (error) {
        op.error.message = error.message;
    }
});


export const execPY = async (dirOutput, filePath, customInput, randomString) => {
    let op = {
        error: { message: '' },
        output: '',
        time: 0,
    }; // by default will contain: error (stderror or other), output, time, memory
    const inputFilePath = join(__dirname, '..', 'data', 'inputs', `${randomString}.txt`);
    writeFile(inputFilePath, customInput, (err) => {
        if (!err) {
            console.log('input file written succesfully');
        } else {
            console.log("Error in writing file in txt ");
            console.error(err);
        }
    });
    try {
        op = await Promise.race([
            runProcess(op, dirOutput, randomString, inputFilePath),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Runtime time limit exceeded')), 2000))
        ]);

    } catch (error) {
        console.log("Runtime Error : " + error);
        op.error.message = "Runtime Error : " + error;
        op.time = 2000;
        op.memory = error;
    } finally {
        fs.unlink(inputFilePath, (err) => {
            if (!err) {
                console.log("input file deleted succesfuuly");
            }
            else {
                console.log("error in deleting input file .txt");
                console.log(err);
            }
        });
    }

    return op;
}