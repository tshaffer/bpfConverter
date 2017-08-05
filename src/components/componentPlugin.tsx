import * as React from 'react';

import {
  DmHtmlComponentProperty
} from '@brightsign/bsdatamodel';

export interface ComponentPluginProps {
  name: string;
  componentPath: string;
  properties: DmHtmlComponentProperty[];
  duration: number;
  onTimeout: () => void;
}

let ImportedComponent: any = null;

export default class ComponentPlugin extends React.Component<ComponentPluginProps, object> {

  // componentDidMount() {
  //   const plugInSource = this.props.componentPath;
  //   ImportedComponent = eval('require')(plugInSource);
  // }

  private timeout: any;

  constructor(props: ComponentPluginProps) {
    super(props);
    this.timeout = null;
  }

  shouldComponentUpdate() {

    if (this.timeout) {
      return false;
    }

    return true;
  }

  render() {

    const self: ComponentPlugin = this;

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

    // react-trend example
    componentPluginProperties['data'] = [0, 10, 5, 22, 3.6, 11];

    if (this.timeout) {
      debugger;
    }

    this.timeout = setTimeout( () => {
        this.timeout = null;
        self.props.onTimeout();
      }
      , this.props.duration);

    return (
      <ImportedComponent {...componentPluginProperties}/>
    )
  }
}
