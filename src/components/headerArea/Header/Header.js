import React, {Component, Fragment} from 'react';
import Menu from '../../../components/common/Menu';
import TextField from '@material-ui/core/TextField';

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
                <Menu className='setting' />
            </Fragment>
        )
    }
}


export default Header;