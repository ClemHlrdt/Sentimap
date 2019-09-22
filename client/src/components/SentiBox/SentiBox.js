import React from 'react';

import { Box, Media, Image, Content } from 'react-bulma-components';
import * as moment from 'moment';
// import SentiPrediction from '../SentiPrediction/SentiPrediction';
import './SentiBox.css';
export default props => (
    <Box>
        <Media>
            <Media.Item renderAs="figure" position="left">
                <Image size={48} alt="48x48" src={props.tweet.image} />
            </Media.Item>
            <Media.Item>
                <Content>
                    <p>
                        <strong>{props.tweet.name}</strong>{' '}
                        <small>@{props.tweet.username}</small>
                        <small>
                            {' '}
                            {moment(props.tweet.date)
                                .utcOffset('+0200')
                                .fromNow(true)}{' '}
                            ago
                        </small>
                        <br />
                        {props.tweet.text}
                    </p>
                </Content>
                {/* <SentiPrediction
                    result={props.tweet.results}
                    emojis={props.tweet.emojis}
                /> */}
            </Media.Item>
            <Media.Item renderAs="figure" position="right">
                <strong>{props.tweet.emotion}</strong>
            </Media.Item>
        </Media>
    </Box>
);
