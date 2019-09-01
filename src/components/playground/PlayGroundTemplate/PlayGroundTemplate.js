import React, {Component} from 'react';
import './PlayGroundTemplate.scss';

class PlayGroundTemplate extends Component {
    render() {

        return (
            <div className='playground-template'>
                <div className='playground-top'>{this.props.top}</div>
                {/* {this.props.selectCount && <button className='trash-icon'>trash</button>} */}
                    {/* {this.props.checkedCount ? <div className='trash-icon button'></div> : null} */}
                <div className='body'>
                    {this.props.dateList}
                </div>
                {this.props.trash? <div className='trash'>{this.props.trash}</div>: ''}
                {this.props.viewer}
            </div>
        )
    }
}

export default PlayGroundTemplate;