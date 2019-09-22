import React from 'react';
import SentiBox from '../SentiBox/SentiBox';
import './SentiList.css';
import { Heading } from 'react-bulma-components';
export default props => {
    return (
        <div className="SentiList">
            <Heading>{props.tweets.length} tweets</Heading>
            {props.tweets.map((tweet, index) => (
                <SentiBox key={index} tweet={tweet} />
            ))}
        </div>
    );
};
