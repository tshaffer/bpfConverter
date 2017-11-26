import * as React from 'react';

import path = require('path');

import {
  ArEventType,
} from '../types';

// import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

import ImageContainer from '../containers/imageContainer';
import VideoContainer from '../containers/videoContainer';
import MrssDisplayItemContainer from '../containers/mrssDisplayItemContainer';

import { getPoolFilePath } from '../utilities/utilities';

import {
  dmGetAssetItemById,
} from '@brightsign/bsdatamodel';
import {BsAssetItem} from "@brightsign/bscore";

import {
  ContentItemType,
  EventType,
} from '@brightsign/bscore';

import {
  BsDmId,
  DmDataFeedContentItem,
  DmDerivedContentItem,
  DmMediaContentItem,
  DmEvent,
  DmEventData,
  DmMediaState,
  DmState,
  DmTimer,
  dmGetMediaStateById,
  dmGetEventIdsForMediaState,
  dmGetEventById,
} from '@brightsign/bsdatamodel';

import { MediaZoneStateProps, MediaZoneDispatchProps } from '../containers/mediaZoneContainer';

export default class MediaZone extends React.Component<MediaZoneStateProps & MediaZoneDispatchProps, object> {

  postBpEvent() {
    const event : ArEventType = {
      EventType : 'bpEvent',
    };
    this.props.postBSPMessage(event);
  }

  postTimeoutEvent()  {
    const event : ArEventType = {
      EventType : 'timeoutEvent',
    };
    this.props.postBSPMessage(event);
  }

  postMediaEndEvent()  {
    const event : ArEventType = {
      EventType : 'mediaEndEvent',
    };
    this.props.postBSPMessage(event);
  }

  renderMediaItem(mediaState : DmMediaState, contentItem: DmDerivedContentItem, events : DmEvent[]) {

    let duration : number = 10;

    const self = this;

    // unsafe cast
    const mediaContentItem : DmMediaContentItem = contentItem as DmMediaContentItem;

    const assetId : string = mediaContentItem.assetId;
    const assetItem : BsAssetItem = dmGetAssetItemById(this.props.bsdm, { id : assetId });

    // TODO - near term (likely) fix
    // const fileId : string = assetItem.name;
    const fileId : string = mediaState.name;

    const poolFilePath : string = getPoolFilePath(fileId);
    const src : string = path.join('file://', poolFilePath);

    const mediaType : ContentItemType = mediaContentItem.type;

    const event : DmEvent = events[0];
    const eventName : EventType = event.type;
    switch (eventName) {
      case 'Timer': {
        const eventData : DmEventData = event.data;
        duration = (eventData as DmTimer).interval;
        break;
      }
      case 'MediaEnd':
      case 'Bp': {
        break;
      }
      default: {
        console.log('semi unknown eventName: ' + eventName);
      }
    }

    switch (mediaType) {
      case 'Image': {
        return (
          <ImageContainer
            width={this.props.width}
            height={this.props.height}
            duration={duration * 1000}
            onTimeout={self.postTimeoutEvent.bind(this)}
            src={src}
          />
        );
      }
      case 'Video': {
        return (
          <VideoContainer
            width={this.props.width}
            height={this.props.height}
            onVideoEnd={self.postMediaEndEvent.bind(this)}
            src={src}
          />
        );
      }
      default: {
        debugger;
      }
    }
  }

  renderMrssItem(mrssContentItem : DmDataFeedContentItem) {

    const duration : number = 3;

    const self = this;

    const dataFeedId : string = mrssContentItem.dataFeedId;

    return (
      <MrssDisplayItemContainer
        dataFeedId={dataFeedId}
        width={this.props.width}
        height={this.props.height}
        duration={duration * 1000}
        onTimeout={self.postTimeoutEvent.bind(this)}
      />
    );
  }

  getEvents(bsdm : DmState, mediaStateId: string ) : DmEvent[] {

    let events : DmEvent[] = [];

    const eventIds : BsDmId[] = dmGetEventIdsForMediaState(bsdm, { id : mediaStateId });

    events = eventIds.map((eventId) => {
      return dmGetEventById(bsdm, { id : eventId });
    });

    return events;
  }

  render() {

    console.log('mediaZone.js::render invoked');

    if (this.props.playbackState !== 'active') {
      return (
        <div>Playback state inactive</div>
      );
    }

    const mediaStateId : string = this.props.activeMediaStateId;
    const mediaState : DmMediaState = dmGetMediaStateById(this.props.bsdm, { id : mediaStateId });

    const events : DmEvent[] = this.getEvents(this.props.bsdm, mediaState.id);
    const contentItem : DmDerivedContentItem = mediaState.contentItem;

    switch (contentItem.type) {
      case'Video':
      case 'Image': {
        return this.renderMediaItem(mediaState, contentItem as DmMediaContentItem, events);
      }
      case 'MrssFeed': {
        return this.renderMrssItem(contentItem as DmDataFeedContentItem);
      }
      default: {
        break;
      }
    }
  }
}
