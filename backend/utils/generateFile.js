import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dirCodes = path.join(__dirname, '../data/codes')

if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
}


export const generateFile = (code, lang) => {
    const randomString = uuidv4();
    const fileName = `${randomString}.${lang}`; // remember to keep lang as the extension of the file when making request i.e. for python keep it as py, for c keep it as c, for c++ keep it as cpp
    const filePath = path.join(dirCodes, fileName); // ../data/codes/fileName
    fs.writeFileSync(filePath, code);
    return filePath; // for the runController to use this file
}