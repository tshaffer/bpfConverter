/* @flow */

const xml2js = require('xml2js');

import {
  DmDataFeed,
  dmGetParameterizedStringFromString,
  dmGetSimpleStringFromParameterizedString,
} from '@brightsign/bsdatamodel';

export class DataFeed {

  id : string;
  type : string;
  usage : string;
  url : string;
  updateInterval : number;
  name : string;

  constructor(bsdmDataFeed: DmDataFeed) {
    Object.assign(this, bsdmDataFeed);
  }

  restartDownloadTimer(bsp : any) {

    const updateInterval = this.updateInterval * 1000;

    setTimeout(() => {
      console.log('restartDownloadTimer: timeout occurred');
      bsp.queueRetrieveLiveDataFeed(this);
    }
      ,updateInterval
    );
  }

  processFeedContents(_ : Object, __ : Object) {
    debugger;
  }

  retrieveFeed(bsp : Object) {

    const url = dmGetSimpleStringFromParameterizedString(dmGetParameterizedStringFromString(this.url));

    console.log('retrieveFeed: ' + url);

    fetch(url)
      .then( (response) => {
        let blobPromise = response.text();
        blobPromise.then( (content) => {
          let parser = new xml2js.Parser();
          try {
            parser.parseString(content, (err : any, jsonResponse : any) => {
              if (err) {
                console.log(err);
                debugger;
              }
              console.log(jsonResponse);
              this.processFeedContents(bsp, jsonResponse);
            });
          }
          catch (err) {
            debugger;
          }
        });
      }).catch( (err) => {
        console.log(err);
        debugger;
      });
  }

  postLiveDataFeedUpdateMessage(bsp : any) {
    // send internal message indicating that the data feed has been updated
    let event = {
      'EventType' : 'LIVE_DATA_FEED_UPDATE',
      'EventData' : this
    };
    bsp.dispatch(bsp.postMessage(event));

    // ' set a timer to update this live data feed
    this.restartDownloadTimer(bsp);
  }
}



