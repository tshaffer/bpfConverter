/* @flow */

import fs = require('fs');

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');

import {
  DataFeed,
} from './dataFeed';

import { MRSSDataFeedItem } from './mrssDataFeedItem';

export class MRSSFeed {

  dataFeed : DataFeed;
  ttlSeconds : number;
  title : string;
  items : object[];

  constructor(dataFeed : DataFeed) {
    this.dataFeed = dataFeed;
    this.ttlSeconds = -1;
  }

  populateFeedItems(filePath : string) {

    this.items = [];

    // read file
    const feedFileBuf = fs.readFileSync(filePath);
    const fileStr: string = decoder.write(feedFileBuf);
    const feed: any = JSON.parse(fileStr);

    const dataFeedBase = feed.rss.channel[0];
    if (dataFeedBase.title && dataFeedBase.title.length > 0) {
      this.title = dataFeedBase.title[0];
    }
    if (dataFeedBase.item) {
      dataFeedBase.item.forEach( (feedItem : any) => {
        this.items.push(new MRSSDataFeedItem(feedItem));
      });
    }
  }

  parseFeedByPlugin() {

  }

  setTTLMinutes() {

  }

  contentExists() {

  }

  allContentExists() {

  }
}
