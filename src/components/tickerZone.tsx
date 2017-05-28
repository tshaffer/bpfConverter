import * as React from 'react';

import DesktopPlatformService from '../platform/desktop/DesktopPlatformService';

import { tickerZoneProps } from '../containers/tickerZoneContainer';

export default class TickerZone extends React.Component<tickerZoneProps, object> {

  bsTicker : any;

  constructor(props : tickerZoneProps) {
    super(props);

    this.bsTicker = null;
  }

  componentDidMount() {

    if (DesktopPlatformService.isTickerSupported()) {

      const { left, top, width, height } = this.props;

      // $FlowBrightSignExternalObject
      this.bsTicker = new BSTicker(left, top, width, height, 0);
      this.bsTicker.SetPixelsPerSecond(400);
    }
  }

  shouldComponentUpdate(nextProps : tickerZoneProps) {

    const currentArticles = this.props.articles;
    const nextArticles = nextProps.articles;
    if (currentArticles.length !== nextArticles.length) {
      console.log('article count changed');
      return true;
    }

    for (let i = 0; i < currentArticles.length; i++) {
      const currentArticle = currentArticles[i];
      const nextArticle = nextArticles[i];
      if (currentArticle !== nextArticle) {
        console.log('article content changed');
        return true;
      }
    }

    return false;
  }

  render() {

    console.log('TickerZone:: RENDER INVOKED');

    if (this.bsTicker) {

      // this pattern avoids flow error
      const bsTicker : any = this.bsTicker;

      // const rssStringCount = bsTicker.GetStringCount(); Bug 27743
      const rssStringCount = 100;
      bsTicker.PopStrings(rssStringCount);

      this.props.articles.forEach( (article : string) => {
        bsTicker.AddString(article);
      });
    }

    return (
        <div>tickerHere</div>
    );
  }
}
