import { exec } from 'child_process';
import { writeFile, unlink } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runProcess = async (op, dirOutput, randomString, inputFilePath, outputFilePath) => new Promise((resolve, reject) => {
    const start = new Date();
    try {
        const proc = exec(`cd ${dirOutput} && java ${randomString} < ${inputFilePath}`, (err, stdout, stderr) => {
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

export const execJAVA = async (dirOutput, filePath, customInput, randomString) => {
    let op = {
        error: { message: '' },
        output: '',
        time: 0,
    }; // by default will contain: error (stderror or other), output, time, memory

    // Read the file and replace the class name
    let data = fs.readFileSync(`${filePath}`, 'utf8');
    data = data.replace(/public class \w+/g, `public class ${randomString}`);
    fs.writeFileSync(`${filePath}`, data, 'utf8');
    console.log("Data: " + data + " " + `${filePath}`)

    return new Promise((resolve, reject) => {
        const compilationProcess = exec(`javac -d ${dirOutput} ${filePath}`, (err, stdout, stderr) => {
            if (err) {
                console.log("Compilation Error : " + err);
                op.error.message += "Compilation Error : " + err;
            }
            if (stderr) {
                console.log("Compilation Error : " + stderr);
                op.error.message += "Compilation Error : " + stderr;
            }
            // We don't need the stdout in this case.
            console.log("Inside Compilation Process");
        });
        compilationProcess.on('close', async (code) => {   // Compilation is done
            if (code === 0) {
                console.log("Compilation Done");
                const inputFilePath = join(__dirname, '..', 'data', 'inputs', `${randomString}.txt`);
                writeFile(inputFilePath, customInput, (err) => {
                    if (!err) {
                        console.log('input file written succesfully');
                    } else {
                        console.log("Error in writing file in txt ");
                        console.error(err);
                    }
                });
                const outputFilePath = join(dirOutput, `${randomString}.class`);
                try {
                    op = await Promise.race([
                        runProcess(op, dirOutput, randomString, inputFilePath, outputFilePath),
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
            }

            resolve(op);
        });
    });
}