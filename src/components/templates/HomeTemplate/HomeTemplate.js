import React, {Component} from 'react';
import './HomeTemplate.scss';

class HomeTemplate extends Component {
    render() {

        return (
            <div className='home-template'>
                <div className='main-header'>{this.props.header}</div>
                <div className='main-body'>
                    <div className='left'>{this.props.searchList}</div>
                    <div className='center'>{this.props.playGround}</div>
                </div>
            </div>
        )
    }
}

export default HomeTemplate;