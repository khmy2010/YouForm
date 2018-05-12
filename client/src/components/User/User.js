import React from 'react';

import './User.css';
import UserSVG from '../../assets/images/user.svg';

const user = ({ info: { name, email } }) => {
    return (
        <div className="User">
            <img src={UserSVG} alt="user" />
            <div className="User__Info">
                <span className="User__Name">{name}</span>
                <span className="User__Email">{email}</span>
                <button className="User__Logout">
                    <a href="/api/logout">Logout</a>
                </button>
            </div>
        </div>
    );
};

export default user;
