import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';

class Preview extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet title='Preview' />
      <h2>Preview</h2>
      go <IndexLink to='/'>home</IndexLink>
    </div>;
  }
}

Preview.propTypes = {
  publish: React.PropTypes.bool
}

Preview.defaultProps = {
  publish: false
}

export default connect(store => ({ config: store.config }))(Preview);
