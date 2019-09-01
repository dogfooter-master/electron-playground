import React, {Component} from 'react';
// import InputBase from '@material-ui/core/InputBase';
// import AutosizeInput from 'react-input-autosize';
// import MaterialPickers from 'components/detailInfo/MaterialUI/MaterialPickers';
// import {getToday} from 'util/common.js'
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import './Search.scss';

class Search extends Component {

    state = {
        input: '',
    }
    // state = {
    //     Patient: this.props.searchKey.Patient,
    //     Disease: this.props.searchKey.Disease,

    // }
    // state = {
    //     visitDate: null
    // }

    // inputRef = React.createRef();

    // conditionMapping = {
    //     patient: 'Patient',
    //     disease: 'Disease',
    //     date: 'Date'
    // }
    
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };
    render() {
        // const {searchKey, condition, handleSearch, handleKeyPress, handleCondition, handleChangeDate, removeInput} = this.props;
        // const tabList = [
        //                     {
        //                         label: 'Patient',
        //                         condition: 'patient'
        //                     }, 
        //                     {
        //                         label: 'Disease',
        //                         condition: 'disease',
        //                     },
        //                     {
        //                         label: 'Date',
        //                         condition: 'date',
        //                     }  
        //                 ];
        // const tabs = tabList.map((item, index) => {
        //     let name = 'tabs';

        //     if (item.condition === condition) 
        //         name += ' selected';

        //     return <div key={"tab"+index} className={name}
        //                 onClick={() => {handleCondition(item.condition)}}
        //                 >
        //                 <span>{item.label}</span>
        //             </div>
        // })
        // const today = getToday();

        // // const searchInput = <input className='input' placeholder='Search...' onKeyPress={e=>handleKeyPress(e)}/>;

        // let inputs = [];
        // for (let cond in searchKey) {
        //     if (searchKey[cond].key) {
        //         inputs.push(<div className='input-item' key={'input'+cond}>
        //                         <div className={'input-label ' + cond}></div>
        //                         <div className='input-field-wrapper'>
        //                             <div className={'input-field input-' + cond.toLowerCase()}>
        //                                 {searchKey[cond].key}

        //                             </div>
        //                         {/* <AutosizeInput className={'input-field input-' + cond.toLowerCase()} 
        //                                         disabled
        //                                         // style={{fontSize: '36px'}}
        //                                         name={cond} value={searchKey[cond].key} 
        //                                         // onChange={e =>handleKeyChange(e)} 
        //                                         // onKeyPress={e => handleKeyPress(e)} 
        //                                         /> */}
        //                         </div>
        //                         <div className='input-remover button' onClick={() => removeInput(cond)}>x</div>
        //                     </div>)  
        //     } 
        // }

        // let searchInput;
        // if (!inputs.length) {
        //     searchInput = <div className='input-item default'>
        //                     <div className={'input-label ' + condition}></div>
        //                     {condition === 'date'?
        //                         <div className='input-field-wrapper'>
        //                             <MaterialPickers className='input-field' 
        //                             value={this.props.visitDate}
        //                             name='visitDate' 
        //                             onChange={handleChangeDate('visitDate')} 
        //                             />
        //                         </div>
        //                         :
        //                         <div className='input-field-wrapper'>
        //                             <input ref={this.inputRef} className='input-field' placeholder='Search...' onKeyPress={e=>handleKeyPress(e)}/>
        //                         </div>
        //                     }
        //                 </div>;
        // }
        // else {
        //     searchInput = inputs;
        // }
        const { handleChange } = this;
        const { handleSearch, handleKeyPress } = this.props;
        let searchInput;
        return (
            <div className='search'>
                <div className='search-input' onKeyPress={e=>handleKeyPress(e)}>                    
                    <TextField
                        id="outlined-search"
                        label="검색"
                        type="search-input"
                        margin="normal"
                        variant="outlined"
                        className="input-item"
                        value={this.state.input}
                        name="input"
                        onChange={handleChange}
                    />                  
                    <IconButton
                        color="primary"
                        className={'search-icon'}
                        aria-label="Search"
                        onClick={() => handleSearch(this.state.input)}>
                        <SearchIcon />
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default Search;