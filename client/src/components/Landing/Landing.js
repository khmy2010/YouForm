import React from 'react';

import Header from '../Header/Header';

import './Landing.css';
import Connecting from '../../assets/images/landing.svg';

const landing = ({ auth }) => {
    return (
        <React.Fragment>
            <div className="Landing__Wrapper">
                <Header auth={auth} />
                <div className="Landing">
                    <div className="Landing__Text">
                        <h1>Because we are human.</h1>
                        <p className="Landing__Intro">
                            YouForm changes the way you ask by introducing forms
                            that converse with human that makes the process more
                            human.
                        </p>
                    </div>
                    <img
                        src={Connecting}
                        alt="YouForm helps student to collect data better."
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
export default landing;
