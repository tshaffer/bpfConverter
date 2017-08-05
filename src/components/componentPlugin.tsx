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
      if (ImportedComponent.default) {
        ImportedComponent = ImportedComponent.default;
      }
    }

    let componentPluginProperties: any = {};
    this.props.properties.forEach((property) => {
      let propertyObj: any = {};
      propertyObj[property.property] = property.value;
      componentPluginProperties[property.property] = property.value;
    });

    componentPluginProperties = {
      data: [0, 10, 5, 22, 3.6, 11],
    }

    return (
      <ImportedComponent {...componentPluginProperties}/>
    )
  }
}
