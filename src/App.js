import React, {Component, Fragment} from 'react';
import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';
import WsContainer from './components/containers/WsContainer';
import Websocket from "react-websocket";

class App extends Component {
  state = {
    isLogin: false,
    reload: true,
    localMessage: '',
    remoteMessage: '',
    onRemoteMessage: null,
    onLocalMessage: null,
    user: {},
  };
  login = (user) => {
    if ( user ) {
      this.setState({
        isLogin: true,
        user: user,
      });
    } else {
      this.setState({
        isLogin: true,
      });}
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
    this.setState({
      onRemoteMessage: e,
    });
    this.setState({
      onRemoteMessage: null,
    });
  };
  onCloseRemote = () => {
    console.log('onCloseRemote');
    if ( this.refLoginPage ) {
      this.refLoginPage.setState({
        isConnectedRemote: false,
      });
    }
    this.setState({
      reload: true,
      isLogin: false,
    })
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
    this.setState({
      onLocalMessage: e,
    });
    this.setState({
      onLocalMessage: null,
    });
  };
  changeLocalMessage = (msg) => {
    console.log('changeLocalMessage', msg);
    this.setState({
      localMessage: msg,
    })
  };
  changeRemoteMessage = (msg) => {
    console.log('changeRemoteMessage', msg);
    this.setState({
      remoteMessage: msg,
    })
  };
  clearLocalMessage = () => {
    this.setState({
      localMessage: null,
    });
  };
  clearRemoteMessage = () => {
    this.setState({
      remoteMessage: null,
    });
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
    // console.log('SWS', 'DEBUG1', 'App', this.state);
    const {isLogin, reload, localMessage, remoteMessage, onLocalMessage, onRemoteMessage } = this.state;
    const {login, logout, clearReloadState, onMessageRemote, onOpenRemote, onCloseRemote, onMessageLocal, onOpenLocal, onCloseLocal, changeLocalMessage, changeRemoteMessage, clearLocalMessage, clearRemoteMessage } = this;


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
            localMessage={localMessage}
            remoteMessage={remoteMessage}
            clearLocalMessage={clearLocalMessage}
            clearRemoteMessage={clearRemoteMessage}
        />
        {isLogin ?
            <MainPage
                logout={logout}
                user={this.state.user}
                changeLocalMessage={changeLocalMessage}
                changeRemoteMessage={changeRemoteMessage}
                onLocalMessage={onLocalMessage}
                onRemoteMessage={onRemoteMessage}
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
