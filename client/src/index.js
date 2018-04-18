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
    window.axios = axios;
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
