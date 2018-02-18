import { isNil } from 'lodash';

import * as React from 'react';

import * as fs from 'fs-extra';

// import { dialog } from 'electron';
const {dialog} = require('electron').remote

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';

import {
  convertBpf,
} from '../controller/importer';

class App extends React.Component<any, object> {

  state: any;

  constructor(props: any){
    super(props);

    this.state = {
      bpfPath: '',
    };

    this.convertButtonClicked = this.convertButtonClicked.bind(this);
    this.browseButtonClicked = this.browseButtonClicked.bind(this);
  }

  browseButtonClicked() {
    dialog.showOpenDialog({
      title: 'Select presentation to convert',
      filters: [
        {name: 'Presentations', extensions: ['bpf']},
      ],
      message: 'Message',
      properties: ['openFile']
    }, ( (selectedPaths: string[]) => {
      this.setState({ bpfPath: selectedPaths[0] });
    }));
  }

  convertButtonClicked() {
    console.log('convert: ', this.state.bpfPath);
    this.props.onConvertBpf(this.state.bpfPath);
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
          <div>
            bpf path:
            <TextField
              id='bpfPath'
              style={textEntryStyle}
              value={this.state.bpfPath}
              onChange={this.handleChange}
            />

            <RaisedButton label='Browse'onClick={this.browseButtonClicked}/>
          </div>
          <div>
            <RaisedButton label='Convert'onClick={this.convertButtonClicked}/>
          </div>
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    onConvertBpf: convertBpf,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
// export default connect(mapStateToProps)(App);
