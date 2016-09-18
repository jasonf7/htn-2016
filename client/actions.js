/**
 * action types
 */

export const SET_CONFIG = 'SET_CONFIG';
export const AUTH_COMPLETE = 'AUTH_COMPLETE';
export const UPDATE_ENTRIES = 'UPDATE_ENTRIES';

/**
 * action creators
 */

export function setConfig(config) {
  return { type: SET_CONFIG, config };
}

export function authComplete(user) {
  return { type: AUTH_COMPLETE, user };
}

export function updateEntries(entries) {
  return { type: UPDATE_ENTRIES, entries };
}
