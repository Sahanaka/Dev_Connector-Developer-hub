import axois from 'axios';

import { setAlert } from './alert';
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR, LOGIN_FAILED, LOGIN_SUCCESS, LOGOUT, CLEAR_PROFILE } from '../actions/types';
import  setAuthToken  from '../utils/setAuthToken';

// Load user
export const loadUser = () => async dispatch => {
   if (localStorage.token)
      setAuthToken(localStorage.token);
    
    try {
        const res = await axois.get('/api/auth');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        console.error(error);
        dispatch(
            { type: AUTH_ERROR }
        );
    }
};

// Register user
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: { "Content-Type": "application/json"}
    };

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axois.post("/api/users", body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors)
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        dispatch({
            type: REGISTER_FAIL
        });
    }
};

// Login user
export const login = (email, password) => async dispatch => {
    const config = {
        headers: { "Content-Type": "application/json"}
    };

    const body = JSON.stringify({ email, password });

    try {
        const res = await axois.post("/api/auth", body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser());
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors)
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        dispatch({
            type: LOGIN_FAILED
        });
    }
};

// Logout 
export const logout = () => dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    dispatch({ type: LOGOUT });
};