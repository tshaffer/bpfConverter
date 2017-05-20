const fs = require("fs"),
    path = require("path");

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

import {
    BsDmId,
    dmOpenSign,
    dmGetZonesForSign,
    dmGetZoneById,
    dmGetDataFeedIdsForSign,
    dmGetDataFeedById,
} from '@brightsign/bsdatamodel';


import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

import {
    setPoolAssetFiles
} from '../utilities/utilities';

import {
    HSM
} from '../hsm/HSM';

import {
    PlayerHSM
} from '../hsm/playerHSM';

import {
    ZoneHSM
} from '../hsm/zoneHSM';


let _singleton : BSP = null;

export class BSP {

    store : any;
    dispatch : Function;
    getState : Function;
    syncSpec : any;
    hsmList : Array<HSM>;
    playerHSM: PlayerHSM;

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

        let state : any;

        this.openSyncSpec(path.join(rootPath, 'local-sync.json')).then((cardSyncSpec : any) => {

            console.log(cardSyncSpec);

            this.syncSpec = cardSyncSpec;

            // FileNameToFilePathLUT
            const poolAssetFiles : any = this.buildPoolAssetFiles(this.syncSpec, pathToPool);
            console.log(poolAssetFiles);

            setPoolAssetFiles(poolAssetFiles);

            state = this.store.getState();

// Create player state machine
            this.playerHSM = new PlayerHSM(this, this.dispatch, this.getState, state.bsdm);

// Zone state machines are created by the Player state machine when it parses the schedule and autoplay files
            this.playerHSM.initialize();

        }).catch((err : any) => {
            console.log(err);
            debugger;
        });
    }

    startPlayback() {

        const bsdm = this.getState().bsdm;

        let zoneHSMs : Array<ZoneHSM> = [];

        const zoneIds : Array<BsDmId> = dmGetZonesForSign(bsdm);
        zoneIds.forEach( (zoneId : BsDmId) => {

            const bsdmZone = dmGetZoneById(bsdm, { id: zoneId });

            let zoneHSM : ZoneHSM;

            switch (bsdmZone.type) {
                default: {
                    zoneHSM = new ZoneHSM(this.dispatch, this.getState, zoneId);
                    break;
                }
            }
            zoneHSMs.push(zoneHSM);
            this.hsmList.push(zoneHSM);
        });

        zoneHSMs.forEach( (zoneHSM : ZoneHSM) => {
            zoneHSM.constructorFunction();
            zoneHSM.initialize();
        });
    }

    restartPlayback(presentationName : string) : any {

        console.log('restart: ', presentationName);

        const rootPath = DesktopPlatformService.getRootDirectory();

        return new Promise( (resolve : Function) => {
            this.getAutoschedule(this.syncSpec, rootPath).then( (autoSchedule : any) => {

                // TODO - only a single scheduled item is currently supported

                const scheduledPresentation = autoSchedule.scheduledPresentations[0];
                const presentationToSchedule = scheduledPresentation.presentationToSchedule;
                const presentationName = presentationToSchedule.name;
                const bmlFileName = presentationName + '.bml';

                this.getSyncSpecFile(bmlFileName, this.syncSpec, rootPath).then( (autoPlay : any) => {
                    console.log(autoPlay);
                    this.dispatch(dmOpenSign(autoPlay));

                    // get data feeds for the sign
                    let bsdm = this.getState().bsdm;
                    const dataFeedIds = dmGetDataFeedIdsForSign(bsdm);
                    dataFeedIds.forEach( (dataFeedId) => {
                        const dmDataFeed = dmGetDataFeedById(bsdm, { id: dataFeedId });

                    });
                    resolve();
                });
            });
        });
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
