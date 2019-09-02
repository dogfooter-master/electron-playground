import React, {Component, Fragment} from 'react';
import CustomLoader from '../../../components/common/CustomLoader';
import './ImageViewer.scss';

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
    }

    state = {
        isOpenedWebRTCLocal: false,
        isOpenedWebRTCRemote: true,
    };

    componentDidMount() {
        this.windowImage = new Image();
        const { startDataChannel } = this;
        startDataChannel();
    }

    startDataChannel = () => {
        this.setupDataChannelPeerConnection(this.stream);
    };

    setupDataChannelPeerConnection = () => {
        const { windowImage, configuration} = this;
        const { changeLocalMessage, user } = this.props;
        const thisComponent = this;
        let windowImageUrl = this.windowImageUrl;
        this.dataChannelConnection = new RTCPeerConnection(configuration);
        this.dataChannelConnection.oniceconnectionstatechange = e => {
            console.log('oniceconnectionstatechange', e);
        };
        this.dataChannelConnection.onicecandidate = function (e) {
            if (e.candidate) {
                changeLocalMessage({
                    service: "Candidate",
                    data: e.candidate,
                });
            }
        };
        this.dataChannelConnection.onnegotiationneeded = e => {
            console.log('onnegotiationneeded', e);
            changeLocalMessage({
                service: "Connect",
                data: "client1"
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
            data: user.access_token,
        });
    };

    onOfferDataChannel = (offer) => {
        const { dataChannelConnection } = this;
        const { changeLocalMessage } = this.props;
        const d = JSON.parse(offer);
        dataChannelConnection.setRemoteDescription(new RTCSessionDescription(d));
        dataChannelConnection.createAnswer(function (answer) {
            console.log('createAnswer', answer);
            dataChannelConnection.setLocalDescription(answer);
            changeLocalMessage({
                service: "Answer",
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
        if ( nextProps.onLocalMessage ) {
            console.log('shouldComponentUpdate', nextProps.onLocalMessage);
            const { onOfferDataChannel, onCandidateDataChannel } = this;
            const message = nextProps.onLocalMessage;
            let s = message.split('\n');
            console.log('DEBUG', s);
            for ( let i = 0; i < s.length; i++ ) {
                let data = JSON.parse(s[i]);
                switch (data.service) {
                    case "Offer":
                        onOfferDataChannel(data.data);
                        break;
                    case "Candidate":
                        onCandidateDataChannel(data.data);
                        break;
                    default:
                        break;
                }
            }
        }
        return true
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
            {isOpen ?
                <div className={'viewer'}>
                    <canvas className = {'webrtc-canvas'} id='webrtc-local-canvas'/>
                </div>
                :
                <CustomLoader />
            }
        </Fragment>;
    }
}
export default ImageViewer;
