import * as React from "react";

import {
    dmGetZoneById,
    dmGetZonesForSign,
} from '@brightsign/bsdatamodel';

import MediaZoneContainer from '../containers/mediaZoneContainer';

export interface SignProps {
    bsdm: any;
    playbackState : string;
}

export default class Sign extends React.Component<SignProps, object> {

    getMediaZoneJSX(zone : any) : any {

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

    getZoneJSX(zoneId : string) : any {

        const zone : any = dmGetZoneById(this.props.bsdm, { id: zoneId });

        switch (zone.type) {
            case 'VideoOrImages': {
                const mediaZoneJSX = this.getMediaZoneJSX(zone);
                return mediaZoneJSX;
            }
            case 'Ticker': {
                debugger;
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
