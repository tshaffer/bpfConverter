import fs = require('fs');

import {
    ArFileLUT,
} from '../types';

let poolAssetFiles : ArFileLUT = {};

export function setPoolAssetFiles(poolAssetFilesIn : ArFileLUT) {
    poolAssetFiles = poolAssetFilesIn;
}

export function addPoolAssetFile(fileName : string, filePath : string) {
    poolAssetFiles[fileName] = filePath;
}

export function getPoolFilePath(resourceIdentifier : string) {

    const filePath : string =  poolAssetFiles[resourceIdentifier];
    console.log('resourceIdentifier: ' + resourceIdentifier + ', filePath: ' +  filePath);
    return filePath;
}

// From ArrayBuffer to Buffer
export function arrayBufferToBuffer(ab : ArrayBuffer) : Buffer {
    const buf = new Buffer(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

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
