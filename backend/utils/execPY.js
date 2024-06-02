import { exec } from 'child_process';
import { error } from 'console';

const runProcess = async (op, dirOutput, filePath, customInput) => new Promise((resolve, reject) => {
    const start = new Date();
    const proc = exec(`cd ${dirOutput} && python ${filePath}`, (err, stdout, stderr) => {
        if (err) {
            console.log("Runtime Error : " + err.message);
            op.error = err;
            op.output = err;
            reject(err);
        }
        if (stderr) {
            console.log("Runtime Error : " + stderr.message);
            op.error = stderr;
            op.output = stderr;
            reject(stderr);
        }
        console.log("Output : " + stdout);
        console.log("Error : " + op.error);
        op.output += stdout;
        const end = new Date();
        op.time = end - start; // convert to milliseconds
        // op.memory = process.memoryUsage().heapUsed / 1024 / 1024; // convert to MB
        resolve(op);
    });
    proc.stdin.write(customInput);
    proc.stdin.end();

});

export const execPY = async (dirOutput, filePath, customInput) => {
    let op = {
        error: null,
        output: '',
        time: 0,
        memory: 0
    }; // by default will contain: error (stderror or other), output, time, memory
    try {
        op = await Promise.race([
            runProcess(op, dirOutput, filePath, customInput),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Runtime time limit exceeded')), 1500))
        ]);
    } catch (error) {
        console.log("Runtime Limit wala Error : " + error.message);
        op.output = error.message;
        op.error = error.message;
        console.log(op.error);
        op.time = 2000;
        op.memory = error.message;
        return op;
    }
    return op;
}