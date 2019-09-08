import React, {Component, Fragment} from 'react';
import CustomLoader from '../../../components/common/CustomLoader';
import './ImageViewer.scss';

const os = window.require('os');
const grpc = window.require('grpc');
const PROTO_PATH = 'public/protos/pikabu.proto';
console.log('__dirname', __dirname);
const pikabuProto = grpc.load(PROTO_PATH).pb;
const client = new pikabuProto.Peekaboo('127.0.0.1:17091', grpc.credentials.createInsecure());

class ImageViewer extends Component {
    constructor(props) {
        super(props);
        // this.onMessage = this.onMessage.bind(this);
        // this.onOpen = this.onOpen.bind(this);
        // this.onClose = this.onClose.bind(this);
        // this.send = this.send.bind(this);
        // this.setWebsocket = this.setWebsocket.bind(this);
        // this.host = '';
        this.configuration = {
            'iceServers' : [{ 'url' : 'stun:stun.l.google.com:19302'}]
            //'iceServers' : [{ 'url' : 'stun:1.234.23.6:3478'}]
            // 'iceServers': []
        };
        this.windowImage = null;
        this.windowImageUrl = null;
        this.dataChannelConnection = null;
        this.remoteLocalDataChannelConnection = null;
        this.stream = null;
        this.streamConnection = null;
        this.remoteDataChannelConnection = null;
        this.opponentClientToken = '';
        this.clientToken = '';
        this.mouseMoveQueue = [];
    }

    state = {
        isOpenedWebRTCLocal: false,
        isOpenedWebRTCRemote: false,
        isOpenedWebRTCRemoteDc: false,
    };

    componentDidMount() {
        this.windowImage = new Image();
        const { startDataChannel, startRemoteWebRTC } = this;

        this.handleStream();
        startRemoteWebRTC();
        startDataChannel();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.handleStream();
    }

