import * as React from "react";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPlaybackState } from '../store/stateMachine';
// import { postMessage } from '../store/stateMachine';

import Sign from '../components/sign';

// HACK
export let myApp = {};

class App extends React.Component<any, object> {

    constructor(props: Object) {
        super(props);

        myApp = this;
    }

    state: Object;

    render() {

        if (this.props.bsdm.zones.allZones.length === 0 ||
            Object.keys(this.props.activeMediaStates.activeMediaStateByZone).length === 0) {
            return (
                <div>
                    Waiting for the presentation to be loaded...
                </div>
            );
        }

        // postMessage={this.props.postMessage}
        return (
            <Sign
                bsdm={this.props.bsdm}
                playbackState={this.props.playbackState}
            />
        );
    }
}

// const mapStateToProps = (state : any) => {
//     return (
//         bsdm: state.bsdm,
//         playbackState: state.stateMachine.playbackState,
//         activeMediaStates : state.activeMediaStates
//     );
// }
function mapStateToProps (state : any) {

    return {
        bsdm: state.bsdm,
        playbackState: state.stateMachine.playbackState,
        activeMediaStates : state.activeMediaStates
    };
}


const mapDispatchToProps = (dispatch : any) => {
    return bindActionCreators({
        // initBSP,
        // restartPresentation,
        setPlaybackState,
        // postMessage,
    }, dispatch);
};

// App.propTypes = {
//     playbackState: React.PropTypes.string.isRequired,
//     // initBSP: React.PropTypes.func.isRequired,
//     setPlaybackState: React.PropTypes.func.isRequired,
//     // restartPresentation: React.PropTypes.func.isRequired,
//     // postMessage: React.PropTypes.func.isRequired,
//     bsdm: React.PropTypes.object.isRequired,
//     activeMediaStates: React.PropTypes.object.isRequired,
// };

export default connect(mapStateToProps, mapDispatchToProps)(App);
