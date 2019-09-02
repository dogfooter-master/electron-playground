import React, { Component, Fragment } from 'react';
import PlayGroundTemplate from '../../components/playground/PlayGroundTemplate';
import ImageViewer from '../../components/playground/ImageViewer'

class PlayGroundContainer extends Component {

    render() {
        let viewer = <ImageViewer
                        user={this.props.user}
                        changeLocalMessage={this.props.changeLocalMessage}
                        changeRemoteMessage={this.props.changeRemoteMessage}
                        onLocalMessage={this.props.onLocalMessage}
                        onRemoteMessage={this.props.onRemoteMessage}
                    />;

        return (<PlayGroundTemplate
                viewer={viewer}
            />
        )

    }
}

export default PlayGroundContainer;


