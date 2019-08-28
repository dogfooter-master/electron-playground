import React, {Component} from 'react';
import './LoginTemplate.scss';

class LoginTemplate extends Component {
    render() {
        return (
            <div className='login-template'>
                <div className='login-wrapper'>
                    <div className='input-area'>
                        {this.props.inputArea}
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginTemplate;