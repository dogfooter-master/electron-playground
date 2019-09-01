import React, {Component, Fragment} from 'react';

import { Waypoint } from "react-waypoint";

class DiseaseTable extends Component {
    // state = {
    //     selectIndex: -1
    // }

    handleClick = (id) => {
        console.log('click disease', id)
        let clickedId = id;
        if (id === this.props.selectedRow.disease.diagnosis_id) 
            clickedId = 0;


        this.props.clickRowId(clickedId)
    }


    render() {
        const { data, getMessages, selectedRow } = this.props;
        const { handleClick } = this;

        const columns = [
            {
                label: 'key',
                key: ['diagnosis_id'],
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
                key: ['type'],
            },
            {
                label: 'Location',
                key: ['location_list'],
            },
        ];

        const ths = columns.map((col, index) => {
            return (
                <th key={'head'+index} className={index === 0? 'nodisp': ''}>{col.label}</th>
            )
        })

        console.log('Disease table', data)
        const trs = data.diagnosis_number? (data.diagnosis_list.map((row, index) => {
            let wayPoint = null;
            if (index == data.diagnosis_list.length - 10) {
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
                        values += row[col.key[i]] + ' ';                                        
                    }
                    
                }
                
                return <td key={row.diagnosis_id + '_'+colIdx} className={colIdx === 0? 'nodisp': ''}>
                        {colIdx === 1 && wayPoint}
                        {values}
                    </td>
            })
        
            return (
                <tr className={row[columns[0].key] === selectedRow.disease.diagnosis_id? 'selected': ''} 
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


export default DiseaseTable;