import React from 'react';
import { Navbar, Container } from 'react-bulma-components';
import { NavLink } from 'react-router-dom';
import SentiForm from '../SentiForm/SentiForm';
import './SentiHeader.css';
export default props => {
    return (
        <Navbar
            color="light"
            fixed="top"
            active={props.active}
            style={{ zIndex: 9999 }}
        >
            <Container fluid>
                <Navbar.Brand>
                    <Navbar.Item renderAs="a" href="/">
                        SentiMap
                    </Navbar.Item>
                    <Navbar.Burger onClick={props.open} />
                </Navbar.Brand>
                <Navbar.Menu>
                    <Navbar.Container position="start">
                        <Navbar.Item>
                            <SentiForm
                                topic={props.topic}
                                emotions={props.emotions}
                                onFormChange={props.onFormChange}
                                onFormSubmitted={props.onFormSubmitted}
                                predictions={props.predictions}
                                loading={props.loading}
                            />
                        </Navbar.Item>
                    </Navbar.Container>
                    <Navbar.Container position="end">
                        <div className="navContainer">
                            <NavLink
                                className="SentiHeaderLink"
                                to="/"
                                exact
                                activeClassName="is-active"
                            >
                                Home
                            </NavLink>

                            <NavLink
                                className="SentiHeaderLink"
                                to="/tweets"
                                activeClassName="is-active"
                            >
                                Tweets
                            </NavLink>

                            <NavLink
                                className="SentiHeaderLink"
                                to="/stats"
                                activeClassName="is-active"
                            >
                                Stats
                            </NavLink>
                        </div>
                    </Navbar.Container>
                </Navbar.Menu>
            </Container>
        </Navbar>
    );
};
