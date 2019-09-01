import React, {Component, Fragment} from 'react';
import CustomLoader from '../../../components/common/CustomLoader';
// import {getToday, strncmp} from 'util/common.js'
import { Waypoint } from "react-waypoint";

class ResultTable extends Component {

    handleClick = (e, clickedId) => {
        // const { condition, id, selectedRow } = this.props;
        // const classList = e.currentTarget.classList;

        // let newId = clickedId;
        // if (clickedId === selectedRow[condition][id] && !classList.contains('selected')) 
        //     newId = 0;

        // this.props.clickRowId(newId)
    }

    handleSort = (e, sort_key) => {
        // const classList = e.currentTarget.classList;

        // let order_by;
        // let order = sort_key;
        // if (classList.contains('sorting_asc')) {
        //     //to desc
        //     order_by = 'desc';
        // }
        // else if (classList.contains('sorting_desc')) {
        //     //to both
        //     order_by = null;
        //     order = '';
        // }
        // else {
        //     //to asc
        //     order_by = 'asc';
        // }

        // this.props.clickTableHeader(order, order_by);
    }

    render() {
        // const { searchStatus, 
        //         data, 
        //         condition, 
        //         id, 
        //         list, 
        //         columns, 
        //         getMessages, 
        //         selectedRow, 
        //         clickedRow, 
        //         searchKey } = this.props;
        // const { handleClick } = this;

        // const { order, order_by } = searchKey[condition];
        // const today = getToday();

        // const ths = columns.map((col, index) => {

        //     let headerClass = col.label.toLowerCase();
        //         headerClass += (index === 0? ' nodisp': '');
        //         headerClass += (index > 0 && col.sort_key === order? ' sorting_' + order_by: ' sorting_both')
        //     return (
        //         <th key={'head'+index} 
        //             className={headerClass} 
        //             onClick={(e) => this.handleSort(e, col.sort_key)}>
        //             {col.label}
        //             <span className="sort-icon"></span>
        //         </th>
        //     )
        // })

        // const trs = data[list]? (data[list].map((row, index) => {
        //     let wayPoint = null;
        //     if (index === data[list].length - 10) {
        //         wayPoint = <Waypoint 
        //                         onEnter={()=>{getMessages()}} 
        //                         // onLeave={()=>{console.log('onleave')}} 
        //                         />
        //     }
        
        //     const tds = columns.map((col, colIdx) => {
        //         let values = '';
        //         let colDefault = col.default? col.default: '';

        //         if (col.key.subkey) {
                                        
        //             for (let i = 0; i < col.key.list.length; i++) {
        //                 values += row[col.key.subkey][col.key.list[i]] + ' ';                                        
        //             }
                    
        //         }
        //         else {
                    
        //             for (let i = 0; i < col.key.length; i++) {
        //                 let value = row[col.key[i]];
        //                 values += (value || colDefault) + ' ';                                        
        //             }
                    
        //         }

        //         let numberStyle = {};
        //         if (col.type === 'number') {
        //             numberStyle = { textAlign: 'right'};
        //         }
                
        //         let ellipse = '';
        //         if (col.label === 'ID' || col.label === 'Type' || col.label === 'Location')
        //             ellipse = ' ellipse ';
                
        //         let date = '';
        //         if (col.label === 'Visit Date' && !strncmp(values,today,10))
        //             date = ' date ';

        //         return <td key={row[id] + '_' + colIdx} className={(colIdx === 0? 'nodisp': '')  + ellipse + date} style={numberStyle}>
        //                 {colIdx === 1 && wayPoint}
        //                 {values}
        //                 {ellipse? <div className='after'>{values}</div>: ''}
        //                 {date? <div className='date-decorator'></div>: '' }
        //             </td>
        //     })

        //     let selectedId = 0, clickedId = 0;
        //     if (clickedRow[condition][id]) 
        //         clickedId = clickedRow[condition][id];
        //     else if (selectedRow[condition][id])
        //         selectedId = selectedRow[condition][id];

        //     let tempCls = '';
        //     let rowKey = row[columns[0].key];
        //     if (rowKey === clickedId)
        //         tempCls = 'clicked';
        //     else if (rowKey === selectedId)
        //         tempCls = 'selected';
        
        //     return (
        //         <tr className={tempCls} 
        //                         key={rowKey} 
        //                         onClick={(e) => handleClick(e, rowKey)}>
                  
        //             {tds}
        //         </tr>
        //     )
        // })) : null;

        let condition = '';
        let searchStatus = true;
        

        return (
            <Fragment>
                <table className={'result-'+condition}>
                    {/* <thead>
                        <tr>
                            {ths}
                        </tr>
                    </thead>
                    <tbody>                
                        {trs}                        
                    </tbody> */}
                </table>
                {searchStatus && <CustomLoader/>}            
                {/* {<CustomLoader/>}             */}
            </Fragment>
        )
    } 
}


export default ResultTable;