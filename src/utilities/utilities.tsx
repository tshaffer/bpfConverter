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
