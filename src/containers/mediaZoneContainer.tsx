import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import {
    ArEventType,
    ArState
} from '../types';

import MediaZone from '../components/mediaZone';

import { bsp } from '../app/bsp';

import { MediaZoneProps } from '../components/mediaZone';

import { getActiveMediaStateId } from '../store/activeMediaStates';

export function postBSPMessage(event : ArEventType) {
    return bsp.postMessage(event);
}

function mapStateToProps (state : ArState, ownProps : MediaZoneProps) {
    return {
        ...ownProps,
        activeMediaStateId: getActiveMediaStateId(state, ownProps.zone.id),
    };
}

const mapDispatchToProps = (dispatch : Dispatch<ArState>) => {
    return bindActionCreators({
        postBSPMessage,
    }, dispatch);
};


const MediaZoneContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaZone);

export default MediaZoneContainer;

