import React, {Component, Fragment} from 'react';
import CustomLoader from '../../components/common/CustomLoader';
import LoginTemplate from '../../components/templates/LoginTemplate'
import { fade, withStyles, makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ReturnIcon from '@material-ui/icons/KeyboardBackspace';
import TextField from '@material-ui/core/TextField';

const { desktopCapturer } = window.require('electron');


// const grpc = window.require('grpc');
// const PROTO_PATH = 'public/protos/signaling.proto';
// console.log('__dirname', __dirname);
// const testProto = grpc.load(PROTO_PATH).pb;
// const client = new testProto.Signaling('127.0.0.1:17092', grpc.credentials.createInsecure());


let configuration = {
    'iceServers' : [{ 'url' : 'stun:stun.l.google.com:19302'}]
    //'iceServers' : [{ 'url' : 'stun:1.234.23.6:3478'}]
    // 'iceServers': []
};

class LoginPage extends Component {
    constructor() {
        super();
        this.remoteConnection = null;
        this.localConnection = null;
        this.connectedUser = 'electron';
        this.yourConnection = null;
        this.dataChannelConnection = null;
        this.sendChannel = null;
        this.theirVideo = null;
        this.stream = null;
        this.server = null;
        this.buffer = '';
        this.windowImage = null;
        this.windowImageUrl = null;
    }
    state = {
        loginStatus: '',
        email: 'lazysupport@dermaster.io',
        password: 'Hotice1234!',
        password_confirm: '',
        name: '',
        isConnectedLocal: false,
        isConnectedRemote: false,
        isRequested: false,
    };

    componentWillMount() {
        this.windowImage = new Image();
    }

    componentDidMount() {
        /*
        const {onLogin, onOffer, onAnswer, onCandidate, onLeave, onConnected, onOfferDataChannel, onCandidateDataChannel } = this;
        this.connection = new WebSocket('ws://localhost:7070');
        this.connection.onopen = function () {
            console.log('websocket connected');
        };
        this.connection.onmessage = function (message) {
            console.log('Got message', message.data);
            let data = JSON.parse(message.data);
            switch (data.type) {
                case 'login':
                    onLogin(data.success);
                    break;
                case "offer":
                    onOffer(data.offer, data.username);
                    break;
                case "answer":
                    onAnswer(data.answer);
                    break;
                case "candidate":
                    onCandidate(data.candidate);
                    break;
                case "leave":
                    onLeave();
                    break;
                default:
                    break;
            }
        };
        this.connection.onerror = function (e) {
            console.log('Got error', e);
        };


        this.localConnection = new WebSocket('ws://localhost:17090/ws');
        this.localConnection.onopen = function () {
            onConnected();
        };
        this.localConnection.onmessage = function (message) {
            console.log('localConnection Got message', message.data);
            let s = message.data.split('\n');
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
        };
        this.localConnection.onerror = function (e) {
            console.log('Got error', e);
        };
         */
    }

    send = (message) => {
        if (this.connectedUser) {
            message.username = this.connectedUser;
        }
        if (this.connection.readyState === 1) {
            this.connection.send(JSON.stringify(message));
        } else {
            this.connection = new WebSocket('wss://localhost:7070');
        }
    };

    sendToLocalConnection = (message) => {
        if (this.localConnection.readyState === 1) {
            this.localConnection.send(JSON.stringify(message));
        } else {
            this.localConnection = new WebSocket('wss://localhost:17090/ws');
        }
    };
    
    onLogin = (success) => {
        const { startConnection } = this;
        if (success === false) {
            alert('Login unsuccessful, please try a different name.');
        } else {
            startConnection();
        }
    };
    onConnected = () => {
        const { startDataChannel } = this;
        startDataChannel();
    };

    onOffer = (offer, name) => {
        const {send, connectedUser } = this;
        this.connectedUser = name;
        this.yourConnection.setRemoteDescription(new RTCSessionDescription(offer));
        this.yourConnection.createAnswer(function (answer) {
            this.yourConnection.setLocalDescription(answer);
            send({
                type: "answer",
                username: connectedUser,
                answer: answer
            });
        }, function (error) {
            alert("An error has occurred");
        });
    };
    onOfferDataChannel = (offer) => {
        const {sendToLocalConnection, dataChannelConnection} = this;
        const d = JSON.parse(offer);
        dataChannelConnection.setRemoteDescription(new RTCSessionDescription(d));
        dataChannelConnection.createAnswer(function (answer) {
            console.log('createAnswer', answer);
            dataChannelConnection.setLocalDescription(answer);
            sendToLocalConnection({
                service: "Answer",
                data: answer
            });
        }, function (error) {
            alert("An error has occurred");
        });
    };
    onAnswer= (answer) => {
        this.yourConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    onCandidate = (candidate) => {
        this.yourConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    onCandidateDataChannel = (candidate) => {
        this.dataChannelConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };
    onLeave = () => {
        this.connectedUser = null;
        this.yourConnection.close();
        this.yourConnection.onicecandidate = null;
        this.yourConnection.onaddstream = null;
        this.setupPeerConnection(this.stream);
    };

    setupPeerConnection = (stream) => {
        const { send } = this;
        this.yourConnection = new RTCPeerConnection(configuration);

        console.log('stream - 1', 'setupPeerConnection', stream);
        this.yourConnection.addStream(stream);
        this.yourConnection.onaddstream = function(e) {
            this.theirVideo.srcObject = e.stream;
        };

        this.yourConnection.onicecandidate = function(e) {
            if (e.candidate) {
                send({
                    type: "candidate",
                    candidate: e.candidate,
                });
            }
        };
    };
    setupDataChannelPeerConnection = () => {
        const { sendToLocalConnection, windowImage } = this;
        let windowImageUrl = this.windowImageUrl;
        this.dataChannelConnection = new RTCPeerConnection(configuration);
        console.log('Created data peer connection object');
        this.dataChannelConnection.oniceconnectionstatechange = e => {
            console.log('oniceconnectionstatechange', e);
        };
        this.dataChannelConnection.onicecandidate = function(e) {
            if (e.candidate) {
                sendToLocalConnection({
                    service: "Candidate",
                    data: e.candidate,
                });
            }
        };
        this.dataChannelConnection.onnegotiationneeded = e => {
            console.log('onnegotiationneeded', e);
            sendToLocalConnection({
                service: "Connect",
                data: "client1"
            });
        };
        this.dataChannelConnection.ondatachannel = function(e) {
            console.log('ondatachannel', e);
            let dc = e.channel;
            console.log('New DataChannel ' + dc.label);
            dc.onclose = () => console.log('dc has closed');
            dc.onopen = () => console.log('dc has opened');
            dc.onmessage = e => {
                // console.log(`Message from DataChannel '${dc.label}' payload '${e.data}'`);
                // console.log(e.data);
                // dc.send('Hello, World');
                if ( e.data === 'i-s') {
                    this.buffer = new Uint8Array(0)
                } else if ( e.data === 'i-e' ) {
                    // console.log('image buffer', this.buffer);

                    const canvas = document.getElementById('temp_canvas');
                    let context = canvas.getContext("2d");
                    let blob = new Blob([this.buffer], {'type': 'image/jpeg'});
                    // console.log(windowImageUrl);
                    if ( windowImageUrl ) URL.revokeObjectURL(windowImageUrl);
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

        sendToLocalConnection({
            service: "Connect",
            data: "client1"
        });
        /*
        this.sendChannel = this.dataChannelConnection.createDataChannel('sendToLocalConnection');
        console.log('Created send data channel');
        const { sendChannel } = this;
        this.sendChannel.onopen = function(e) {
          console.log('sendChannel onopen', e);
          sendChannel.send('Hello, World');
          console.log('sendChannel send sendChannel');
        };
        this.sendChannel.onclose = function(e) {
            console.log('sendChannel onclose', e);
        };
        this.sendChannel.onmessage = e => console.log(`Message from DataChannel '${this.sendChannel.label}' payload '${e.data}'`);
        */
        // Begin the offer
        // dataChannelConnection.createOffer({
        //     offerToReceiveAudio: false, offerToReceiveVideo: true
        // }).then(function (offer) {
        //     send({
        //         service: "Connect",
        //     });
        //     dataChannelConnection.setLocalDescription(offer);
        // }).catch(function (error) {
        //     alert("An error has occurred.", error);
        // });
    };
    startPeerConnection = (user) => {
        const { send } = this;
        const { yourConnection } = this;
        this.connectedUser = user;
        const { connectedUser } = this;
        // Begin the offer
        this.yourConnection.createOffer({
            offerToReceiveAudio: false, offerToReceiveVideo: true
        }).then(function (offer) {
            send({
                type: "offer",
                username: connectedUser,
                offer: offer
            });
            yourConnection.setLocalDescription(offer);
        }).catch(function (error) {
            alert("An error has occurred.", error);
        });
    };

    setupPeerConnection2 = () => {
        this.yourConnection = new RTCPeerConnection(configuration);
        const { send, yourConnection, theirVideo } = this;
        yourConnection.onaddstream = function(e) {
            console.log('DEBUGXXXX:', e.stream)
            theirVideo.srcObject = e.stream;
        };

        yourConnection.onicecandidate = function(e) {
            if (e.candidate) {
                send({
                    type: "candidate",
                    candidate: e.candidate,
                });
            }
        };
    };

    startDataChannel = () => {
        this.setupDataChannelPeerConnection(this.stream);
    };

    startConnection = () => {
        const { yourVideo, setupPeerConnection, setupPeerConnection2 } = this;
        let enableVideo;
        let video = document.querySelector('video');
        // enableVideo = {
        //     deviceId: video ? { exact: video.value } : undefined
        // };

        setupPeerConnection(this.stream);
        // navigator.mediaDevices.getUserMedia({
        //     video: enableVideo,
        //     audio: false,
        // }).then(function(myStream) {
        //     // this.stream = myStream;
        //     // yourVideo.srcObject = myStream;
        //     setupPeerConnection(this.stream);
        // }).catch(function (err) {
        //     setupPeerConnection2();
        //     console.log(err);
        // });
        //console.log('enableVideo', enableVideo);
    };

    handleCreateAccount = (e, status) => {
        e.preventDefault();

        let nextStatus = null, send_data = null;

        switch (status) {
            case 'SignUp':
                send_data = {
                    category: 'public',
                    service: 'SignUp',
                    account: this.state.email,
                }
                nextStatus = 'VerifyCertificationCode';
                break;
            case 'VerifyCertificationCode':
                send_data = {
                    category: 'public',
                    service: 'VerifyCertificationCode',
                    account: this.state.email,
                    code: this.state.accessCode,
                }
                // nextStatus = 'SignUpPassword';
                break;
            case 'SignUpPassword':
                send_data = {
                    category: 'public',
                    service: 'SignUpPassword',
                    account: this.state.email,
                    password: this.state.password,
                }
                nextStatus = 'SignUpComplete';
                break;
            case 'SignUpComplete':
                let access_token = sessionStorage.getItem('access_token');
                send_data = {
                    category: 'private',
                    service: 'SignUpComplete',
                    access_token: access_token,
                    name: this.state.name,
                }
                nextStatus = 'connected';
                break;
            case 'SignIn':
                send_data = {
                    category: 'public',
                    service: 'SignIn',
                    account: this.state.email,
                    password: this.state.password,
                }
                // nextStatus = 'connected';
                break;
            case 'SignInSlave':
                send_data = {
                    category: 'slave',
                    service: 'SignInSlave',
                    account: this.state.email,
                    password: this.state.password,
                }
                // nextStatus = 'connected';
                break;

            default:
                console.log('handleCreateAccount status error: ', status);
                return;
        }

        fetch('/api/', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                "data": send_data
            })
        })
            .then(res => res.json())
            .then(json => {

                console.log('service OK', send_data.service, json)
                if (json.err) {
                    if (json.err === 'verifying') {
                        this.setState({
                            loginStatus: 'VerifyCertificationCode'
                        })
                    }


                } else {

                    if (status === 'SignUpPassword') {
                        sessionStorage.setItem('access_info', JSON.stringify(json.data));
                    } else if (status === 'SignIn') {

                        sessionStorage.setItem('access_info', JSON.stringify(json.data));
                        this.props.login();
                        return;
                    }

                    // json.data.platform
                    this.setState({
                        loginStatus: nextStatus
                    })
                }

            })
            .catch(err => console.log(err));


    };

    validateAccessToken = () => {
        const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        let accessToken = '';
        if (access_info) {
            accessToken = access_info.access_token
        }
        let send_data = null;
        send_data = {
            category: 'private',
            service: 'GetUserInformation',
            access_token: accessToken,
        };
        console.log(send_data);
        fetch('/api/', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                "data": send_data
            })
        }).then(
            res => res.json()
        ).then(
        json => {
            console.log('service OK', send_data.service, json);
            if (json.err) {
                console.log('err', json.err);
                this.setState({
                    loginStatus: 'Login',
                })
            } else {
                // json.data.platform
                this.setState({
                    loginStatus: 'LoginCompleted',
                })
            }
        }).catch(
            err => console.log(err)
        );
    };

    handleFormEvent = (e, status) => {
        e.preventDefault();
        const {loginStatus} = this.state;
        // this.setState({
        //     loginStatus: status,
        // });

        const nextStatus = status;
        let send_data = null;

        if ( loginStatus === 'SignUp' ) {
            send_data = {
                category: 'public',
                service: 'SignUp',
                account: this.state.email,
            };
        } else if ( loginStatus === 'SignUpPassword' ) {
            send_data = {
                category: 'public',
                service: 'SignUp',
                account: this.state.email,
            };
        } else {

        }

        this.setState({
            isRequested: true,
        });
        fetch('/api/', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                "data": send_data
            })
        })
            .then(res => res.json())
            .then(json => {

                console.log('service OK 1', send_data.service, json);
                let start = new Date().getTime();
                while (new Date().getTime() < start + 3000);
                console.log('service OK 2', send_data.service, json);

                this.setState({
                    isRequested: false,
                });
                if (json.err) {
                    if (json.err === 'verifying') {
                        this.setState({
                            loginStatus: 'VerifyCertificationCode'
                        })
                    }
                } else {
                    if (status === 'SignUpPassword') {
                        sessionStorage.setItem('access_info', JSON.stringify(json.data));
                    } else if (status === 'SignIn') {
                        sessionStorage.setItem('access_info', JSON.stringify(json.data));
                        this.props.login();
                        return;
                    }

                    console.log('service OK 3', send_data.service, json);
                    // json.data.platform
                    this.setState({
                        loginStatus: nextStatus
                    })
                }

            })
            .catch(err => console.log(err));
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    handleStream = (stream) => {
        // const video = document.querySelector('video');
        // video.srcObject = stream;
        this.stream = stream;
        console.log('stream', this.stream);
        // video.onloadedmetadata = (e) => video.play()
    };

    handleError = (e) => {
        console.log(e)
    };

    render() {
        const canvasStyle = {
            display: 'block',
        };
        const classes = makeStyles(theme => ({
            container: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            textField: {
                marginLeft: theme.spacing(1),
                marginRight: theme.spacing(1),
            },
            dense: {
                marginTop: theme.spacing(2),
            },
            menu: {
                width: 200,
            },
            button: {
                margin: theme.spacing(1),
                height: theme.spacing(1),
            },
            input: {
                display: 'none',
            },
        }));
        const { loginStatus, isConnectedLocal, isConnectedRemote } = this.state;
        const {handleCreateAccount, handleFormEvent, handleChange, handleStream, handleError, validateAccessToken} = this;
        let inputArea = null;

        console.log('SWS', 'loginStatus', loginStatus);
            switch (loginStatus) {
                case 'create':
                    inputArea = <Fragment>
                        <form onSubmit={(e) => handleCreateAccount(e, 'SignUp')}>
                            <input name='email' value={this.state.email} onChange={handleChange} required
                                   placeholder='Email' autoComplete='off'/>
                            <input className='button' type='submit' value='NEXT'/>
                        </form>
                    </Fragment>;
                    break;
                case 'VerifyCertificationCode':
                    inputArea = <Fragment>
                        <form onSubmit={(e) => handleCreateAccount(e, 'VerifyCertificationCode')}>
                            <input name='access_code' value='' onChange={handleChange} required
                                   placeholder='Access Code' autoComplete='off'/>
                            <input className='button' type='submit' value='NEXT'/>
                        </form>
                    </Fragment>;
                    break;
                case 'SignUpPassword':
                    inputArea = <form onSubmit={(e) => handleCreateAccount(e, 'SignUpPassword')}>
                        <input type='password' name='password' value={this.state.password} onChange={handleChange}
                               required placeholder='Password' autoComplete='off'/>
                        <input type='password' name='password_confirm' value={this.state.password_confirm}
                               onChange={handleChange} required placeholder='Confirm Password' autoComplete='off'/>
                        <input className='button' type='submit' value='NEXT'/>
                    </form>;
                    break;
                case 'SignUpComplete':
                    inputArea = <form onSubmit={(e) => handleCreateAccount(e, 'SignUpComplete')}>
                        <input name='name' value={this.state.name} onChange={handleChange} required
                               placeholder='Full Name' autoComplete='off'/>
                        <input className='button' type='submit' value='CONFIRM'/>
                    </form>;
                    break;
                case 'find':

                    // const title = 'MOMO-1';
                    // const lpszWindow = Buffer.from(title, 'ucs2');
                    // const hWnd = user32.FindWindowExW(null, null, null, lpszWindow);
                    //
                    // if ( hWnd && !hWnd.isNull() ) {
                    //     console.log(ref.address(hWnd));
                    // }

                    inputArea = <Fragment>
                        <Button
                            variant="contained"
                            className='create-account-button'
                            onClick={() => this.setState({loginStatus: 'find'})}>
                            find
                        </Button>
                    </Fragment>;
                    break;
                case 'capture':
                    desktopCapturer.getSources({types: ['window']}).then(async sources => {
                        for (const source of sources) {
                            console.log(source);
                            // if (source.name === 'MOMO-1') {
                            try {
                                const stream = await navigator.mediaDevices.getUserMedia({
                                    audio: false,
                                    video: {
                                        mandatory: {
                                            chromeMediaSource: 'desktop',
                                            // chromeMediaSourceId: source.id,
                                            chromeMediaSourceId: 'window:133518:0',
                                        }
                                    }
                                })
                                handleStream(stream);
                            } catch (e) {
                                handleError(e)
                            }
                            return
                            // }
                        }
                    });
                    inputArea = <Fragment>
                        <video/>
                        <Button
                            variant="contained"
                            className='create-account-button'
                            onClick={() => this.setState({loginStatus: 'Login'})}>
                            Login
                        </Button>
                    </Fragment>;
                    break;
                case 'canvas':
                    const canvas = document.querySelector('canvas');
                    const stream = canvas.captureStream();
                    handleStream(stream);
                    // setInterval(function () {
                    //     const imgNo = ( Math.floor(Math.random() * 10) % 2 + 1 );
                    //     let context = canvas.getContext("2d");
                    //     let img = new Image();
                    //     img.onload = function () {
                    //         context.drawImage(img, 0, 0);
                    //     };
                    //     img.src = "img/" + imgNo + ".png";
                    // }, 60);
                    inputArea = <Fragment>
                        <video/>
                        <canvas style={canvasStyle} id='temp_canvas'/>
                        <Button
                            variant="contained"
                            className='create-account-button'
                            onClick={() => this.setState({loginStatus: 'Login'})}>
                            Login
                        </Button>
                    </Fragment>;
                    break;
                // case 'Login':
                //     this.send({
                //         type: 'login',
                //         username: this.connectedUser,
                //     });
                //     inputArea = <Fragment>
                //         <video/>
                //         <canvas style={canvasStyle} id='temp_canvas'/>
                //         <Button
                //             variant="contained"
                //             className='create-account-button'
                //             onClick={() => this.setState({loginStatus: 'Connect'})}>
                //             Connect
                //         </Button>
                //     </Fragment>;
                //     break;
                case 'Connect':
                    this.startPeerConnection('admin');
                    inputArea = <Fragment>
                        <video/>
                        <canvas style={canvasStyle} id='temp_canvas'/>
                        <Button
                            variant="contained"
                            className='create-account-button'
                            onClick={() => this.setState({loginStatus: 'Connect'})}>
                            Connect
                        </Button>
                    </Fragment>;
                    break;
                case 'SignInPassword':
                    inputArea = <Fragment>
                        <form onSubmit={(e) => handleFormEvent(e, 'SignIn')}>
                            <TextField
                                key="outlined-password-input"
                                id="outlined-password-input"
                                className='signin-input'
                                label="Password"
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                margin="normal"
                                variant="outlined"
                                value={this.state.password}
                                onChange={handleChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className='signin-button'
                                // className={classes.button}
                                onClick={() => this.setState({loginStatus: 'Validate'})}>
                                로그인
                            </Button>
                            <IconButton
                                color="primary"
                                className={'back-button'}
                                aria-label="Back"
                                onClick={() => this.setState({loginStatus: 'SignIn'})}>
                                <ReturnIcon />
                            </IconButton>
                        </form>
                    </Fragment>;

                    // inputArea = <form onSubmit={(e) => handleCreateAccount(e, 'SignIn')}>
                    //     <input name='email' value={this.state.email} onChange={handleChange} required
                    //            placeholder='Email' autoComplete='off'/>
                    //     <input type='password' name='password' value={this.state.password} onChange={handleChange}
                    //            required placeholder='Password' autoComplete='off'/>
                    //     <input className='button' type='submit' value='CONNECT'/>
                    // </form>;
                    break;
                case 'SignIn':
                    inputArea = <Fragment>
                        <form onSubmit={(e) => handleFormEvent(e, 'SignInPassword')}>
                            <TextField
                                key="outlined-email-input"
                                id="outlined-email-input"
                                className='signin-input'
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                                variant="outlined"
                                value={this.state.email}
                                onChange={handleChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className='signin-button'
                                // className={classes.button}
                                onClick={() => this.setState({loginStatus: 'SignInPassword'})}>
                                다음
                            </Button>
                            <IconButton
                                color="primary"
                                className={'back-button'}
                                aria-label="Back"
                                onClick={() => this.setState({loginStatus: 'Login'})}>
                                <ReturnIcon />
                            </IconButton>
                        </form>
                    </Fragment>;
                    break;
                case 'SignUp':
                    inputArea = <Fragment>
                        {this.state.isRequested ?
                            <div className={'loading'}>
                                <CustomLoader/>
                            </div> : ''
                        }
                        <form onSubmit={(e) => handleFormEvent(e, 'SignUpPassword')}>
                            <TextField
                                key="outlined-email-input"
                                id="outlined-email-input"
                                className='signin-input'
                                label="Email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                margin="normal"
                                variant="outlined"
                                value={this.state.email}
                                onChange={handleChange}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                className='signin-button'
                                // className={classes.button}
                                onClick={(e) => handleFormEvent(e, 'SignUpPassword')}>
                                다음
                            </Button>
                            <IconButton
                                color="primary"
                                className={'back-button'}
                                aria-label="Back"
                                onClick={() => this.setState({loginStatus: 'Login'})}>
                                <ReturnIcon />
                            </IconButton>
                        </form>
                    </Fragment>;
                    break;
                case 'Login':
                    // TODO: Access Token 검사
                    inputArea = <Fragment>
                        <div className='init-button-padding'/>
                        <Button
                            variant="contained"
                            color="primary"
                            className='signin-button'
                            // className={classes.button}
                            onClick={() => this.setState({loginStatus: 'SignIn'})}>
                            로그인
                        </Button>
                        <div className="button-padding"/>
                        <Button
                            variant="contained"
                            color="primary"
                            className='signin-button'
                            // className={classes.button}
                            onClick={() => this.setState({loginStatus: 'SignUp'})}>
                            회원가입
                        </Button>
                    </Fragment>;
                    break;
                default:
                    if ( isConnectedRemote && isConnectedLocal ) {
                        validateAccessToken()
                    }
                    inputArea = <Fragment>
                        <CustomLoader/>
                    </Fragment>;

                    break;
            }
        return <LoginTemplate inputArea={inputArea}>
        </LoginTemplate>
    }
}

export default LoginPage;