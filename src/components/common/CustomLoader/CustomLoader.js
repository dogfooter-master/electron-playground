import React, {Component} from 'react';
import { ScaleLoader } from 'react-spinners';
import './CustomLoader.scss';

class CustomLoader extends Component {

    render() {
        return <div className='loader'>
        <ScaleLoader
            // css={override}
        sizeUnit={"px"}
        size={15}
        color={'#00a5bd'}
        loading={true}
        />
        </div>

    }
}
export default CustomLoader;
