import * as React from 'react';

// import { dialog } from 'electron';
const {dialog} = require('electron').remote

import MuiThemeable from 'material-ui/styles/muiThemeable';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

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
  }
}

export default MuiThemeable()(App);
