import React, {Component, Fragment} from 'react';
import Websocket from 'react-websocket';
import LoginPage from "../pages/LoginPage";

class WsContainer extends Component {
    constructor(props) {
        super(props);
        // this.onMessage = this.onMessage.bind(this);
        // this.onOpen = this.onOpen.bind(this);
        // this.onClose = this.onClose.bind(this);
        // this.send = this.send.bind(this);
        // this.setWebsocket = this.setWebsocket.bind(this);
        // this.host = '';
        this.reconnectIntervalInMilliSeconds = 1000;
        // this.remoteHost = 'ws://lazybird.mynetgear.com:1100/ws';
        this.remoteHost = 'wss://dermaster.io/ws';
        this.localHost = 'ws://localhost:17090/ws';
        this.refWebsocketLocal = null;
        this.refWebsocketRemote = null;
    }

    initializeWebsocket = (service) => {
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        let sendData = {
            category: 'ws',
            service: service,
            access_token: accessToken,
        };
        this.send(JSON.stringify({
            data: sendData
        }));
    };

    sendRemote = (msg) => {
        if (this.refWebsocketRemote) {
            console.log('SWS', 'sendRemote', msg);
            this.refWebsocketRemote.sendMessage(msg);
        }
    };
    onOpenRemote = () => {
        const {onOpenRemoteProps} = this.props;
        console.log('SWS', 'onOpenRemote');
        onOpenRemoteProps();
    };
    onMessageRemote = (e) => {
        const {onMessageRemoteProps} = this.props;
        console.log('WsContainer, onMessageRemote', e);
        onMessageRemoteProps(e);
        // let payload = JSON.parse(e);
        // if (payload.data) {
        //     console.log('SWS', 'onMessageRemote', payload.data);
        //     if (payload.data.service === 'Register') {
        //         WsActions.setClientToken(payload.data.client_token);
        //         this.getSystemInfo();
        //     } else if (payload.data.service === 'SignInMate') {
        //         this.props.logout();
        //         sessionStorage.setItem('access_info', JSON.stringify(payload.data));
        //         this.props.loginOK();
        //     } else if (payload.data.service === 'ReadyToLive') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             live: true,
        //             service: payload.data.service,
        //             opponentClientToken: payload.data.opponent_client_token,
        //             candidate: null,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'UnableToLive') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             live: false,
        //             service: payload.data.service,
        //             opponentClientToken: '',
        //             candidate: null,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'Offer') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             service: payload.data.service,
        //             offer: payload.data.sdp,
        //             liveId: payload.data.live_id,
        //             candidate: null,
        //         });
        //     } else if (payload.data.service === 'Candidate') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             service: payload.data.service,
        //             candidate: payload.data.candidate,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'OnReceiveLiveImage') {
        //
        //         console.log('********OnReceiveLiveImage**********', payload.data.live_id, this.props.ws.liveId)
        //         // if (payload.data.live_id === this.props.ws.liveId ) {
        //             WsActions.setWs({
        //                 ...this.props.ws,
        //                 service: payload.data.service,
        //                 liveId: payload.data.live_id
        //             });
        //         // }
        //
        //     }
        // };
        // WsActions.onMessage(payload);
    };
    onCloseRemote = () => {
        const { onCloseRemoteProps } = this.props;
        console.log('SWS', 'onCloseRemote');
        onCloseRemoteProps();
    };

