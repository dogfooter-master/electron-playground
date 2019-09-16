import React, {Component, Fragment} from 'react';
import Header from '../../components/headerArea/Header';

class HeaderContainer extends Component {
    render() {
        return <Fragment>
                <Header
                    user={this.props.user}
                    onChangeSlider={this.props.onChangeSlider}
                />
            </Fragment>
    }
}

export default HeaderContainer;