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

  componentDidMount() {
    const plugInSource = this.props.componentPath;
    ImportedComponent = eval('require')(plugInSource);
  }

  render() {
    if (!ImportedComponent) {
      return null;
    }

    return (
      <div>
        <ImportedComponent/>
      </div>
    );
  }
}
