import * as React from "react";

import {
    DmState,
    DmZone,
    dmGetZoneById,
    dmGetZonesForSign,
} from '@brightsign/bsdatamodel';

import MediaZoneContainer from '../containers/mediaZoneContainer';

export interface SignProps {
    bsdm: DmState;
    playbackState : string;
}

export default class Sign extends React.Component<SignProps, object> {

    getMediaZoneJSX(zone : DmZone) : Object {

        return (
            <div
                key={zone.id}
                style={{
                  position: 'absolute',
                  left: zone.absolutePosition.x,
                  top: zone.absolutePosition.y,
                  width: zone.absolutePosition.width,
                  height: zone.absolutePosition.height
                }}
            >
                <MediaZoneContainer
                    key={zone.id}
                    playbackState={this.props.playbackState}
                    bsdm={this.props.bsdm}
                    zone={zone}
                    width={Number(zone.absolutePosition.width)}
                    height={Number(zone.absolutePosition.height)}
                    activeMediaStateId={''}
                />
            </div>
        );
    }

    getZoneJSX(zoneId : string) : Object {

        const zone : DmZone = dmGetZoneById(this.props.bsdm, { id: zoneId });

        switch (zone.type) {
            case 'VideoOrImages': {
                const mediaZoneJSX = this.getMediaZoneJSX(zone);
                return mediaZoneJSX;
            }
            case 'Ticker': {
                // debugger;
                return null;
                // const tickerZoneJSX  = this.getTickerZoneJSX(zone);
                // return tickerZoneJSX;
            }
            default: {
                debugger;
            }
        }
    }

    render() {

        const zoneIds : Array<string> = dmGetZonesForSign(this.props.bsdm);

        return (
            <div>
                {
                    zoneIds.map( (zoneId) =>
                        this.getZoneJSX(zoneId)
                    )
                }
            </div>
        );
    }
}