    sendLocal = (msg) => {
        if (this.refWebsocketLocal) {
            console.log('SWS', 'sendLocal', msg);
            this.refWebsocketLocal.sendMessage(msg);
        }
    };
    onOpenLocal = () => {
        const {onOpenLocalProps} = this.props;
        console.log('SWS', 'onOpenLocal');
        onOpenLocalProps();
        // this.initializeWebsocket('Register');
    };
    onMessageLocal = (e) => {
        const {onMessageLocalProps} = this.props;
        console.log('WsContainer, onMessageLocal', e);
        onMessageLocalProps(e);
        // const {WsActions} = this.props;
        // console.log('WsContainer, onMessageLocal', e);
        // let payload = JSON.parse(e);
        // if (payload.data) {
        //     console.log('SWS', 'onMessageLocal', payload.data);
        //     if (payload.data.service === 'Register') {
        //         WsActions.setClientToken(payload.data.client_token);
        //         this.getSystemInfo();
        //     } else if (payload.data.service === 'SignInMate') {
        //         this.props.logout();
        //         sessionStorage.setItem('access_info', JSON.stringify(payload.data));
        //         this.props.loginOK();
        //     } else if (payload.data.service === 'ReadyToLive') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             live: true,
        //             service: payload.data.service,
        //             opponentClientToken: payload.data.opponent_client_token,
        //             candidate: null,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'UnableToLive') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             live: false,
        //             service: payload.data.service,
        //             opponentClientToken: '',
        //             candidate: null,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'Offer') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             service: payload.data.service,
        //             offer: payload.data.sdp,
        //             liveId: payload.data.live_id,
        //             candidate: null,
        //         });
        //     } else if (payload.data.service === 'Candidate') {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             service: payload.data.service,
        //             candidate: payload.data.candidate,
        //             offer: null
        //         });
        //     } else if (payload.data.service === 'OnReceiveLiveImage') {
        //
        //         console.log('********OnReceiveLiveImage**********', payload.data.live_id, this.props.ws.liveId)
        //         // if (payload.data.live_id === this.props.ws.liveId ) {
        //         WsActions.setWs({
        //             ...this.props.ws,
        //             service: payload.data.service,
        //             liveId: payload.data.live_id
        //         });
        //         // }
        //
        //     }
        // };
        // WsActions.onMessage(payload);
    };
    onCloseLocal = () => {
        const { onCloseLocalProps } = this.props;
        console.log('SWS', 'onCloseLocal');
        onCloseLocalProps();
    };
    // shouldComponentUpdate(nextProps, nextState) {
    //     return !!nextProps.sendMessage;
    // }
    shouldComponentUpdate = (nextProps, nextState) => {
        const {clientToken, localMessage, remoteMessage, reload, clearReloadState, clearLocalMessage, clearRemoteMessage} = nextProps;
        console.log('DEBUG', 'reload', reload);
        if (reload) {
            if (this.refWebsocketRemote) {
                console.log('SWS', 'this.refWebsocketRemote', this.refWebsocketRemote);
                this.refWebsocketRemote.state.ws.close();
            }
            if (this.refWebsocketLocal) {
                console.log('SWS', 'this.refWebsocketLocal', this.refWebsocketLocal);
                this.refWebsocketLocal.state.ws.close();
            }
            clearReloadState();
            return true;
        } else {
            if ( localMessage ) {
                this.sendLocal(JSON.stringify(localMessage));
                clearLocalMessage();
            }
            console.log('remoteMessage', remoteMessage);
            if ( remoteMessage ) {
                this.sendRemote(JSON.stringify(remoteMessage));
                clearRemoteMessage();
            }
            return false;
        }        
    };

    render() {
        const {clientToken, sendMessage} = this.props;
        const {remoteHost, localHost, onOpenRemote, onMessageRemote, onCloseRemote, onOpenLocal, onMessageLocal, onCloseLocal, reconnectIntervalInMilliSeconds} = this;
        console.log('SWS1', 'WsContainer', clientToken, sendMessage);
        // if (reload) {
        //     if (this.refWebsocketRemote) {
        //         console.log('SWS', 'this.refWebsocketRemote', this.refWebsocketRemote);
        //         this.refWebsocketRemote.state.ws.close();
        //         clearReloadState();
        //         this.reconnectIntervalInMilliSeconds = 1;
        //     }
        //     if (this.refWebsocketLocal) {
        //         console.log('SWS', 'this.refWebsocketLocal', this.refWebsocketLocal);
        //         this.refWebsocketLocal.state.ws.close();
        //         clearReloadState();
        //         this.reconnectIntervalInMilliSeconds = 1;
        //     }
        // } else {
        //     if (sendMessage) {
        //         if (sendMessage.service) {
        //             this.sendRemote(JSON.stringify({
        //                 data: sendMessage,
        //             }));
        //         } else {
        //             this.sendLocal(JSON.stringify({
        //                 data: sendMessage,
        //             }));
        //         }
        //     }
        // }
        console.log('SWS', 'WebsocketContainer', remoteHost, localHost);
        return <Fragment>
            <Websocket url={remoteHost}
                       onOpen={onOpenRemote}
                       onMessage={onMessageRemote}
                       onClose={onCloseRemote}
                       reconnectIntervalInMilliSeconds={reconnectIntervalInMilliSeconds}
                       ref={Websocket => {
                           this.refWebsocketRemote = Websocket;
                       }}/>
            <Websocket url={localHost}
                       onOpen={onOpenLocal}
                       onMessage={onMessageLocal}
                       onClose={onCloseLocal}
                       reconnectIntervalInMilliSeconds={reconnectIntervalInMilliSeconds}
                       ref={Websocket => {
                           this.refWebsocketLocal = Websocket;
                       }}/>
        </Fragment>
    }
}

export default WsContainer;