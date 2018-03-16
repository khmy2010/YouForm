import React from 'react';

import './NotFound.css';
import bird from '../../assets/images/bower.svg';

const notFound = ({ history }) => (
    <div className="NotFound-Content">
        <img
            src={bird}
            alt="404 Bad Request"
            style={{ marginBottom: '70px' }}
        />
        <h2>Houston, we have a problem.</h2>
        <p>We can't find the page you're looking for.</p>
        <button className="NotFound-Button" onClick={() => history.push('/')}>
            Go back my friend, go back
        </button>
    </div>
);

export default notFound;
