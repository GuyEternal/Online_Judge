import { exec } from 'child_process';
import { stderr, stdin } from 'process';
import fs from 'fs';

const runProcess = async (op, dirOutput, randomString, customInput) => new Promise((resolve, reject) => {
    const start = new Date();
    const proc = exec(`cd ${dirOutput} && java ${randomString}`, (err, stdout, stderr) => {
        if (err) {
            console.log("Runtime Error : " + err);
            op.error = err;
            reject(err);
        }
        if (stderr) {
            console.log("Runtime Error : " + stderr);
            op.error = stderr;
            reject(stderr);
        }
        console.log("Output : " + stdout);
        op.output += stdout;
        const end = new Date();
        op.time = end - start; // convert to milliseconds
        op.memory = process.memoryUsage().heapUsed / 1024 / 1024; // convert to MB
        resolve(op);
    });
    proc.stdin.write(customInput);
    proc.stdin.end();
});

export const execJAVA = async (dirOutput, filePath, customInput, randomString) => {
    let op = {
        error: {},
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
                op.error += err;
            }
            if (stderr) {
                console.log("Compilation Error : " + stderr);
                op.error += stderr;
            }
            // We don't need the stdout in this case.
            console.log("Inside Compilation Process");
        });
        compilationProcess.on('close', async (code) => {   // Compilation is done
            if (code === 0) {
                console.log("Compilation Done");
                try {
                    op = await Promise.race([
                        runProcess(op, dirOutput, randomString, customInput),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Runtime time limit exceeded')), 1000))
                    ]);
                } catch (error) {
                    console.log("Runtime Limit  Error : " + error);
                    op.output = "Runtime Limit  Error : " + error;
                    op.error = error;
                    console.log(op.error);
                    op.time = 2000;
                    op.memory = error;
                }
            }
            resolve(op);
        });
    });
}