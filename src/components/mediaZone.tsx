import * as React from "react";

const path = require("path");

import {
    ArEventType
} from '../types';

// import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

import ImageContainer from '../containers/imageContainer';
import VideoContainer from '../containers/videoContainer';
import MrssDisplayItemContainer from '../containers/mrssDisplayItemContainer';

import { getPoolFilePath } from '../utilities/utilities';

import {
    ContentItemType,
    EventType,
} from '@brightsign/bscore';

import {
    BsDmId,
    DmDerivedContentItem,
    DmMediaContentItem,
    DmZone,
    DmEvent,
    DmMediaStateState,
    DmState,
    dmGetMediaStateById,
    dmGetEventIdsForMediaState,
    dmGetEventById,
} from '@brightsign/bsdatamodel';

export interface MediaZoneProps {
    playbackState : string;
    bsdm : DmState;
    zone : DmZone;
    width : number;
    height : number;
    activeMediaStateId : string;
    // postBSPMessage : Function;
}

export default class MediaZone extends React.Component<any, object> {

    nextAsset()  {
        let event : ArEventType = {
            'EventType' : 'timeoutEvent'
        };
        this.props.postBSPMessage(event);
    }

    renderMediaItem(contentItem: DmDerivedContentItem, event : DmEvent) {

        let duration : number = 10;

        let self = this;

        // unsafe cast
        const mediaContentItem : DmMediaContentItem = contentItem as DmMediaContentItem;

        const assetId : string = mediaContentItem.assetId;
        // TODO - HACK - need FileName!!
        const mediaType : ContentItemType = mediaContentItem.type;

        const resourceIdentifier : string = path.basename(assetId);

        const eventName : EventType = event.type;
        switch(eventName) {
            case 'Timer': {
                duration = event.data.interval;
                break;
            }
            case 'MediaEnd': {
                break;
            }
            default: {
                debugger;
            }
        }

        const src : string = path.join('file://', getPoolFilePath(resourceIdentifier));

        switch (mediaType) {
            case 'Image': {
                return (
                    <ImageContainer
                        resourceIdentifier={src}
                        width={this.props.width}
                        height={this.props.height}
                        duration={duration * 1000}
                        onTimeout={self.nextAsset.bind(this)}
                    />
                );
            }
            case 'Video': {
                return (
                    <VideoContainer
                        resourceIdentifier={src}
                        width={this.props.width}
                        height={this.props.height}
                        onVideoEnd={self.nextAsset.bind(this)}
                    />
                );
            }
            default: {
                debugger;
            }
        }
    }

    renderMrssItem(mrssContentItem : any) {

        let duration : number = 3;

        let self = this;

        const dataFeedId : string = mrssContentItem.dataFeedId;

        return (
            <MrssDisplayItemContainer
                dataFeedId={dataFeedId}
                width={this.props.width}
                height={this.props.height}
                duration={duration * 1000}
                onTimeout={self.nextAsset.bind(this)}
            />
        );
    }

    getEvent( bsdm : DmState, mediaStateId: string ) : DmEvent {

        let eventIds : Array<BsDmId> = dmGetEventIdsForMediaState(bsdm, { id : mediaStateId });
        if (eventIds.length !== 1) {
            debugger;
        }

        let event : DmEvent = dmGetEventById(bsdm, { id : eventIds[0] });
        if (!event) {
            debugger;
        }

        return event;
    }


    render() {

        console.log('mediaZone.js::render invoked');

        if (this.props.playbackState !== 'active') {
            return (
                <div>Playback state inactive</div>
            );
        }

        const mediaStateId : string = this.props.activeMediaStateId;
        const mediaState : DmMediaStateState = dmGetMediaStateById(this.props.bsdm, { id : mediaStateId });
        const event : DmEvent = this.getEvent(this.props.bsdm, mediaState.id);
        const contentItem : DmDerivedContentItem = mediaState.contentItem;

        // unsafe cast
        const mediaContentItem : DmMediaContentItem = contentItem as DmMediaContentItem;

        switch(mediaContentItem.type) {
            case'Video':
            case 'Image': {
                return this.renderMediaItem(mediaContentItem, event);
            }
            case 'MrssFeed': {
                return this.renderMrssItem(mediaContentItem);
            }
            default: {
                break;
            }
        }
    }
}
