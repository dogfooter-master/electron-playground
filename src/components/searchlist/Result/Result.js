import React, {Component} from 'react';
// import { Waypoint } from "react-waypoint";

// import CustomLoader from 'components/common/CustomLoader';
import ResultTable from './ResultTable';
import './Result.scss';

  

class Result extends Component {

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
      // if (prevProps.condition !== this.props.condition) {
      //   // this.getMessages(0);
      // }
    }



    render() {

        // const { searchStatus, 
        //         condition, 
        //         searchKey, 
        //         searchResult, 
        //         clickRow, 
        //         clickRowId, 
        //         selectedRow, 
        //         clickedRow, 
        //         clickTableHeader, 
        //         getMessages
        //       } = this.props;
        // // const { getMessages } = this;

        // const components = {
        //     patient: {
        //       id: 'patient_id',
        //       list: 'patient_list',
        //       columns:  [
        //         {   
        //           label: 'key',
        //           key: ['patient_id'],
        //         },
        //         {   
        //           label: 'ID',
        //           key: ['pid'], 
        //           sort_key: 'pid'
        //         },
        //         {
        //           label: 'Name',
        //           key: ['name'],
        //           sort_key: 'name'
        //         },
        //         {
        //           label: 'Birth Date',
        //           key: ['birth_date'],
        //           sort_key: 'birth_date'
        //         },
        //         {
        //           label: 'Visit Date',
        //           key: ['visit_date'],
        //           sort_key: 'visit_date'
        //         }
        //     ]
        //     },
        //     disease: {
        //       id: 'diagnosis_id',
        //       list: 'diagnosis_list',
        //       columns: [
        //         {
        //           label: 'key',
        //           key: ['diagnosis_id'],
        //         },
        //         {
        //           label: 'Name',
        //           key: {
        //               subkey: 'patient',
        //               list: ['name'],
        //           },
        //           sort_key: 'name',
        //         },
 
        //         {
        //           label: 'Type',
        //           key: ['type'],
        //           sort_key: 'type',
        //         },
        //         {
        //           label: 'Visit Date',
        //           key: ['visit_date'],
        //           sort_key: 'visit_date'
        //         },
        //         {
        //           label: 'Location',
        //           key: ['location_list'],
        //           sort_key: 'location',
        //           default: '',
        //         },
        //       ]
        //     },
        //     date: {
        //       id: 'date_id',
        //       list: 'date_list',
        //       columns: [
        //         {
        //             label: 'key',
        //             key: ['date_id'],
        //         },
        //         {
        //             label: 'Name',
        //             key: {
        //                 subkey: 'patient',
        //                 list: ['name'],
        //             },
        //             sort_key: 'name'
        //         },
        //         // {
        //         //     label: 'Birth Date',
        //         //     key: {
        //         //         subkey: 'patient',
        //         //         list: ['birth_date'],
        //         //     }
        //         // },
        //         {
        //             label: 'Type',
        //             key: {
        //                 subkey: 'diagnosis',
        //                 list: ['type'],
        //             },
        //             sort_key: 'type'
        //         },
        //         {
        //             label: 'Visit Date',
        //             key: ['visit_date'],
        //             sort_key: 'visit_date'
        //         },
        //         {
        //             label: 'Images',
        //             key: ['image_number'],
        //             default: 0,
        //             type: 'number',
        //             sort_key: 'images'
        //         },
        //       ]
        //     }
        // }

        // return <div className='result'>
        //   {
        //     <ResultTable data={searchResult}
        //                     searchStatus={searchStatus} 
        //                     searchKey={searchKey}
        //                     condition={condition}
        //                     id={components[condition].id}
        //                     list={components[condition].list}
        //                     columns={components[condition].columns}
        //                     getMessages={getMessages} 
        //                     clickRow={clickRow} 
        //                     clickRowId={clickRowId} 
        //                     selectedRow={selectedRow}
        //                     clickedRow={clickedRow}
        //                     clickTableHeader={clickTableHeader}
        //                     />  
        //   }
        // </div>
        return <div className='result'>
          {
            <ResultTable />
          }
        </div>
    }
}



// export default withStyles(styles)(Result);
export default Result;