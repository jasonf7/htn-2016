/**
 * action types
 */

export const SET_CONFIG = 'SET_CONFIG';
export const AUTH_COMPLETE = 'AUTH_COMPLETE';

/**
 * action creators
 */

export function setConfig(config) {
  return { type: SET_CONFIG, config };
}

export function authComplete(user) {
  return { type: AUTH_COMPLETE, user };
}
