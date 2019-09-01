import React, {Component, Fragment} from 'react';
import { Waypoint } from "react-waypoint";



class PatientTable extends Component {
    // state = {
    //     selectIndex: -1
    // }



    handleClick = (id) => {
        let clickedId = id;
        if (id === this.props.selectedRow.patient.patient_id) 
            clickedId = 0;

        this.props.clickRowId(clickedId)
    }

    render() {
        const { data, getMessages, selectedRow } = this.props;
        const { handleClick } = this;

        const columns = [
            {
                label: 'key',
                key: ['patient_id']
            },
            { 
                label: 'ID',
                key: ['pid'], 
            },
            {
                label: 'Name',
                key: ['name'],
            },
            {
                label: 'Birth Date',
                key: ['birth_date'],
            },
            {
                label: 'Visit Date',
                key: ['visit_date'],
            }
        ]
        
        const ths = columns.map((col, index) => {
            return (
                <th key={'head'+index} className={index === 0? 'nodisp': ''}>{col.label}</th>
            )
        })

        const trs = data.patient_number ? 
            (data.patient_list.map((row, index) => {
                let wayPoint = null;
                if (index == data.patient_list.length - 10) {
                    wayPoint = <Waypoint 
                                    onEnter={()=>{getMessages()}} 
                                    // onLeave={()=>{console.log('onleave')}} 
                                    />
                }

                const tds = columns.map((col, colIdx) => {
                    let values = '';
                    for (let i = 0; i < col.key.length; i++) {
                        values += row[col.key[i]] + ' ';                                        
                    }
                    
                    return <td key={row.patient_id + '_'+colIdx} className={colIdx === 0? 'nodisp': ''}>
                            {colIdx === 1 && wayPoint}
                            {values}
                        </td>
                })

                return (
                    <tr className={row[columns[0].key] === selectedRow.patient.patient_id? 'selected': ''} 
                                    key={row[columns[0].key]} 
                                    onClick={() => handleClick(row[columns[0].key])}>
                    
                        {tds}
                    </tr>
                )
            })) 
            : null;


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

export default PatientTable;