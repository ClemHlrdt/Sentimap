import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import { predict } from './tools/predict';
import { getTweets } from './tools/API';
import * as tf from '@tensorflow/tfjs';

import SentiHeader from './components/SentiHeader/SentiHeader';
import SentiMap from './components/SentiMap/SentiMap';
import SentiForm from './components/SentiForm/SentiForm';
import SentiStats from './components/SentiStats/SentiStats';
import SentiFooter from './components/SentiFooter/SentiFooter';

import { Hero, Container } from 'react-bulma-components';
import SentiList from './components/SentiList/SentiList';
class App extends Component {
    state = {
        location: {
            lat: 51.505,
            lng: -0.09
        },
        radius: 10,
        topic: '',
        count: 100,
        tweets: [],
        emotions: [
            'disgust',
            'sadness',
            'shame',
            'joy',
            'guilt',
            'fear',
            'anger'
        ],
        predictions: [],
        loading: true,
        active: false
    };

    // Load model from API
    async componentDidMount() {
        this.model = await tf.loadLayersModel(
            'http://localhost:5000/model.json'
        );
        this.setState({ loading: false });
    }

    // set location
    onGetLocation = childData => {
        this.setState({
            location: childData
        });
    };

    // update state on form change
    onFormChange = childData => {
        this.setState({
            ...childData
        });
    };

    // update state on get form & fetch tweets
    onGetForm = childData => {
        const { topic, radius } = childData;
        this.setState(
            {
                topic: topic,
                radius: radius,
                loading: true
            },
            () => this.fetchTweets()
        );
    };

    // fetch the tweets given the query settings from the state
    fetchTweets = () => {
        const data = {
            topic: this.state.topic,
            radius: this.state.radius,
            count: this.state.count,
            latitude: this.state.location.lat,
            longitude: this.state.location.lng
        };

        getTweets(data)
            .then(res => {
                if (res.status === 200) {
                    res.json().then(res => {
                        this.setState({
                            loading: false
                        });
                        this.predictTweets(res);
                    });
                } else {
                    this.setState({ noTopic: true });
                }
            })
            .catch(err => console.log(err));
    };

    async predictTweets(tweets) {
        console.log(tweets.length);
        const classifiedTweets = await predict(tweets, this.model);
        this.setState({
            noTopic: false,
            predictions: classifiedTweets
        });
    }

    onToggle = () => {
        this.setState({
            active: !this.state.active
        });
    };
    render() {
        return (
            <Hero size="fullheight">
                <Hero.Head>
                    <Container>
                        <SentiHeader
                            active={this.state.active}
                            open={this.onToggle}
                            topic={this.state.topic}
                            emotions={this.state.emotions}
                            onFormChange={this.onFormChange}
                            onFormSubmitted={this.onGetForm}
                            predictions={this.state.predictions}
                            loading={this.state.loading}
                        />
                    </Container>
                </Hero.Head>

                <Hero.Body>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={props => (
                                <SentiMap
                                    radius={this.state.radius}
                                    circleLocation={this.onGetLocation}
                                />
                            )}
                        />
                        <Route
                            path="/tweets"
                            render={() => (
                                <SentiList tweets={this.state.predictions} />
                            )}
                        />
                        <Route
                            path="/stats"
                            render={() => (
                                <SentiStats
                                    labels={this.state.emotions}
                                    tweets={this.state.predictions}
                                />
                            )}
                        />
                    </Switch>
                </Hero.Body>
                <Hero.Footer>
                    <SentiFooter />
                </Hero.Footer>
            </Hero>
        );
    }
}

export default App;
