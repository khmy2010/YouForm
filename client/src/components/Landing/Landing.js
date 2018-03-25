import React from 'react';

import Header from '../Header/Header';

import './Landing.css';

const landing = ({ auth }) => {
    return (
        <React.Fragment>
            <Header auth={auth} />
            <div className="Landing">
                <section id="Landing__Title">
                    <h1 id="Landing__Intro">
                        Changing how you ask for information
                    </h1>
                </section>
            </div>
        </React.Fragment>
    );
};
export default landing;
