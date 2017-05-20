import * as React from "react";

const path = require("path");

// import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

import ImageContainer from '../containers/imageContainer';

import { getPoolFilePath } from '../utilities/utilities';

import {
    dmGetHtmlSiteById,
    dmGetMediaStateById,
    dmGetEventIdsForMediaState,
    dmGetEventById,
} from '@brightsign/bsdatamodel';

import { postBSPMessage } from '../containers/mediaZoneContainer';

export interface MediaZoneProps {
    playbackState : string;
    bsdm : any;
    zone : any;
    width : number;
    height : number;
    activeMediaStateId : string;
    // postBSPMessage : Function;
}

export default class MediaZone extends React.Component<MediaZoneProps, object> {

    nextAsset()  {
        let event = {
            'EventType' : 'timeoutEvent'
        };
        postBSPMessage(event);
    }

    renderMediaItem(mediaContentItem: any, event : any) {

        let duration : number = 10;

        let self = this;

        const assetId : string = mediaContentItem.assetId;
        // TODO - HACK - need FileName!!
        const mediaType : string = mediaContentItem.type;

        const resourceIdentifier : string = path.basename(assetId);

        const eventName : string = event.type;
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
            default: {
                debugger;
            }
        }
    }

    getEvent( bsdm : any, mediaStateId: string ) : any {

        let eventIds : Array<string> = dmGetEventIdsForMediaState(bsdm, { id : mediaStateId });
        if (eventIds.length !== 1) {
            debugger;
        }

        let event : any = dmGetEventById(bsdm, { id : eventIds[0] });
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
        const mediaState : any = dmGetMediaStateById(this.props.bsdm, { id : mediaStateId });
        const event : any = this.getEvent(this.props.bsdm, mediaState.id);
        const mediaContentItem : any = mediaState.contentItem;

        switch(mediaContentItem.type) {
            case 'Image': {
                return this.renderMediaItem(mediaContentItem, event);
            }
            default: {
                break;
            }
        }
    }
}
