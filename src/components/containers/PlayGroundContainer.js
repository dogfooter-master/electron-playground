import React, { Component, Fragment } from 'react';
import PlayGroundTemplate from '../../components/playground/PlayGroundTemplate';
import ImageViewer from '../../components/playground/ImageViewer'

class PlayGroundContainer extends Component {

    render() {
        let viewer = <ImageViewer
                        user={this.props.user}
                        currentHwnd={this.props.currentHwnd}
                        changeLocalMessage={this.props.changeLocalMessage}
                        changeRemoteMessage={this.props.changeRemoteMessage}
                        onLocalMessage={this.props.onLocalMessage}
                        onRemoteMessage={this.props.onRemoteMessage}
                        refSearchListContainer={this.props.refSearchListContainer}
                        windowSize={this.props.windowSize}
                    />;

        return (<PlayGroundTemplate
                viewer={viewer}
            />
        )

    }
}

export default PlayGroundContainer;


