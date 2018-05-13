import React from 'react';

import './Header.css';

import Button from '../../ContextButton/CButton';
import { downloadResponses } from '../../../utils';

const header = ({ updated, fid }) => (
    <div className="Responses__Header">
        <div className="Responses__Header__Text">
            <span className="Title__Mont">Response Summary</span>
            <span className="Header__Updated">Last updated on {updated}</span>
        </div>
        <Button clicked={() => downloadResponses(fid)}>Download</Button>
    </div>
);

export default header;
