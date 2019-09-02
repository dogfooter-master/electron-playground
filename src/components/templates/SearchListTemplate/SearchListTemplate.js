// import React, {Component} from 'react';
import React from 'react';

import './SearchListTemplate.scss';

const SearchListTemplate = ({search, result, children}) => {

        return (
            <div className='search-list-template'>
                {search}
                {result}
            </div>
        )
};

export default SearchListTemplate;