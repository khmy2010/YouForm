import React, { Component } from 'react';

import HuaiDiao from '../../assets/images/huaidiao.svg';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="HuaiDiao">
                <img src={HuaiDiao} alt="It's broken." />
                <h1>He's Dead, Harry!</h1>
                <h3>Something went wrong at our side.</h3>
                <p>Please reload the application.</p>
            </div>
        );
    }
}

export default ErrorBoundary;
