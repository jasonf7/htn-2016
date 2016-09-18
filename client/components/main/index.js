import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import { container } from './styles';
import { Tabs, Tab } from 'material-ui/Tabs';
import MapIcon from 'material-ui/svg-icons/maps/map';
import CameraIcon from 'material-ui/svg-icons/maps/local-see';
import GalleryIcon from 'material-ui/svg-icons/image/photo-library';
import MapView from './map';
import { getEntries } from '#app/webapi';
import { updateEntries } from '#app/actions';

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

    this.props.dispatch((dispatch) => {
      getEntries()
        .then((entries) => entries.json())
        .then((entries) => {
          console.log(entries);
          console.log('hi');
          dispatch(updateEntries(entries));
        })
    })
  }

  componentDidMount() {
  }

  handleChange = (value) => {
    this.setState({
      value,
    });
  }

  render() {
    return <div className={container}>
      <Helmet title='Home' />
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
            go <IndexLink to='/record'>record</IndexLink>
          </div>
        </Tab>
        <Tab icon={<MapIcon />} value="map">
          <MapView dispatch={this.props.dispatch} entries={this.props.entries} />
        </Tab>
      </Tabs>
    </div>;
  }
}

export default connect(store => ({ config: store.config, entries: store.entries }))(Main);
