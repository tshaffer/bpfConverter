import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  convertBpf,
} from '../controller/importer';

import App from '../components/app';

function mapStateToProps(state : any) {
  return {
    bsdm: state.bsdm,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onConvertBpf: convertBpf,
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

