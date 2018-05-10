import React from 'react';

import './Header.css';

import Button from '../../ContextButton/CButton';

const header = ({ updated, fid }) => (
    <div className="Responses__Header">
        <div className="Responses__Header__Text">
            <span className="Title__Mont">Response Summary</span>
            <span className="Header__Updated">Last updated on {updated}</span>
        </div>
        <Button clicked={() => download(fid)}>Download</Button>
    </div>
);

const download = fid => {
    if (typeof fid !== 'string') return;
    window.location.replace(
        `http://localhost:3000/api/responses/export/${fid}`
    );
};

export default header;
