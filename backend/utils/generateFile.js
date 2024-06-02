import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dirCodes = path.join(__dirname, '../data/codes')
const dirOutput = path.join(__dirname, '../data/outputs')

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}


export const generateFile = (code, lang) => {
    let randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    let randomString = randomChar + uuidv4();
    randomString = randomString.replace(/-/g, '_');
    let fileName = `${randomString}.${lang}`; // remember to keep lang as the extension of the file when making request i.e. for python keep it as py, for c keep it as c, for c++ keep it as cpp
    console.log(fileName);
    const filePath = path.join(dirCodes, fileName); // ../data/codes/fileName
    fs.writeFileSync(filePath, code);
    return { filePath, dirOutput, randomString }; // for the runController to use this file
}