import React from 'react';

import './Header.css';

import Button from '../../ContextButton/CButton';

const header = ({ updated, fid }) => (
    <div className="Responses__Header">
        <div className="Responses__Header__Text">
            <span className="Title__Mont">Response Summary</span>
            <span className="Header__Updated">Last updated on {updated}</span>
        </div>
        <Button clicked={download}>Download</Button>
    </div>
);

const download = () => {
    window.location.replace(
        'http://localhost:3000/api/responses/export/5ad6d6e1512fe80432ab815d'
    );
};

export default header;
