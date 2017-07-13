import * as React from 'react';
import Slider from 'react-slick';

import path = require('path');

import {
  BsAssetItem,
} from '@brightsign/bscore';


export interface SlickProps {
  height: number;
  width: number;
  contentItems: BsAssetItem[];
  filePaths: string [];
}

export default class Slick extends React.Component<SlickProps, object> {

  constructor(props: SlickProps) {
    super(props);
  }

  getSources() {
    return this.props.filePaths.map( (filePath : string, index : number) => {
      return (
        <div key={index}><img src={filePath} key={index}/></div>
        );
    });
  }

  render() {
    var settings = {
      dots: true,
      infinite: true,
      // speed: 500,
      // slidesToShow: 2,
      // slidesToScroll: 1,
      autoplay : false,
      autoplaySpeed : 2000,
      fade : true,
    };
    return (
      <div className='slickContainer'>
        <Slider {...settings}>
          {this.getSources()}
        </Slider>
      </div>
    );
  }
}
