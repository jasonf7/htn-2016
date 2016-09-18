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

    // this.props.dispatch((dispatch) => {
    //   getEntries().then((entries) => {
    //     dispatch(updateEntries(entries))
    //   })
    // })
    // temp
    this.props.dispatch(updateEntries([
      {Longitude: 43.4642578, Latitude: -80.5204096, Mood_Polarity: 0.4, Mood_Intensity: 1.4},
      {Longitude: 43.46000, Latitude: -80.5214096, Mood_Polarity: -0.4, Mood_Intensity: 7.2},
      {Longitude: 44.782, Latitude: -81.443, Mood_Polarity: -5.4, Mood_Intensity: 3.2},
      {Longitude: 40.582, Latitude: -79.441, Mood_Polarity: 3.4, Mood_Intensity: 0.5},
      {Longitude: 38.182, Latitude: -80.439, Mood_Polarity: 3.1, Mood_Intensity: 2.1},
      {Longitude: 39.182, Latitude: -82.37, Mood_Polarity: 2, Mood_Intensity: 6},
      {Longitude: 41.582, Latitude: -79.441, Mood_Polarity: 3.4, Mood_Intensity: 0.5},
      {Longitude: 38.182, Latitude: -80.449, Mood_Polarity: 2.1, Mood_Intensity: 2.1},
      {Longitude: 39.182, Latitude: -82.38, Mood_Polarity: 1, Mood_Intensity: 6}
    ]));
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