    handleStream = () => {
        const canvas = document.getElementById('webrtc-local-canvas');
        this.stream = canvas.captureStream();
        console.log('stream', this.stream);
    };
    startRemoteWebRTC = () => {
        this.setupPeerConnection();
    };
    setupPeerConnection = () => {
        const { stream, configuration } = this;
        const { changeRemoteMessage, user } = this.props;
        const thisComponent = this;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        this.streamConnection = new RTCPeerConnection(configuration);
        this.streamConnection.addStream(stream);
        this.streamConnection.onaddstream = function(e) {
            console.log('streamConnection', 'onaddstream', e);
        };
        this.streamConnection.onnegotiationneeded = () => {
            thisComponent.setState({
                isOpenedWebRTCRemote: true,
            });
        };
        this.streamConnection.onicecandidate = function(e) {
            if (e.candidate) {
                changeRemoteMessage({
                    data: {
                        category: 'ws',
                        service: 'Candidate',
                        access_token: accessToken,
                        opponent_client_token: thisComponent.opponentClientToken,
                        channel_type: "stream",
                        label: thisComponent.opponentClientToken, 
                        candidate: {
                            type: 'candidate',
                            candidate: e.candidate,
                        },
                    }
                });
            }
        };
        let pcName = os.hostname();
        let payload = {
            data: {
                category: 'ws',
                service: 'Register',
                account: user.email,
                access_token: accessToken,
                client_type: "agent",
                name: pcName,
            }
        };
        changeRemoteMessage(payload);
        console.log('changeRemoteMessage', payload);
    };
    onAnswerStream = (answer) => {
        this.streamConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };
    onAnswerRemoteDataChannel = (answer) => {
        console.log('onAnswerRemoteDataChannel', answer);
        this.remoteDataChannelConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };
    startToLive = () => {
        const {changeRemoteMessage} = this.props;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        let payload = {
            data: {
                category: 'ws',
                service: 'StartToLive',
                access_token: accessToken,
                opponent_client_token: this.opponentClientToken,
            }
        };
        setTimeout(function () {
            changeRemoteMessage(payload);
        }, 1000);
    };
    createAnswerStream = (offer) => {
        const thisComponent = this;
        const { streamConnection } = this;
        const { changeRemoteMessage } = this.props;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        streamConnection.setRemoteDescription(new RTCSessionDescription(offer));
        streamConnection.createAnswer(function (answer) {
            streamConnection.setLocalDescription(answer);

            console.log('thisComponent.opponentClientToken', thisComponent.opponentClientToken);
            let payload = {
                data: {
                    category: 'ws',
                    service: 'Answer',
                    access_token: accessToken,
                    opponent_client_token: thisComponent.opponentClientToken,
                    label: thisComponent.opponentClientToken, 
                    channel_type: "stream",
                    sdp: answer,
                }
            };
            changeRemoteMessage(payload);

        }, function (error) {
            alert("An error has occurred", error);
        });
    }
    createOfferStream = () => {
        const thisComponent = this;
        const { streamConnection } = this;
        const { changeRemoteMessage } = this.props;
        streamConnection.createOffer({
            offerToReceiveAudio: false, offerToReceiveVideo: true,
        }).then(function (offer) {
            const access_info = JSON.parse(sessionStorage.getItem('access_info'));
            let accessToken = '';
            if (access_info) {
                accessToken = access_info.access_token
            }

            console.log('thisComponent.opponentClientToken', thisComponent.opponentClientToken);
            let payload = {
                data: {
                    category: 'ws',
                    service: 'Offer',
                    access_token: accessToken,
                    channel_type: "stream",
                    opponent_client_token: thisComponent.opponentClientToken,
                    label: thisComponent.opponentClientToken, 
                    sdp: offer,
                }
            };
            changeRemoteMessage(payload);
            streamConnection.setLocalDescription(offer);
        }).catch(function (error) {
            console.log('SWS', 'An error has occurred.', error);
        });
    };
    createOfferRemoteLocalDataChannel = () => {
        const { changeLocalMessage } = this.props;   
        const { opponentClientToken } = this;  
        setTimeout(function() {
            changeLocalMessage({
                service: "Connect",
                type: "remote",
                label: opponentClientToken,
            });
        }, 400);
    }
    onOfferRemoteLocalDataChannel = (data) => {
        // const { remoteLocalDataChannelConnection } = this;
        const thisComponent = this;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        const { changeRemoteMessage } = this.props;
        const offer = JSON.parse(data);    
        console.log('SWS1', offer);    
        // console.log('thisComponent.opponentClientToken', thisComponent.opponentClientToken);
        let payload = {
            data: {
                category: 'ws',
                service: 'Offer',
                access_token: accessToken,
                channel_type: "data",
                label: thisComponent.opponentClientToken,
                opponent_client_token: thisComponent.opponentClientToken,
                sdp: offer,
            }
        }; 
        setTimeout(function() {
            changeRemoteMessage(payload);
        }, 400);
    };
    onCandidateLocalToRemoteDataChannel = (candidate) => {
        const thisComponent = this;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        // console.log('onCandidateDataChannel', candidate);
        // this.remoteLocalDataChannelConnection.addIceCandidate(new RTCIceCandidate(candidate));
        const { changeRemoteMessage } = this.props;
        // const candidate = JSON.parse(data);        
        setTimeout(function() {

            let payload = {
                data: {
                    category: 'ws',
                    service: 'Candidate',
                    access_token: accessToken,
                    channel_type: "data",
                    label: thisComponent.opponentClientToken,
                    opponent_client_token: thisComponent.opponentClientToken,        
                    candidate: {        
                        candidate: {
                            candidate: candidate.candidate,
                            sdpMLineIndex: 0,
                            sdpMid: "0",
                        },
                        type: 'candidate',
                    }
                }
            };
            console.log('changeRemoteMessage 1', payload);
        
            changeRemoteMessage(payload);
        }, 400);
    };
    onAnswerRemoteLocalDataChannel = (answer) => {
        const { changeLocalMessage } = this.props;
        const { opponentClientToken } = this;
        console.log('onAnswerRemoteLocalDataChannel', answer);
        setTimeout(function() {
            changeLocalMessage({
                service: "Answer",
                type: "remote",
                label: opponentClientToken,
                data: answer
            });
        }, 400);
    };
    onCandidateRemoteLocalDataChannel = (candidate) => {
        const { changeLocalMessage } = this.props;
        const { opponentClientToken } = this;
        
        console.log('onCandidateRemoteLocalDataChannel', candidate);
        setTimeout(function() {
            changeLocalMessage({
                service: "Candidate",
                type: "remote",
                label: opponentClientToken,
                data: candidate,
            });
        }, 400);
    }

