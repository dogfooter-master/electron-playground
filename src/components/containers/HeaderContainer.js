import React, {Component, Fragment} from 'react';
import Header from '../../components/headerArea/Header';

class HeaderContainer extends Component {
    render() {
        console.log('SWS', 'DEBUG4', 'HeaderContainer');
        return <Fragment>
                <Header/>
            </Fragment>
    }
}

export default HeaderContainer;