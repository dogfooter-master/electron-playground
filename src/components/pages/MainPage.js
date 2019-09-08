import React, {Component, Fragment} from 'react';
import HomeTemplate from '../../components/templates/HomeTemplate';
import HeaderContainer from '../containers/HeaderContainer';
import SearchListContainer from '../containers/SearchListContainer';
import PlayGroundContainer from '../containers/PlayGroundContainer';

class MainPage extends Component {
    state = {
        currentHwnd: 0,
    }

    changeCurrentHandle = (hWnd) => {
        this.setState({
            currentHwnd: hWnd,
        });
    };
    render() {
        const { changeCurrentHandle } = this;
        return (
            <Fragment>
                <HomeTemplate
                    header={
                        <HeaderContainer
                            user={this.props.user}
                            logout={this.props.logout}
                        />
                    }
                    searchList={
                        <SearchListContainer
                            changeCurrentHandle={changeCurrentHandle}
                        />
                    }
                    // header={<HeaderContainer platform={this.state.platform}/>}
                    playGround={
                        <PlayGroundContainer
                            user={this.props.user}
                            currentHwnd={this.state.currentHwnd}
                            changeLocalMessage={this.props.changeLocalMessage}
                            changeRemoteMessage={this.props.changeRemoteMessage}
                            onLocalMessage={this.props.onLocalMessage}
                            onRemoteMessage={this.props.onRemoteMessage}
                        />
                    }
                >
                </HomeTemplate>
            </Fragment>
        );
    }

}

export default MainPage;