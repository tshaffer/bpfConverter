let poolAssetFiles : any = {};

export function setPoolAssetFiles(poolAssetFilesIn : any) {
    poolAssetFiles = poolAssetFilesIn;
}

export function addPoolAssetFile(fileName : string, filePath : string) {
    poolAssetFiles[fileName] = filePath;
}

export function getPoolFilePath(resourceIdentifier : string) {

    const filePath =  poolAssetFiles[resourceIdentifier];
    console.log('resourceIdentifier: ' + resourceIdentifier + ', filePath: ' +  filePath);
    return filePath;
}
