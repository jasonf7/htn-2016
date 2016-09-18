import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {container} from './styles';

export default class App extends Component {

  render() {
    return <div className={container}>
      <Helmet title='Vio' />
      {this.props.children}
    </div>;
  }

}
