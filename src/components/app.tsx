import * as React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import {
    ArState,
} from '../types';


// HACK
export let myApp = {};

class App extends React.Component<any, object> {

    state: object;

    constructor(props: object) {
        super(props);

        myApp = this;
    }

    render() {
      return (
        <div>Pizza</div>
      )
    }
}

function mapStateToProps(state : ArState) {

    return {
        bsdm: state.bsdm,
    };
}

export default connect(mapStateToProps, null)(App);
