const fs = require('fs');
const path = require('path');

function isJSONFilePath(str) {
    const ext = path.extname(str).toLowerCase();
    return ext === '.json';
}

function readJSONFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    reject(new Error(`File not found: ${filePath}`));
                } else {
                    reject(err);
                }
            } else {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

function writeJSONFile(filePath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    isJSONFilePath,
    readJSONFile,
    writeJSONFile
}