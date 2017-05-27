export default class MRSSDataFeedItem {

  guid : string;
  url : string;
  title : string;
  description : string;
  duration : number;
  fileSize : number;
  medium : string;
  type : string;
  thumbnailUrl : string;
  pubDate : string;

  constructor(feedItem : any) {

    this.guid = feedItem.guid ? feedItem.guid[0] : '';
    this.url = feedItem.url ? feedItem.url[0] : '';
    this.title = feedItem.title ? feedItem.title[0] : '';
    this.description = feedItem.description ? feedItem.description[0] : '';
    this.duration = feedItem.duration ? feedItem.duration[0] : 0;
    this.fileSize = feedItem.fileSize ? feedItem.fileSize[0] : 0;
    this.medium = feedItem.medium ? feedItem.medium[0] : '';
    this.type = feedItem.type ? feedItem.type[0] : '';
    this.thumbnailUrl = '';
    this.pubDate = feedItem.pubDate ? feedItem.pubDate[0] : '';

    // TODO - check for existence before creating
    const mediaContent = feedItem['media:content'][0]['$'];
    this.url = mediaContent.url;
    this.fileSize = Number(mediaContent.fileSize);
    this.type = mediaContent.type;
    this.medium = mediaContent.medium;
    this.duration = Number(mediaContent.duration);

    // TODO - check for existence before creating
    const mediaThumbnail = feedItem['media:thumbnail'][0]['$'];
    this.thumbnailUrl = mediaThumbnail.url;
  }

  isImage() : boolean {
    if (this.type === 'image/jpeg' || this.type === 'image/png') {
      return true;
    }

    return false;
  }

  isVideo() : boolean {

    if (this.type === 'video/mpeg' || this.type === 'video/mp4' || this.type === 'video/quicktime' ||
        this.type === 'video/x-matroska' || this.medium === 'video') {
      return true;
    }

    return false;
  }
}
