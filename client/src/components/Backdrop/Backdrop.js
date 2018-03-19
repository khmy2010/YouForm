import React from 'react';

import './Backdrop.css';

const backdrop = ({ show, clicked }) =>
    show ? <div className="Backdrop" onClick={clicked} /> : null;

export default backdrop;
