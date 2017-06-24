import * as React from 'react';

import {
    DmState,
    DmZone,
    dmGetZoneById,
    dmGetZonesForSign,
} from '@brightsign/bsdatamodel';

import MediaZoneContainer from '../containers/mediaZoneContainer';
import TickerZoneContainer from '../containers/tickerZoneContainer';

export interface SignProps {
    bsdm: DmState;
    playbackState : string;
}

export default class Sign extends React.Component<SignProps, object> {

    getMediaZoneJSX(zone : DmZone) : object {

        return (
            <div
                key={zone.id}
                style={{
                  position: 'absolute',
                  left: zone.position.x,
                  top: zone.position.y,
                  width: zone.position.width,
                  height: zone.position.height,
                }}
            >
                <MediaZoneContainer
                    key={zone.id}
                    playbackState={this.props.playbackState}
                    bsdm={this.props.bsdm}
                    zone={zone}
                    width={Number(zone.position.width)}
                    height={Number(zone.position.height)}
                    activeMediaStateId={''}
                />
            </div>
        );
    }

    getTickerZoneJSX(zone : DmZone) {

        return (
            <div
                key={zone.id}
                style={{
          position: 'absolute',
          left: zone.position.x,
          top: zone.position.y,
          width: zone.position.width,
          height: zone.position.height,
        }}
            >
                <TickerZoneContainer
                    key={zone.id}
                    playbackState={this.props.playbackState}
                    bsdm={this.props.bsdm}
                    zone={zone}
                    left={Number(zone.position.x)}
                    top={Number(zone.position.y)}
                    width={Number(zone.position.width)}
                    height={Number(zone.position.height)}
                />
            </div>
        );
    }

    getZoneJSX(zoneId : string) : object {

        const zone : DmZone = dmGetZoneById(this.props.bsdm, { id: zoneId });

        switch (zone.type) {
            case 'VideoOrImages': {
                return this.getMediaZoneJSX(zone);
            }
            case 'Ticker': {
                return this.getTickerZoneJSX(zone);
            }
            default: {
                debugger;
            }
        }
    }

    render() {

        const zoneIds : string[] = dmGetZonesForSign(this.props.bsdm);

        return (
            <div>
                {
                    zoneIds.map( (zoneId) =>
                        this.getZoneJSX(zoneId),
                    )
                }
            </div>
        );
    }
}
