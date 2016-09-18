import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from '#app/components/app';
import Homepage from '#app/components/homepage';
import Main from '#app/components/main';
import Preview from '#app/components/preview';
import NotFound from '#app/components/not-found';
import Record from '#app/components/record';

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
export default ({store, first}) => {

  // Make a closure to skip first request
  function w(loader) {
    return (nextState, replaceState, callback) => {
      if (first.time) {
        first.time = false;
        return callback();
      }
      return loader ? loader({store, nextState, replaceState, callback}) : callback();
    };
  }

  return <Route path="/" component={App}>
    <IndexRoute component={Homepage} onEnter={w(Homepage.onEnter)}/>
    <Route path="main" component={Main} onEnter={w(Main.onEnter)}/>
    <Route path="preview" component={Preview} onEnter={w(Preview.onEnter)}/>
    <Route path="record" component={Record} onEnter={w(Record.onEnter)}/>
    <Route path="*" component={NotFound} onEnter={w(NotFound.onEnter)}/>
  </Route>;
};
