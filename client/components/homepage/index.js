import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logo } from './styles';
import { authComplete } from '#app/actions';
import { authenticate } from '#app/webapi';
import { withRouter } from 'react-router';
import FacebookLogin from 'react-facebook-login';

class Homepage extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    // Load here any data.
    callback(); // this call is important, don't forget it
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet
        title='Home page'
        meta={[
          {
            property: 'og:title',
            content: 'Vio'
          }
        ]}
      />
      <img className={logo} src='static/sunny.png'></img>
      <FacebookLogin
        appId="616403665233139"
        fields="name,email,picture"
        onClick={this.onLoginClicked}
        callback={this.onFacebookResponse}
      />
    </div>;
  }

  onFacebookResponse = (response) => {
    console.log(response)
    if (response.id && response.accessToken) {
      this.props.dispatch((dispatch) => {
        const user = {
          "Name": response.name,
          "Email": response.email,
          "Photo": response.picture.data.url,
          "Id": response.id
        }

        authenticate(user, () => {
          dispatch(authComplete(user))
          this.props.router.push('/main');
        })
      })
    }
  }
}

export default connect(store => ({ config: store.config }))(withRouter(Homepage));
