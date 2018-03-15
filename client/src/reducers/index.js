//this file will combine all reducers in this project.
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import formAdminReducer from './formAdminReducer';

export default combineReducers({
    auth: authReducer,
    formAdmin: formAdminReducer
});
