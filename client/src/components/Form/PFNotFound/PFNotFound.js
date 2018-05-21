import React from 'react';

import handSVG from '../../../assets/images/hand.svg';
import './PFNotFound.css';

const notFound = props => {
    return (
        <div className="PF__NotFound">
            <h2>Nobody asked questions yet</h2>
            <p className="PF__NotFoundDesc">
                Be the first to ask your question!
            </p>
            <img src={handSVG} alt="Hand" />
        </div>
    );
};

export default notFound;
