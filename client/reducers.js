import { combineReducers } from 'redux';
import { SET_CONFIG, AUTH_COMPLETE, UPDATE_ENTRIES } from './actions';

function config(state = {}, action) {
  switch (action.type) {
    case SET_CONFIG:
      return action.config;
    default:
      return state;
  }
}

function authentication(state = {}, action) {
  switch (action.type) {
    case AUTH_COMPLETE:
      return Object.assign({}, {
        user: action.user
      });
    default:
      return state;
  }
}

function entries(state = [], action) {
  switch (action.type) {
    case UPDATE_ENTRIES:
      return action.entries.slice(0); // returns copy of the array
    default:
      return state;
  }
}

export default combineReducers({config, authentication, entries});
