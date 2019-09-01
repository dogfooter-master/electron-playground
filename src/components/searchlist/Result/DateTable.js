import React, {Component, Fragment} from 'react';

import { Waypoint } from "react-waypoint";

class DateTable extends Component {
    state = {
        selectIndex: -1
    }

    handleClick = (id) => {
        console.log('click date', id)
        let clickedId = id;
        if (id === this.props.selectedRow.date.date_id) 
            clickedId = 0;


        this.props.clickRowId(clickedId)
    }


    // handleClick = (index) => {
    //     let newIndex = index;
    //     if (index === this.state.selectIndex) 
    //         newIndex = -1;

    //     this.setState({
    //         selectIndex: newIndex
    //     })

    //     this.props.clickRow(newIndex)
    // }

    render() {
        const { data, getMessages, selectedRow } = this.props;
        const { handleClick } = this;

        const columns = [
            {
                label: 'key',
                key: ['date_id'],
            },
            {
                label: 'Name',
                key: {
                    subkey: 'patient',
                    list: ['name'],
                }
            },
            {
                label: 'Birth Date',
                key: {
                    subkey: 'patient',
                    list: ['birth_date'],
                }
            },
            {
                label: 'Diagnosis',
                key: {
                    subkey: 'diagnosis',
                    list: ['type'],
                }
            },
            {
                label: 'Visit Date',
                key: ['visit_date'],
            },
            // {
            //     label: 'images',
            //     key: ['image_number'],
            //     default: 0,
            //     type: 'number',
            // },
        ];

        const ths = columns.map((col, index) => {
            return (
                <th key={'head'+index} className={index === 0? 'nodisp': ''}>{col.label}</th>
            )
        })

        const trs = data.date_number? (data.date_list.map((row, index) => {
            let wayPoint = null;
            if (index == data.date_list.length - 10) {
                wayPoint = <Waypoint 
                                onEnter={()=>{getMessages()}} 
                                // onLeave={()=>{console.log('onleave')}} 
                                />
            }
        
            const tds = columns.map((col, colIdx) => {
                let values = '';
                if (col.key.subkey) {
                                        
                    for (let i = 0; i < col.key.list.length; i++) {
                        values += row[col.key.subkey][col.key.list[i]] + ' ';                                        
                    }
                    
                }
                else {
                    
                    for (let i = 0; i < col.key.length; i++) {
                        let value = row[col.key[i]];
                        values += (value || col.default) + ' ';                                        
                    }
                    
                }

                let numberStyle = {};
                if (col.type === 'number') {
                    numberStyle = { textAlign: 'right'};
                }
                
                return <td key={row.date_id + '_'+colIdx} className={colIdx === 0? 'nodisp': ''} style={numberStyle}>
                        {colIdx === 1 && wayPoint}
                        {values}
                    </td>
            })
        
            return (
                <tr className={row[columns[0].key] === selectedRow.date.date_id? 'selected': ''} 
                                key={row[columns[0].key]} 
                                onClick={() => handleClick(row[columns[0].key])}>
                  
                    {tds}
                </tr>
            )
        })) : null;

        

        return (
            // <Paper >
                <table>
                    <thead>
                        <tr>
                            {ths}
                        </tr>
                    </thead>
                    <tbody>
                        {trs}                       
                    </tbody>
                </table>
         // {/* </Paper> */}
        )
    } 
}


export default DateTable;