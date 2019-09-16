import React, {Component, Fragment} from 'react';
import HomeTemplate from '../../components/templates/HomeTemplate';
import HeaderContainer from '../containers/HeaderContainer';
import SearchListContainer from '../containers/SearchListContainer';
import PlayGroundContainer from '../containers/PlayGroundContainer';
import LoginPage from "./LoginPage";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.refSearchListContainer = null;
    };
    state = {
        currentHwnd: 0,
        windowSize: 50,
    };
    changeCurrentHandle = (hWnd) => {
        this.setState({
            currentHwnd: hWnd,
        });
    };
    onChangeSlider = (event, value) => {
        this.setState({
            windowSize: value,
        })
    }
    render() {
        const { changeCurrentHandle } = this;
        return (
            <Fragment>
                <HomeTemplate
                    header={
                        <HeaderContainer
                            user={this.props.user}
                            logout={this.props.logout}
                            onChangeSlider={this.onChangeSlider}
                        />
                    }
                    searchList={
                        <SearchListContainer
                            changeCurrentHandle={changeCurrentHandle}
                            ref={SearchListContainer => {
                                this.refSearchListContainer = SearchListContainer;
                            }}
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
                            refSearchListContainer={this.refSearchListContainer}
                            windowSize={this.state.windowSize}
                        />
                    }
                >
                </HomeTemplate>
            </Fragment>
        );
    }

}

export default MainPage;