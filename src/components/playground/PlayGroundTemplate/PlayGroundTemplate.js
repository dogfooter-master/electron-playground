import React, {Fragment, Component} from 'react';
import './PlayGroundTemplate.scss';

class PlayGroundTemplate extends Component {
    render() {

        return (
            <Fragment>
                <div className='playground-template'>
                    {this.props.viewer}
                </div>
            </Fragment>

        )
    }
}

export default PlayGroundTemplate;