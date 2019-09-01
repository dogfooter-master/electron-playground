import React, {Component} from 'react';
import SearchListTemplate from '../../components/templates/SearchListTemplate';
import Search from '../../components/searchlist/Search';
import Result from '../../components/searchlist/Result';

class SearchListContainer extends Component {

    // state = {
    //     visitDate: null
    // }

    handleSearch = (value) => {
        console.log('handleSearch', value);

        // const { SearchActions, condition} = this.props;

        // if (condition === 'date') {
        //     value = this.state.visitDate
        // }

        // const payload = {
        //     condition,
        //     value
        // }

        // SearchActions.clearSelectedRow();
        // SearchActions.setSearchKey(payload);
    }

     handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const { value } = e.target;
            console.log('Enter', value);
            this.handleSearch(value);
        }
    }

    handleChangeDate = (name) => (date) => {

        // const value = getFormatDate(date, '/');
        // this.setState({
        //     visitDate: value
        // })
    }


    handleKeyChange = (e) => {
        // console.log('handleKeyChange', e.target.name, e.target.value)
        
        // const { SearchActions } = this.props;

        // const payload = {
        //     condition: e.target.name,
        //     value: e.target.value
        // }

        // SearchActions.setSearchKey(payload);

    }
    handleCondition = (condition) => {
        // const { SearchActions } = this.props;

        // SearchActions.setSearchCondition(condition);
    }

    removeInput = (condition) => {
        // const { SearchActions } = this.props;

        // const payload = {
        //     condition: condition,
        //     value: ''
        // }

        // this.setState({
        //     visitDate: null
        // })

        // SearchActions.clearSelectedRow();
        // SearchActions.setSearchKey(payload);
    } 


    clickRowId = (id) => {
        // const { SearchActions, PlaygroundActions, condition, searchResult } = this.props;
        // let selectedData = {};

        // const conditions = {
        //     patient: {
        //         list: 'patient_list',
        //         key: 'patient_id',
        //         action: ['clickPatient', 'selectPatient'],
        //     },
        //     disease: {
        //         list: 'diagnosis_list',
        //         key: 'diagnosis_id',
        //         action: ['clickDisease', 'selectDisease'],
        //     },
        //     date: {
        //         list: 'date_list',
        //         key: 'date_id',
        //         action: ['clickDate', 'selectDate'],
        //     },
        // };

        // const ref = conditions[condition];

        // if (id) {

        //     const list = searchResult[ref.list];

        //     const index = list.findIndex(function(item, i) {
        //         return item[ref.key] === id
        //     });

        //     selectedData = list[index];
        // }

        // SearchActions[ref.action[0]](selectedData);
        // SearchActions[ref.action[1]](selectedData);

        // PlaygroundActions.setSelectedImage(fromJS({}));
        
    }

    clickTableHeader = (order, order_by) => {
        // const { condition, SearchActions } = this.props;

        // const payload = {
        //     condition,
        //     order,
        //     order_by
        // }

        // SearchActions.setSearchOrder(payload);
    }

    getMessages = () => {
        console.log('GET MESSAGES IN MAINLIST CONTAINER');


      //     const THIRTYROWS = 60;
  
      //     console.log('getMessages', this, num)
  
      //     // if (this.state.filteredMessages) {
      //         const { filteredMessages } = this.state;
      //         const messages = this.buildTestData(THIRTYROWS, filteredMessages.length);
      //         this.setState({
      //           filteredMessages: [...filteredMessages, ...messages]
      //         });
      //     // }
      //     // else {
      //         // const messages = this.buildTestData(THIRTYROWS, 0);
      //         // this.setState({
      //         //   filteredMessages: messages
      //         // });
      //     // }
        }


    componentWillMount() {
        // const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        // const { SearchActions, condition, searchKey  } = this.props;

        // let order = searchKey[condition].order;
        // let order_by = searchKey[condition].order_by;

        // SearchActions.getMainList(access_info.access_token, 
        //     condition, 
        //     order,
        //     order_by,
        //     null, 
        //     null,
        //     null,
        //     null,
        //     null,
        //     );
    
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevProps.condition !== this.props.condition || 
        //     prevProps.searchKey.patient.key !== this.props.searchKey.patient.key || 
        //     prevProps.searchKey.disease.key !== this.props.searchKey.disease.key || 
        //     prevProps.searchKey.date.key !== this.props.searchKey.date.key ||
        //     prevProps.searchKey.patient.order !== this.props.searchKey.patient.order || 
        //     prevProps.searchKey.disease.order !== this.props.searchKey.disease.order || 
        //     prevProps.searchKey.date.order !== this.props.searchKey.date.order ||
        //     prevProps.searchKey.patient.order_by !== this.props.searchKey.patient.order_by || 
        //     prevProps.searchKey.disease.order_by !== this.props.searchKey.disease.order_by || 
        //     prevProps.searchKey.date.order_by !== this.props.searchKey.date.order_by 
        //     ) {
        //     const access_info = JSON.parse(sessionStorage.getItem('access_info'));
        //     const { SearchActions, clickedRow, searchKey, condition } = this.props;
            
        //     let patient_id = clickedRow.patient.patient_id;
        //     let diagnosis_id = clickedRow.disease.diagnosis_id;
        //     let clicked_patient = null, clicked_disease = null;

        //     if (condition === 'date') {
        //         clicked_patient = patient_id? { patient_id } : null;
        //         clicked_disease = diagnosis_id? { diagnosis_id } : null;

        //     }
        //     else if (condition === 'disease') {
        //         clicked_patient = patient_id? { patient_id } : null;
        //     }


        //     let patient_keyword_list = null;
        //     let disease_keyword_list = null;
        //     let date_keyword_list = null;

        //     if (searchKey.patient && searchKey.patient.key )
        //         patient_keyword_list = [ searchKey.patient.key ];

        //     if (searchKey.disease && searchKey.disease.key)
        //         disease_keyword_list = [ searchKey.disease.key ];

        //     if (searchKey.date && searchKey.date.key)
        //         date_keyword_list = [ searchKey.date.key ];

            
        //     let order = searchKey[condition].order;
        //     let order_by = searchKey[condition].order_by;


        //     SearchActions.getMainList(access_info.access_token, 
        //                                 condition,
        //                                 order,
        //                                 order_by, 
        //                                 clicked_patient, 
        //                                 clicked_disease, 
        //                                 patient_keyword_list, 
        //                                 disease_keyword_list, 
        //                                 date_keyword_list,
        //                                 );

        // }

    }

    render() {
        const { handleSearch, handleKeyPress } = this;
        return (
            <SearchListTemplate 
                search={<Search 
                            handleSearch={handleSearch}                            
                            handleKeyPress={handleKeyPress}
                            />}
                result={<Result />}
            />
        )

        // const { searchStatus, 
        //         searchKey, 
        //         condition, 
        //         searchResult, 
        //         selectedRow, 
        //         clickedRow,
        //     } = this.props;
        // const { handleSearch, 
        //         clickTableHeader, 
        //         handleKeyPress, 
        //         handleKeyChange, 
        //         handleCondition, 
        //         handleChangeDate, 
        //         removeInput, 
        //         clickRow, 
        //         clickRowId,
        //         getMessages
            
        //     } = this;

        // return (
        //     <MainListTemplate 
        //         search={<Search handleSearch={handleSearch}
        //                         handleKeyPress={handleKeyPress}
        //                         handleKeyChange={handleKeyChange}
        //                         handleCondition={handleCondition}
        //                         handleChangeDate={handleChangeDate}
        //                         removeInput={removeInput}
        //                         searchKey={searchKey} 
        //                         visitDate={this.state.visitDate}
        //                         condition={condition}/>} 
        //         result={<Result searchResult={searchResult} 
        //                         searchStatus={searchStatus}
        //                         searchKey={searchKey} 
        //                         condition={condition}
        //                         clickRow={clickRow}
        //                         clickRowId={clickRowId}
        //                         selectedRow={selectedRow}
        //                         clickedRow={clickedRow}
        //                         clickTableHeader={clickTableHeader}
        //                         getMessages={getMessages}
        //                         />}
        //     />
        // )

    }
}

export default SearchListContainer;