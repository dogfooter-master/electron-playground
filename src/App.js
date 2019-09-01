import React, {Component, Fragment} from 'react';
import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';
import WsContainer from './components/containers/WsContainer';
import Websocket from "react-websocket";

class App extends Component {
  state = {
    isLogin: false,
    reload: true,
  };
  login = () => {
    this.setState({
      isLogin: true,
    });
  };
  logout = () => {
    this.setState({
      isLogin: false,
    });
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        loginStatus: 'Login',
      });
    }
  };
  clearReloadState = () => {
    this.setState({
      reload: false,
    });
  };
  onOpenRemote = () => {
    console.log('onOpenRemote');
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        isConnectedRemote: true,
      });
    }
    this.setState({
      reload: false,
    })
  };
  onMessageRemote = (e) => {
    console.log('onMessageRemote', e);
  };
  onCloseRemote = () => {
    console.log('onCloseRemote');
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        isConnectedRemote: false,
      });
    }
  };
  onOpenLocal = () => {
    console.log('onOpenLocal');
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        isConnectedLocal: true,
      });
    }
    this.setState({
      reload: false,
    })
  };
  onMessageLocal = (e) => {
    console.log('onMessageLocal', e);
  };
  onCloseLocal = () => {
    console.log('onCloseLocal');
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        isConnectedLocal: false,
      });
    }
  };
  render () {
    console.log('SWS', 'DEBUG1', 'App', this.state);
    const {isLogin, reload} = this.state;
    const {login, logout, clearReloadState, onMessageRemote, onOpenRemote, onCloseRemote, onMessageLocal, onOpenLocal, onCloseLocal} = this;

    return (
      <Fragment>
        <WsContainer
            loginOK={login}
            logout={logout}
            reload={reload}
            clearReloadState={clearReloadState}
            onMessageRemoteProps={onMessageRemote}
            onMessageLocalProps={onMessageLocal}
            onOpenRemoteProps={onOpenRemote}
            onOpenLocalProps={onOpenLocal}
            onCloseLocalProps={onCloseLocal}
            onCloseRemoteProps={onCloseRemote}
        />
        {isLogin ?
            <MainPage
                login={login}
            /> :
            <LoginPage
                logout={logout}
                login={login}
                ref={LoginPage => {
                  this.refLoginPage = LoginPage;
                }}
            />
        }
       </Fragment>
    )
  }
}

export default App;
