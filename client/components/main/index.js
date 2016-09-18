import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import { container } from './styles';
import { Tabs, Tab } from 'material-ui/Tabs';
import MapIcon from 'material-ui/svg-icons/maps/map';
import CameraIcon from 'material-ui/svg-icons/maps/local-see';
import GalleryIcon from 'material-ui/svg-icons/image/photo-library';

class Main extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  constructor(props) {
    super(props);
    this.state = {
      value: 'map',
    };
  }

  handleChange = (value) => {
    if (value != 'camera') {
      this.setState({
        value,
      });
    } else {
      this.setState({
        value: this.state.value
      })
    }
  }

  render() {
    return <div className={container}>
      <Helmet title='Main' />
      <Tabs
        value={this.state.value}
        onChange={this.handleChange}
      >
        <Tab icon={<GalleryIcon />} value="gallery" >
          <div>
            Gallery
          </div>
        </Tab>
        <Tab icon={<CameraIcon />} value="camera">
          <div>
            Camera
          </div>
        </Tab>
        <Tab icon={<MapIcon />} value="map" >
          <div>
            Map
          </div>
        </Tab>
      </Tabs>
    </div>;
  }
}

export default connect(store => ({ config: store.config }))(Main);
