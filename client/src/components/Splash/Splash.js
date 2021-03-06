import React from 'react';

import { CONSTS } from '../../utils';
import './Splash.css';

/*
    Functions:
    1. Tell user this is invalid FID.
    2. Tell user this form has been closed.
*/

const splash = ({ show, error, history }) => {
    if (!show) return null;

    let errorMessage = null;
    let errorTips = null;
    let buttonCTA = null;

    const err = error === undefined ? true : error.data;

    document.title = 'Sorry!';

    switch (err) {
        case CONSTS.ERROR.ERR_FILE_NOT_EXIST:
        // eslint-disable-next-line
        case CONSTS.ERROR.ERR_BAD_FID:
            errorMessage = 'Looks like this form is from Mars';
            errorTips =
                'We could not find a matching record from our Big Yellow mango :(';
            buttonCTA = 'Go to Home';
            break;
        case CONSTS.ERROR.ERR_FORM_CLOSED:
            errorMessage = 'Looks like the owner just closed her door';
            errorTips =
                'This form has already expired. Ask owner for permissions :)';
            buttonCTA = 'Request Permission';
            break;
        default:
            errorMessage = 'Looks like something went wrong on our end';
            errorTips = 'Head back to Home Page for more fun :)';
            buttonCTA = 'Go to Home';
            break;
    }
    return (
        <div className="Splash">
            <h1 className="Splash__Header">Sorry.</h1>
            <p className="Splash__Msg">{errorMessage}</p>
            <p className="Splash__Tips">{errorTips}</p>
            <button
                className="Splash__Button"
                onClick={() => history.push('/')}
            >
                {buttonCTA}
            </button>
        </div>
    );
};

export default splash;
