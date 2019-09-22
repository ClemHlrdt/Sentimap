import React, { Component } from 'react';
//import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Form, Button, Loader } from 'react-bulma-components';

//import SentiList from '../SentiList/SentiList';
export default class SentiForm extends Component {
    state = {
        topic: '',
        radius: 10
    };
    onChangeForm = evt => {
        this.setState(
            {
                [evt.target.name]:
                    evt.target.name === 'radius'
                        ? parseInt(evt.target.value)
                        : evt.target.value
            },
            () => {
                this.props.onFormChange({
                    radius: this.state.radius
                });
            }
        );
    };

    onFormSubmit = async e => {
        e.preventDefault();

        this.props.onFormSubmitted({
            topic: this.state.topic,
            radius: this.state.radius
        });
    };

    giveEmoji = emotion => {
        switch (emotion) {
            case 'disgust':
                return '🤮';
            case 'joy':
                return '😀';
            case 'fear':
                return '😨';
            case 'anger':
                return '😡';
            case 'sadness':
                return '😭';
            case 'shame':
                return '😔';
            case 'guilt':
                return '😶';
            default:
                break;
        }
    };

    handleSubmit() {
        this.props.history.push('/tweets');
    }

    render() {
        return (
            <div>
                <div>
                    <Form.Field
                        horizontal={true}
                        kind="group"
                        onSubmit={this.handleSubmit}
                    >
                        <Form.Label>
                            <div className="field-label is-normal">Topic</div>
                        </Form.Label>
                        <Form.Control>
                            <Form.Input
                                onChange={this.onChangeForm}
                                type="text"
                                name="topic"
                                id="topic"
                                value={this.state.topic}
                                placeholder="Type a topic"
                            />
                        </Form.Control>
                        <Form.Label>
                            <div className="field-label is-normal">Radius</div>
                        </Form.Label>
                        <Form.Control size="medium">
                            <Form.Select
                                onChange={this.onChangeForm}
                                name="radius"
                                value={this.state.radius}
                            >
                                <option value="5">5km</option>
                                <option value="10">10km</option>
                                <option value="15">15km</option>
                                <option value="20">20km</option>
                                <option value="25">25km</option>
                                <option value="30">30km</option>
                                <option value="35">35km</option>
                                <option value="40">40km</option>
                                <option value="45">45km</option>
                                <option value="50">50km</option>
                            </Form.Select>
                        </Form.Control>
                        {this.props.loading ? (
                            <Button
                                color="primary"
                                disabled={!this.state.topic}
                                onClick={this.onFormSubmit}
                            >
                                <Loader
                                    style={{
                                        borderTopColor: 'transparent',
                                        borderRightColor: 'transparent'
                                    }}
                                />
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                disabled={!this.state.topic}
                                onClick={this.onFormSubmit}
                            >
                                Submit
                            </Button>
                        )}
                    </Form.Field>
                </div>
                {/* <div>
                    {this.state.noTopic
                        ? 'Sorry, no tweets for this topic!'
                        : ''}
                    {this.props.predictions.length > 0 ? (
                        <div>
                            <Section>
                                <Heading>
                                    {this.props.predictions.length} tweets found
                                </Heading>
                            </Section>
                            <SentiList tweets={this.props.predictions} />
                        </div>
                    ) : (
                        ''
                    )}
                </div> */}
            </div>
        );
    }
}
