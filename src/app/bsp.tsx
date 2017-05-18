const fs = require("fs"),
    path = require("path");

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

const Promise = require('core-js/es6/promise');

import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

let _singleton : BSP = null;

class BSP {

    store : any;
    dispatch : Function;
    getState : Function;
    syncSpec : any;
    hsmList : Array<any>;

    constructor() {
        if (!_singleton) {
            console.log('bsp constructor invoked');
            _singleton = this;
        }
    }

    initialize(reduxStore : any) {

        console.log('bsp initialization');

        this.store = reduxStore;
        this.dispatch = this.store.dispatch;
        this.getState = this.store.getState;
        this.hsmList = [] ;

        const rootPath = DesktopPlatformService.getRootDirectory();
        const pathToPool = DesktopPlatformService.getPathToPool();

        let state : Object;

        this.openSyncSpec(path.join(rootPath, 'local-sync.json')).then((cardSyncSpec : any) => {

            console.log(cardSyncSpec);

            this.syncSpec = cardSyncSpec;

            // FileNameToFilePathLUT
            const poolAssetFiles : any = this.buildPoolAssetFiles(this.syncSpec, pathToPool);
            console.log(poolAssetFiles);

//             setPoolAssetFiles(poolAssetFiles);
//
//             state = this.store.getState();
//
// // Create player state machine
//             this.playerHSM = new PlayerHSM(this, this.dispatch, this.getState, state.bsdm);
//
// // Zone state machines are created by the Player state machine when it parses the schedule and autoplay files
//             this.playerHSM.initialize();

        }).catch((err : any) => {
            console.log(err);
            debugger;
        });
    }

    openSyncSpec(filePath : string = '') : any {

        return new Promise( (resolve : any, reject : any) => {

            fs.readFile(filePath, (err : any, dataBuffer : Buffer) => {

                if (err) {
                    reject(err);
                } else {
                    const syncSpecStr : string = decoder.write(dataBuffer);
                    const syncSpec : Object = JSON.parse(syncSpecStr);
                    resolve(syncSpec);
                }
            });
        });
    }

    // FileNameToFilePathLUT
    buildPoolAssetFiles(syncSpec : any, pathToPool : string) : any {

        let poolAssetFiles : any = {};

        syncSpec.files.download.forEach( (syncSpecFile : any) => {
            poolAssetFiles[syncSpecFile.name] = path.join(pathToPool, syncSpecFile.link);
        });

        return poolAssetFiles;
    }


}

export const bsp = new BSP();
