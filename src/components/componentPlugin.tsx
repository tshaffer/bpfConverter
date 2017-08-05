import * as React from 'react';

interface ComponentPluginProperty {
  name: string;
  value: string;
}

export interface ComponentPluginProps {
  name: string;
  componentPath: string;
  properties: ComponentPluginProperty[];
}

let ImportedComponent: any = null;

export default class ComponentPlugin extends React.Component<ComponentPluginProps, object> {

  constructor(props: ComponentPluginProps) {
    super(props);

    const pluginSource = '/Users/tedshaffer/Documents/Projects/importableComponent/dist/importablecomponent.js';
    ImportedComponent = eval('require')(pluginSource);
  }

  render() {
    // var settings = {
    //   dots: true,
    //   infinite: true,
    //   // speed: 500,
    //   // slidesToShow: 2,
    //   // slidesToScroll: 1,
    //   autoplay : false,
    //   autoplaySpeed : 2000,
    //   fade : true,
    // };
    return (
      <div>
        <ImportedComponent/>
      </div>
    );
  }
}
