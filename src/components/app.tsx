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

  constructor(props: any){
    super(props);
  }

  render() {

    return (
      <MuiThemeProvider>
        <div>
          <RaisedButton label='Convert'/>
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
