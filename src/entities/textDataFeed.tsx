/* @flow */

import {
  DmDataFeed,
} from '@brightsign/bsdatamodel';

import {
  DataFeed
} from './dataFeed';

export class TextDataFeed extends DataFeed {

  rssItems: Array<any>;

  constructor(bsdmDataFeed: DmDataFeed) {
    super(bsdmDataFeed);
    this.rssItems = [];
  }

  parse(rssData: any) {

    const rssChannel = rssData.rss.channel[0];
    const rssItemSpecs = rssChannel.item;

    // check for change in feed
    if (rssItemSpecs.length !== this.rssItems.length) {
      console.log('parseSimpleRSSFeed - length changed');
    }
    rssItemSpecs.forEach( (rssItemSpec : any, index : any ) => {
      if (this.rssItems.length > index && rssItemSpec.title[0] !== this.rssItems[index].title) {
        console.log('parseSimpleRSSFeed - content changed');
      }
    });

    this.rssItems = rssItemSpecs.map( (rssItemSpec : any) => {
      return {
        description: rssItemSpec.description[0],
        title: rssItemSpec.title[0],
      };
    });
  }

  processFeedContents(bsp : Object, feedData : Object) {
    this.parse(feedData);
    this.postLiveDataFeedUpdateMessage(bsp);
  }


}
