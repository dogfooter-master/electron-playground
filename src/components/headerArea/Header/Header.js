import React, {Component, Fragment} from 'react';
// import clsx from 'clsx';
// import Button from '@material-ui/core/Button';
// import PersonAdd from '@material-ui/icons/PersonAdd';
// import ScatterPlot from '@material-ui/icons/ScatterPlot';
// import { makeStyles } from '@material-ui/core/styles';
// import Popup from "reactjs-popup";
 

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
    render() {       
        return (
            <Fragment>
                <div className='logo'></div>
            </Fragment>
        )
    }
}


export default Header;