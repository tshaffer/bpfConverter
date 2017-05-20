import { connect } from 'react-redux';

import Image from '../components/image';
import { ImageProps } from '../components/image';

function mapStateToProps (_ : any, ownProps : ImageProps ) {
    return {
        ...ownProps,
    };
}

const ImageContainer = connect(
    mapStateToProps,
)(Image);

export default ImageContainer;
