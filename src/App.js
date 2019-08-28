import React, {Component, Fragment} from 'react';
import MainPage from './components/pages/MainPage';
import LoginPage from './components/pages/LoginPage';

class App extends Component {
  state = {
    isLogin: false,
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
  };
  render () {
    console.log('SWS', 'DEBUG1', 'App');
    const {isLogin} = this.state;
    const {login, logout} = this;

    return (
      <Fragment>
        {isLogin ?
            <MainPage
                login={login}
            /> :
            <LoginPage
                logout={logout}
            />
        }
       </Fragment>
    )
  }
}

export default App;
