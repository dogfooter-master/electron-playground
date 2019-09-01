import React, {Component, Fragment} from 'react';
import HomeTemplate from '../../components/templates/HomeTemplate';
import HeaderContainer from '../containers/HeaderContainer';
import SearchListContainer from '../containers/SearchListContainer';
import PlayGroundContainer from '../containers/PlayGroundContainer';

const grpc = window.require('grpc');

const PROTO_PATH = 'public/protos/pikabu.proto';
console.log('__dirname', __dirname);
const pikabuProto = grpc.load(PROTO_PATH).pb;
const client = new pikabuProto.Peekaboo('127.0.0.1:17091', grpc.credentials.createInsecure());

class MainPage extends Component {
    
    componentDidMount() {
        let req = {
            keyword: '',
        }
        client.RefreshWindows(req, function(err, res) {
            console.log('RefreshWindows', err, res);
        });
    }

    render() {
        console.log('MainPage:');
        return (
            <HomeTemplate
                header={<HeaderContainer logout={this.props.logout}/>}
                searchList={<SearchListContainer />}
                // header={<HeaderContainer platform={this.state.platform}/>}
                playGround={<PlayGroundContainer/>}
            >
            </HomeTemplate>
        );
    }

}

export default MainPage;