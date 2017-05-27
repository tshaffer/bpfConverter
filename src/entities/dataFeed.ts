const xml2js = require('xml2js');

import {
  DmDataFeed,
  DmParameterizedString,
  dmGetSimpleStringFromParameterizedString,
} from '@brightsign/bsdatamodel';

import { BSP } from '../app/bsp';

import {
  ArFileLUT,
} from '../types';

export default class DataFeed {

  id : string;
  type : string;
  usage : string;
  url : DmParameterizedString;
  updateInterval : number;
  name : string;
  feedPoolAssetFiles : ArFileLUT;

  constructor(bsdmDataFeed: DmDataFeed) {
    Object.assign(this, bsdmDataFeed);
  }

  restartDownloadTimer(bsp : BSP) {

    const updateInterval = this.updateInterval * 1000;

    setTimeout(() => {
        console.log('restartDownloadTimer: timeout occurred');
        bsp.queueRetrieveLiveDataFeed(this);
      }
      , updateInterval,
    );
  }

  // base class method - should never be called
  processFeedContents(_ : object, __ : object) {
    debugger;
  }

  retrieveFeed(bsp : object) {

    const url = dmGetSimpleStringFromParameterizedString(this.url);

    console.log('retrieveFeed: ' + url);

    fetch(url)
      .then( (response) => {
        const blobPromise = response.text();
        blobPromise.then( (content) => {
          const parser = new xml2js.Parser();
          try {
            parser.parseString(content, (err : Error, jsonResponse : any) => {
              if (err) {
                console.log(err);
                debugger;
              }
              console.log(jsonResponse);
              this.processFeedContents(bsp, jsonResponse);
            });
          } catch (err) {
            debugger;
          }
        });
      }).catch( (err) => {
      console.log(err);
      debugger;
    });
  }

  postLiveDataFeedUpdateMessage(bsp : BSP) {
    // send internal message indicating that the data feed has been updated
    const event = {
      EventType : 'LIVE_DATA_FEED_UPDATE',
      EventData : this,
    };
    bsp.dispatch(bsp.postMessage(event));

    // ' set a timer to update this live data feed
    this.restartDownloadTimer(bsp);
  }
}
