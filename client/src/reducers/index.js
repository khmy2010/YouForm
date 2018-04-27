//this file will combine all reducers in this project.
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import formAdminReducer from './formAdminReducer';
import dashReducer from './dashReducer';
import formReducer from './formReducer';
import publicReducer from './publicReducer';

export default combineReducers({
    auth: authReducer,
    formAdmin: formAdminReducer,
    dash: dashReducer,
    form: formReducer,
    public: publicReducer
});