    createOfferRemoteDataChannel = (opponentClientToken) => {

        this.remoteDataChannelConnection = new RTCPeerConnection(this.configuration);
        
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }

        const thisComponent = this;
        const { remoteDataChannelConnection } = this;
        const { changeRemoteMessage } = this.props;
        
        this.remoteDataChannelConnection.oniceconnectionstatechange = e => {
            console.log('remoteDataChannelConnection oniceconnectionstatechange', e);
        };
        this.remoteDataChannelConnection.onicecandidate = function (e) {
            if (e.candidate) {
                changeRemoteMessage({
                    data: {
                        category: 'ws',
                        service: 'Candidate',
                        access_token: accessToken,
                        opponent_client_token: thisComponent.opponentClientToken,
                        label: accessToken,
                        channel_type: 'data',
                        candidate: {
                            type: 'candidate',
                            candidate: e.candidate,
                        },
                    }
                });
            }
        };
        this.remoteDataChannelConnection.onnegotiationneeded = e => {
            console.log('onnegotiationneeded', e);
            // changeLocalMessage({
            //     service: "Connect",
            //     data: accessToken,
            // });
        };
        let dc = this.remoteDataChannelConnection.createDataChannel(
            opponentClientToken, { 
                ordered: true, 
                maxRetransmitTime: 3000,
        });
        
        dc.onclose = () => {
            console.log('remoteDataChannel has closed');
        }
        dc.onopen = () => {
            thisComponent.setState({
                isOpenedWebRTCRemoteDc: true,
            });
            console.log('remoteDataChannel has opened');
        };
        dc.onmessage = e => {
            console.log('remoteDataChannel onmessage', e);
            const data = JSON.parse(e.data);
            const { currentHwnd } = this.props;
            console.log('currentHwnd:', currentHwnd)
            let req = {
                handle: currentHwnd,
                x: parseFloat(data.x),
                y: parseFloat(data.y)
            };
            console.log(req);
            if ( data.command === 'mouse_down' ) {
                client.MouseDown(req, function (err, res) {
                    console.log('MouseDown', res);
                });
            } else if ( data.command === 'mouse_move' ) {
                this.mouseMoveQueue.push(req);
                req = this.mouseMoveQueue.shift();
                client.MouseMove(req, function (err, res) {
                    console.log('MouseMove', res);
                });
            } else if ( data.command === 'mouse_up' ) {
                client.MouseUp(req, function (err, res) {
                    console.log('MouseUp', res);
                });
            }

        }        

