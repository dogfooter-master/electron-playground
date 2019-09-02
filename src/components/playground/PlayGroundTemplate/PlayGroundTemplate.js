import React, {Component} from 'react';
import './PlayGroundTemplate.scss';

class PlayGroundTemplate extends Component {
    render() {

        return (
            <div className='playground-template'>
                {this.props.viewer}
            </div>
        )
    }
}

export default PlayGroundTemplate;