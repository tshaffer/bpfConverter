import * as React from 'react';

import {
  DmHtmlComponentProperty
} from '@brightsign/bsdatamodel';

export interface ComponentPluginProps {
  name: string;
  componentPath: string;
  properties: DmHtmlComponentProperty[];
}

let ImportedComponent: any = null;

export default class ComponentPlugin extends React.Component<ComponentPluginProps, object> {

  // componentDidMount() {
  //   const plugInSource = this.props.componentPath;
  //   ImportedComponent = eval('require')(plugInSource);
  // }

  render() {

    if (!ImportedComponent) {
      const plugInSource = this.props.componentPath;
      ImportedComponent = eval('require')(plugInSource);
    }

    return (
      <div>
        <ImportedComponent
          label1={'myLabel1'}
          label2={'myLabel2'}
        />
      </div>
    );
  }
}
