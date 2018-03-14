import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const Landing = () => <h1>Landing Page</h1>;
const Dashboard = () => <h1>Dashboard Page</h1>;

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route path="/" exact component={Landing} />
                    <Route path="/app/dashboard" exact component={Dashboard} />
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
