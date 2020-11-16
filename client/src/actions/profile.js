import axios from 'axios';

import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED } from './types';

// Get the current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (error) {
        setAlert("No profile for the user ", "warning");
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}; 

// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };

        const res = await axios.post('/api/profile', formData, config);
        
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        }); 
        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));

        if (!edit)
            history.push('/dashboard');
        
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            console.log(errors);
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
            

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
}; 

// Add exp
export const addExperience = (formData, history) => async dispatch => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const res = await axios.put("/api/profile/experience", formData, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Experience Added", "success"));

     history.push("/dashboard");
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        console.log(errors);
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
};

// Add Edu
export const addEducation = (formData, history) => async dispatch => {
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const res = await axios.put("/api/profile/education", formData, config);

      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });
      dispatch(setAlert("Education Added", "success"));

     history.push("/dashboard");
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        console.log(errors);
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
};

// Delete exp
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Experience removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Delete edu
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });
    dispatch(setAlert("Education removed", "success"));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? This cannot be undone!"))
  {
    try {
      await axios.delete(`api/profile`);

      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({type: ACCOUNT_DELETED});

      dispatch(setAlert("Your account has been deleted!"));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};