        remoteDataChannelConnection.createOffer()
        .then(function (offer) {
            console.log('thisComponent.opponentClientToken', thisComponent.opponentClientToken);
            let payload = {
                data: {
                    category: 'ws',
                    service: 'Offer',
                    access_token: accessToken,
                    channel_type: "data",
                    opponent_client_token: thisComponent.opponentClientToken,
                    label: accessToken,
                    sdp: offer,
                }
            };
            changeRemoteMessage(payload);
            remoteDataChannelConnection.setLocalDescription(offer);
        }).catch(function (error) {
            console.log('SWS', 'An error has occurred.', error);
        });
    };
    onCandidateStream = (candidate) => {
        this.streamConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    onCandidateRemoteDataChannel = (candidate) => {
        console.log('onCandidateRemoteDataChannel', candidate);
        this.remoteDataChannelConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    startDataChannel = () => {
        this.setupDataChannelPeerConnection();
    };
    setupDataChannelPeerConnection = () => {
        const { windowImage, configuration} = this;
        const { changeLocalMessage, user } = this.props;
        const thisComponent = this;
        let windowImageUrl = this.windowImageUrl;
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }

        this.dataChannelConnection = new RTCPeerConnection(configuration);
        this.dataChannelConnection.oniceconnectionstatechange = e => {
            console.log('oniceconnectionstatechange', e);
        };
        this.dataChannelConnection.onicecandidate = function (e) {
            if (e.candidate) {
                changeLocalMessage({
                    service: "Candidate",
                    type: "local",
                    label: accessToken,
                    data: e.candidate,
                });
            }
        };
        this.dataChannelConnection.onnegotiationneeded = e => {
            console.log('onnegotiationneeded', e);
            changeLocalMessage({
                service: "Connect",
                type: "local",
                label: accessToken,
            });
        };
        this.dataChannelConnection.ondatachannel = function (e) {
            console.log('ondatachannel', e);
            let dc = e.channel;
            console.log('New DataChannel ' + dc.label);
            dc.onclose = () => console.log('dc has closed');
            dc.onopen = () => {
                thisComponent.setState({
                    isOpenedWebRTCLocal: true,
                });
                console.log('dc has opened');
            };
            dc.onmessage = e => {
                // console.log(`Message from DataChannel '${dc.label}' payload '${e.data}'`);
                // console.log(e.data);
                // dc.send('Hello, World');
                if (e.data === 'i-s') {
                    this.buffer = new Uint8Array(0)
                } else if (e.data === 'i-e') {
                    // console.log('image buffer', this.buffer);

                    const canvas = document.getElementById('webrtc-local-canvas');
                    let context = canvas.getContext("2d");
                    let blob = new Blob([this.buffer], {'type': 'image/jpeg'});
                    // console.log(windowImageUrl);
                    if (windowImageUrl) URL.revokeObjectURL(windowImageUrl);
                    windowImageUrl = URL.createObjectURL(blob); //possibly `webkitURL` or another vendor prefix for old browsers.
                    //
                    // // console.log(windowImage);
                    windowImage.onload = function (e) {
                        //     // console.log(e);
                        canvas.width = windowImage.width;
                        canvas.height = windowImage.height;
                        //     // console.log('img', img.width, img.height, img, canvas.width, canvas.height);
                        //
                        //     if ( canvas.imageData ) {
                        //         delete canvas.imageData.data;
                        //         delete canvas.imageData;
                        //     }
                        context.drawImage(windowImage, 0, 0, windowImage.width, windowImage.height, 0, 0, canvas.width, canvas.height);
                        //     // let a = document.createElement('a');
                        //     // a.href = url;
                        //     // a.download = "output.png";
                        //     // document.body.appendChild(a);
                        //     // a.click();
                        //     // document.body.removeChild(a);
                        //
                        //     // a.remove();
                        windowImage.src = '';
                    };
                    windowImage.src = windowImageUrl;

                } else {
                    // console.log(e.data);
                    let receiveBuffer = new Uint8Array(e.data);
                    let merged = new Uint8Array(this.buffer.length + receiveBuffer.length);
                    merged.set(this.buffer);
                    merged.set(receiveBuffer, this.buffer.length);
                    this.buffer = merged;
                    // console.log('e image buffer', receiveBuffer, receiveBuffer.length);
                    // console.log('merged image buffer', merged);
                    // console.log('receive image buffer', this.buffer);
                }

            }
        };

        changeLocalMessage({
            service: "Connect",
            type: "local",
            label: user.access_token,
        });
    };

    onOfferDataChannel = (offer) => {
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        const { dataChannelConnection } = this;
        const { changeLocalMessage } = this.props;
        const d = JSON.parse(offer);
        dataChannelConnection.setRemoteDescription(new RTCSessionDescription(d));
        dataChannelConnection.createAnswer(function (answer) {
            console.log('createAnswer', answer);
            dataChannelConnection.setLocalDescription(answer);
            changeLocalMessage({
                service: "Answer",
                type: "local",
                label: accessToken,
                data: answer
            });
        }, function (error) {
            alert("An error has occurred");
        });
    };
    onCandidateDataChannel = (candidate) => {
        console.log('onCandidateDataChannel', candidate);
        this.dataChannelConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }

        if ( nextProps.onLocalMessage ) {
            // console.log('shouldComponentUpdate', 'onLocalMessage', nextProps.onLocalMessage);
            const { onOfferDataChannel, onCandidateDataChannel, onOfferRemoteLocalDataChannel, onCandidateLocalToRemoteDataChannel } = this;
            const message = nextProps.onLocalMessage;
            let s = message.split('\n');
            // console.log('DEBUG', s);
            for ( let i = 0; i < s.length; i++ ) {
                let data = JSON.parse(s[i]);
                console.log('onLocalMessage data', data);
                switch (data.service) {
                    case "Offer":
                        if ( data.type === 'local' ) {
                            onOfferDataChannel(data.data);
                        } else {
                            onOfferRemoteLocalDataChannel(data.data);
                        }
                        break;
                    case "Candidate":
                        console.log('data.type', data.type);
                        if ( data.type === 'local' ) {
                            console.log('data.type 1', data.type);
                            onCandidateDataChannel(data.data);
                        } else {
                            console.log('data.type 2', data.type);
                            onCandidateLocalToRemoteDataChannel(data.data);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        if ( nextProps.onRemoteMessage ) {
            // console.log('shouldComponentUpdate', 'onRemoteMessage', nextProps.onRemoteMessage);
            const { 
                onAnswerStream, 
                onAnswerRemoteDataChannel,
                onCandidateStream, 
                createOfferStream, 
                createAnswerStream, 
                createOfferRemoteDataChannel,
                createOfferRemoteLocalDataChannel,
                onAnswerRemoteLocalDataChannel,
                onCandidateRemoteLocalDataChannel,
                onCandidateRemoteDataChannel } = this;
            const message = nextProps.onRemoteMessage;
            let s = message.split('\n');
            // console.log('shouldComponentUpdate DEBUG', s);
            for ( let i = 0; i < s.length; i++ ) {
                let data = JSON.parse(s[i]);
                console.log('onRemoteMessage data', data);
                switch (data.data.service) {
                    case "Register":
                        this.clientToken = data.data.client_token;
                        break;
                    case "ReadyToLive":
                        // TODO: 누군가가 접속했다는 뜻이다. 나중에 에이전트 목록에 추가하자.
                        // this.opponentClientToken = data.data.opponent_client_token;
                        // startToLive();
                        // return false;
                        break;
                    case "RequestOffer":
                        createOfferStream();
                        break;
                    case "Offer":
                        this.opponentClientToken = data.data.client_token;
                        createAnswerStream(data.data.sdp);
                        // Android <-> Worker
                        createOfferRemoteLocalDataChannel();
                        // Android <-> Electron
                        createOfferRemoteDataChannel(this.opponentClientToken);
                        break;
                    case "Answer":
                        if ( data.data.channel_type === 'data' ) {                        
                            if ( data.data.label === accessToken ) {
                                onAnswerRemoteDataChannel(data.data.sdp);
                            } else {
                                onAnswerRemoteLocalDataChannel(data.data.sdp);
                            }
                        } else {
                            onAnswerStream(data.data.sdp);
                        }
                        break;
                    case "Candidate":
                        if ( data.data.channel_type === 'data' ) {                        
                            if ( data.data.label === accessToken ) {
                                onCandidateRemoteDataChannel(data.data.candidate.candidate);
                            } else {
                                onCandidateRemoteLocalDataChannel(data.data.candidate.candidate);
                            }
                        } else {
                            onCandidateStream(data.data.candidate.candidate);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return true;
    }

    render() {
        // const {clientToken, sendMessage} = this.props;
        // const {remoteHost, localHost, onOpenRemote, onMessageRemote, onCloseRemote, onOpenLocal, onMessageLocal, onCloseLocal, reconnectIntervalInMilliSeconds} = this;
        // console.log('SWS1', 'WsContainer', clientToken, sendMessage);
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
        // console.log('SWS', 'WebsocketContainer', remoteHost, localHost);
        const { isOpenedWebRTCLocal, isOpenedWebRTCRemote } = this.state;
        const isOpen = ( isOpenedWebRTCLocal && isOpenedWebRTCRemote );
        return <Fragment>
                <div className={'viewer'}>
                    <canvas className = {'webrtc-canvas'} id='webrtc-local-canvas'/>
                    {isOpen ? ''
                        : <CustomLoader />
                    }
                </div>
        </Fragment>;
    }
}
export default ImageViewer;
