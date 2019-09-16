import React, {Component, Fragment} from 'react';
import Menu from '../../../components/common/Menu';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import './Header.scss';

// const useStyles = makeStyles(theme => ({
//     button: {
//       margin: theme.spacing(1),
//     },
//     leftIcon: {
//       marginRight: theme.spacing(1),
//     },
//     rightIcon: {
//       marginLeft: theme.spacing(1),
//     },
//     iconSmall: {
//       fontSize: 20,
//     },
//   }));


class Header extends Component {
    state = {
        pcName: '',
    };
    componentDidMount() {
        this.setState({
            pcName: this.props.user.pc,
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    render() {
        function ValueLabelComponent(props) {
            const { children, open, value } = props;

            const popperRef = React.useRef(null);
            React.useEffect(() => {
                if (popperRef.current) {
                    popperRef.current.update();
                }
            });

            return (
                <Tooltip
                    PopperProps={{
                        popperRef,
                    }}
                    open={open}
                    enterTouchDelay={0}
                    placement="top"
                    title={value}
                >
                    {children}
                </Tooltip>
            );
        }

        ValueLabelComponent.propTypes = {
            children: PropTypes.element.isRequired,
            open: PropTypes.bool.isRequired,
            value: PropTypes.number.isRequired,
        };
        const { onChangeSlider } = this.props;

        return (
            <Fragment>
                <div className='logo' />

                <TextField
                    id="filled-user-name"
                    label="아이디"
                    className={'user-name'}
                    value={this.props.user.nickname}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="filled-pc-name"
                    label="PC"
                    className={'pc-name'}
                    value={this.state.pcName}
                    onChange={this.handleChange}
                    margin="normal"
                    name="pcName"
                    variant="outlined"
                />
                    <Slider
                        className={'window-size-slider'}
                        ValueLabelComponent={ValueLabelComponent}
                        aria-label="custom thumb label"
                        defaultValue={50}
                        onChange={onChangeSlider}
                    />
                <Menu className='setting' />
            </Fragment>
        )
    }
}


export default Header;