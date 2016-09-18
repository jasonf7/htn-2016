import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';

class Main extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet title='Main' />
      <h2>Main page</h2>
      <div>
        go <IndexLink to='/'>home</IndexLink>
        go <IndexLink to='/record'>record</IndexLink>
      </div>
    </div>;
  }

}

export default connect(store => ({ config: store.config }))(Main);
