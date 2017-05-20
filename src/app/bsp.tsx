const fs = require("fs"),
    path = require("path");

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

const Promise = require('core-js/es6/promise');

import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

let _singleton : BSP = null;

export class BSP {

    store : any;
    dispatch : Function;
    getState : Function;
    syncSpec : any;
    hsmList : Array<any>;
    playerHSM: any; // PlayerHSM

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

    restartPlayback(presentationName : string) : any {

    }

    postMessage(event : any) : () => void {
        return () => {
            this.dispatchEvent(event);
        };
    }

    dispatchEvent(event : any) {

        this.playerHSM.Dispatch(event);

        this.hsmList.forEach( (hsm) => {
            hsm.Dispatch(event);
        });
    }


    getAutoschedule(syncSpec : Object, rootPath : string) {
        return this.getSyncSpecFile('autoschedule.json', syncSpec, rootPath);
    }


    openSyncSpec(filePath : string = '') : any {

        return new Promise( (resolve : Function, reject : Function) => {

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

    getSyncSpecFile(fileName : string, syncSpec : any, rootPath : string) {

        return new Promise( (resolve : Function, reject : Function) => {

            let syncSpecFile = this.getFile(syncSpec, fileName);
            if (syncSpecFile == null) {
                debugger;
                syncSpecFile = {};    // required to eliminate flow warnings
            }

            // const fileSize = syncSpecFile.size;
            const filePath : string = path.join(rootPath, syncSpecFile.link);

            fs.readFile(filePath, (err : any, dataBuffer : Buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const fileStr : string = decoder.write(dataBuffer);
                    const file : Object = JSON.parse(fileStr);

                    // comment out the following code to allow hacking of files -
                    // that is, overwriting files in the pool without updating the sync spec with updated sha1
                    // if (fileSize !== fileStr.length) {
                    //   debugger;
                    // }
                    resolve(file);
                }
            });
        });
    }

    getFile(syncSpec : any, fileName : string) : any {

        let file = null;

        syncSpec.files.download.forEach( (syncSpecFile : any) => {
            if (syncSpecFile.name === fileName) {
                file = syncSpecFile;
                return;
            }
        });

        return file;
    }



// FileNameToFilePathLUT
    buildPoolAssetFiles(syncSpec : any, pathToPool : string) : any {

        let poolAssetFiles : any = {};

        syncSpec.files.download.forEach( (syncSpecFile : any) => {
            poolAssetFiles[syncSpecFile.name] = path.join(pathToPool, syncSpecFile.link);
        });

        return poolAssetFiles;
    }

    // queueRetrieveLiveDataFeed(dataFeed : DataFeed) {
    queueRetrieveLiveDataFeed(dataFeed : any) {

        const liveDataFeed = dataFeed;

        // if (liveDataFeed.usage === DataFeedUsageType.Text) {
        //     dataFeed.retrieveFeed(this);
        // }
        // else {
        //     // is the following correct? check with autorun classic
        //     this.liveDataFeedsToDownload.push(liveDataFeed);
        //
        //     // launch download of first feed
        //     if (this.liveDataFeedsToDownload.length === 1) {
        //         dataFeed.retrieveFeed(this);
        //     }
        // }
    }

}

export const bsp = new BSP();
