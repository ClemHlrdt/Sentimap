import React, { Component } from 'react';
import _ from 'lodash';
import { Doughnut } from 'react-chartjs-2';

import './SentiStats.css';
export default class SentiStats extends Component {
    state = {
        display: false
    };

    calculateFrequency(tweets) {
        const sentimentList = tweets.map(tweet => tweet.emotion);
        const totalSentiments = _.countBy(sentimentList);

        return [Object.keys(totalSentiments), Object.values(totalSentiments)];
    }
    render() {
        const tweetData = this.calculateFrequency(this.props.tweets);
        const data = {
            labels: tweetData[0],
            datasets: [
                {
                    label: '# of Emotions',
                    data: tweetData[1],
                    backgroundColor: [
                        'rgba(192, 57, 43,0.2)',
                        'rgba(46, 204, 113,0.2)',
                        'rgba(52, 152, 219,0.2)',
                        'rgba(241, 196, 15,0.2)',
                        'rgba(52, 73, 94,0.2)',
                        'rgba(230, 126, 34,0.2)',
                        'rgba(211, 84, 0,0.2)'
                    ],
                    borderColor: [
                        'rgba(192, 57, 43,1.0)',
                        'rgba(46, 204, 113,1.0)',
                        'rgba(52, 152, 219,1.0)',
                        'rgba(241, 196, 15,1.0)',
                        'rgba(52, 73, 94,1.0)',
                        'rgba(230, 126, 34,1.0)',
                        'rgba(211, 84, 0,1.0)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        const options = { maintainAspectRatio: false };
        return (
            <>
                {this.props.tweets.length > 0 ? (
                    <Doughnut data={data} options={options} />
                ) : (
                    ''
                )}
            </>
        );
    }
}
