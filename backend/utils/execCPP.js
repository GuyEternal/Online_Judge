import { exec, spawn } from 'child_process';
import { stderr, stdin } from 'process';

const runProcess = async (op, dirOutput, randomString, customInput) => new Promise((resolve, reject) => {
    const start = new Date();
    // When creating the dockerFile if youre using Linux, you can use the following command:
    // const proc = exec(`cd ${dirOutput} && ./${randomString}.exe`, (err, stdout, stderr) => { 
    const proc = exec(`cd ${dirOutput} && ${randomString}`, (err, stdout, stderr) => {
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

export const execCPP = async (dirOutput, filePath, customInput, randomString) => {
    let op = {
        error: {},
        output: '',
        time: 0,
    }; // by default will contain: error (stderror or other), output, time, memory
    return new Promise((resolve, reject) => {
        const compilationProcess = exec(`g++ ${filePath} -o ${dirOutput}/${randomString}.exe`, (err, stdout, stderr) => {
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
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Runtime time limit exceeded')), 2000))
                    ]);
                } catch (error) {
                    console.log("Runtime Limit wala Error : " + error);
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
//     const compilationProcess = exec(`g++ ${filePath} -o ${dirOutput}/${randomString}.exe`, (err, stdout, stderr) => {
//         if (err) {
//             console.log("Compilation Error : " + err);
//         }
//         if (stderr) {
//             console.log("Compilation Error : " + stderr);
//         }
//         // We don't need the stdout in this case.
//     });
//     compilationProcess.on('exit', (code) => {   // Compilation is done
//         if (code === 0) {
//             return runProcess(op, dirOutput, randomString, customInput);
//         }
//     });
//     console.log("Here");

//     //  runProcess.stdin.write(customInput);
//     // runProcess.stdin.end();

//     return op;
// }

// const { spawn } = require('node:child_process');
// const ps = spawn('ps', ['ax']);
// const grep = spawn('grep', ['ssh']);

// ps.stdout.on('data', (data) => {
//   grep.stdin.write(data);
// });

// ps.stderr.on('data', (data) => {
//   console.error(`ps stderr: ${data}`);
// });

// ps.on('close', (code) => {
//   if (code !== 0) {
//     console.log(`ps process exited with code ${code}`);
//   }
//   grep.stdin.end();
// });

// grep.stdout.on('data', (data) => {
//   console.log(data.toString());
// });

// grep.stderr.on('data', (data) => {
//   console.error(`grep stderr: ${data}`);
// });

// grep.on('close', (code) => {
//   if (code !== 0) {
//     console.log(`grep process exited with code ${code}`);
//   }
// });