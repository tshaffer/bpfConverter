import fs = require('fs');

export function mkdir(dirPath: string, ignoreAlreadyExists: boolean = true) {
    return new Promise( (resolve, reject) => {
        fs.mkdir(dirPath, 0o777, (err : any) => {
            if (!err || (err.code === 'EEXIST' && ignoreAlreadyExists)) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}
