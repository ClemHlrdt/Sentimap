import React from 'react';
import { Footer, Container, Content, Hero } from 'react-bulma-components';

export default () => (
    <Hero size="medium">
        <Footer>
            <Container>
                <Content style={{ textAlign: 'center' }}>
                    <p>
                        <strong>SentiMap</strong> by{' '}
                        <a href="https://github.com/ClemHlrdt">
                            Clément Hélardot
                        </a>
                    </p>
                </Content>
            </Container>
        </Footer>
    </Hero>
);
