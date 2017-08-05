import { connect } from 'react-redux';

import path = require('path');

import {
  ArState,
} from '../types';

import ComponentPlugin from '../components/componentPlugin';
import { ComponentPluginProps } from '../components/componentPlugin';

function mapStateToProps(state : ArState, ownProps : ComponentPluginProps) : ComponentPluginProps {
  return {
    ...ownProps,
  };
}

const ComponentPluginContainer = connect(
  mapStateToProps,
)(ComponentPlugin);

export default ComponentPluginContainer;
