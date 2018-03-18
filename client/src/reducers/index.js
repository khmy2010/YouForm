//this file will combine all reducers in this project.
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import formAdminReducer from './formAdminReducer';
import dashReducer from './dashReducer';

export default combineReducers({
    auth: authReducer,
    formAdmin: formAdminReducer,
    dash: dashReducer
});
