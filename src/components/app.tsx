import { isNil } from 'lodash';

import * as React from 'react';

import * as fs from 'fs-extra';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

class App extends React.Component<any, object> {

  state: any;

  constructor(props: any){
    super(props);

    this.state = {
      bpfPath: '',
    };

    this.convertButtonClicked = this.convertButtonClicked.bind(this);
  }

  convertButtonClicked() {
    console.log('convert: ', this.state.bpfPath);
  }

  handleChange = (event: any) => {
    this.setState({
      bpfPath: event.target.value,
    });
  }

  render() {

    const textEntryStyle = {
        width: '600px',
        marginLeft: '8px',
        marginRight: '8px',
    };

    return (
      <MuiThemeProvider>
        <div>
          bpf path:
          <TextField
            id='bpfPath'
            style={textEntryStyle}
            value={this.state.bpfPath}
            onChange={this.handleChange}
          />

          <RaisedButton label='Convert'onClick={this.convertButtonClicked}/>
        </div>
      </MuiThemeProvider>
    );
    // return (
    //   <div>Pizza</div>
    // )
  }
}

function mapStateToProps(state : any) {
  return {
    bsdm: state.bsdm,
  };
}

// const mapDispatchToProps = (dispatch: Dispatch<any>) => {
//   return bindActionCreators({
//     addPackage,
//     setPackageVersionSelector,
//     setSelectedBranchName,
//     setSelectedTagIndex,
//     setSpecifiedCommitHash,
//   }, dispatch);
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(mapStateToProps)(App);
