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

    let foo : any = this.props.properties.map((property) => {
      let propertyObj: any = {};
      propertyObj[property.property] = property.value;
      return (
        propertyObj
      );
    });

    const flibbet : any = this.props.properties.map( (property) => {
      let propertyObj : any = {};
      propertyObj[property.property] = property.value;
      return (
        propertyObj
      );
    });

    console.log(flibbet);

    let componentPluginProperties: any = {};
    this.props.properties.forEach((property) => {
      let propertyObj: any = {};
      propertyObj[property.property] = property.value;
      componentPluginProperties[property.property] = property.value;
    });

    return (
      <ImportedComponent {...componentPluginProperties}/>
    )

    // return (<div>
    //   {
    //     this.props.properties.map((property) => {
    //       let propertyObj: any = {};
    //       propertyObj[property.property] = property.value;
    //       return (
    //         propertyObj
    //       );
    //     })
    //   }
    // </div>);

    //
  //
  //   // label1={'myLabel1'}
  //   // label2={'myLabel2'}
  //
  //   let componentPluginProperties : any[] = [];
  //   this.props.properties.forEach( (property) => {
  //
  //     let propertyObj : any = {};
  //     propertyObj[property.property] = property.value;
  //
  //     componentPluginProperties.push(
  //       propertyObj
  //     );
  //   });
  //
  //   const flibbet : any = this.props.properties.map( (property) => {
  //     let propertyObj : any = {};
  //     propertyObj[property.property] = property.value;
  //     return (
  //       propertyObj
  //     );
  //   });
  //
  //
  //   return (
  //     <div>
  //       <ImportedComponent
  //         {
  //           this.props.properties.map( (property) => {
  //
  //           });
  //         }
  //         {...componentPluginProperties}
  //       />
  //     </div>
  //   );
  }
}
