import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import App from './containers/App';
import reducers from './reducers';

let composeEnhancers;

if (process.env.NODE_ENV === 'production') {
    composeEnhancers = compose;
} else {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    //for testing API routes in development
    window.axios = axios;
    const url = window.location.pathname.split('/');
    const fid = url.slice(3).shift();
    window.fid = fid;

    window.getQuestions = async () => {
        const res = await axios.get(`/api/forms/${fid}/questions`);
        return res;
    };

    const log = (msg, warna) => {
        const color = warna || 'green';
        console.log('%c ' + msg, 'color: ' + color);
    };
    window.colorLog = log;
}

const store = createStore(
    reducers,
    {},
    composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.querySelector('#root')
);
