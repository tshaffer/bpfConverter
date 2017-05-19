import * as React from "react";

export interface ImageProps {
    height: number;
    width : number;
    duration : number;
    onTimeout : Function;
    resourceIdentifier : string;
}

export default class Image extends React.Component<ImageProps, object> {

    timeout : any;

    constructor(props : ImageProps) {
        super(props);
        this.timeout = null;
    }

    shouldComponentUpdate() {

        if (this.timeout) {
            return false;
        }
        return true;
    }

    render () {

        let self = this;

        if (this.timeout) {
            debugger;
        }

        this.timeout = setTimeout( () => {
                this.timeout = null;
                self.props.onTimeout();
            }
            ,this.props.duration);

        console.log('image.js::render, image src: ' + this.props.resourceIdentifier);

        return (
            <img
                src={this.props.resourceIdentifier}
                width={this.props.width.toString()}
                height={this.props.height.toString()}
            />
        );
    }
}
