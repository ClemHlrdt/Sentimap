import React from 'react';

import { Box } from 'react-bulma-components';
import './SentiPrediction.css';
export default props => (
    <Box className="SentiPrediction">
        {props.result.map((value, index) => (
            <span key={index}>
                {props.emojis[index]} {props.result[index]}%{' '}
            </span>
        ))}
    </Box>
);
