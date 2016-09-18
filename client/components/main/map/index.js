import React, { Component } from 'react';
import { container } from './styles';
import Autocomplete from 'react-google-autocomplete';
import { GoogleMap, Marker, GoogleMapLoader, OverlayView } from "react-google-maps";
import { radialOverlay } from './styles';
import { normalizeSentimentData } from '#app/utils';

export default class MapView extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    // Load here any data.
    callback(); // this call is important, don't forget it
  }
  /*eslint-enable */

  constructor(props) {
    super(props)

    this.state = {
      physical_lng: -80.5204096,
      physical_lat: 43.4642578,
      lng: -80.5204096,
      lat: 43.4642578
    }
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
      this.watchID = navigator.geolocation.watchPosition((position) => {
        this.setState({
          physical_lng: position.coords.longitude,
          physical_lat: position.coords.latitude
        })
      });
    }
  }

  componentWillUnmount() {
    if ('geolocation' in navigator) {
      navigator.geolocation.clearWatch(this.watchID);
    }
  }

  render() {
    console.log(this.state.lat);
    console.log(this.state.lng);

    return <div className={container}>
      <Autocomplete
        style={{
          width: '100%',
          padding: '14px',
          borderBottom: '1px solid #7f7f7f'
        }}
        onPlaceSelected={this.onPlaceSelected}
        onChange={this.stopPropagation}
        types={['(regions)']}
      />
      <GoogleMapLoader
        query={{ libraries: "places,visualization" }}
        containerElement={
          <div
            style={{
              height: "88vh"
            }}
          />
        }
        googleMapElement={
          <GoogleMap
            ref={(map) => {
              this._gmap = map;
              console.log(map);
            }}
            defaultZoom={16}
            defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
            onClick={this.onMapClick}
          >
            <OverlayView
              position={{ lat: this.state.lat, lng: this.state.lng }}
              mapPaneName={OverlayView.OVERLAY_LAYER}
              getPixelPositionOffset={this.getPixelPositionOffset}
            >
              <div className={radialOverlay}>
              </div>
            </OverlayView>
          </GoogleMap>
        }
      />
    </div>
  }

  componentDidUpdate() {
    const data = normalizeSentimentData(this.props.entries);

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: data.filter(entry => entry.weight > 0)
    });
    heatmap.setMap(this._gmap.props.map);
    heatmap.set('radius', heatmap.get('radius') ? null : 20);

    const coldmap = new google.maps.visualization.HeatmapLayer({
      data: data.filter(entry => (entry.weight <= 0)).map(entry => ({location: entry.location, weight: -1 * entry.weight}))
    });
    coldmap.setMap(this._gmap.props.map);
    coldmap.set('radius', coldmap.get('radius') ? null : 20);
    heatmap.set('gradient', [
      'rgba(0, 255, 255, 0)',
      'rgba(0, 255, 255, 1)',
      'rgba(0, 191, 255, 1)',
      'rgba(0, 127, 255, 1)',
      'rgba(0, 63, 255, 1)',
      'rgba(0, 0, 255, 1)',
      'rgba(0, 0, 223, 1)',
      'rgba(0, 0, 191, 1)',
      'rgba(0, 0, 159, 1)',
      'rgba(0, 0, 127, 1)',
      'rgba(63, 0, 91, 1)',
      'rgba(127, 0, 63, 1)',
      'rgba(191, 0, 31, 1)',
      'rgba(255, 0, 0, 1)']
    );

    this._gmap.props.map.panTo(new google.maps.LatLng(this.state.lat, this.state.lng));
  }

  onMapClick = (location) => {
    console.log(location.latLng.lat());
    console.log(location.latLng.lng());

    this.setState({
      lng: location.latLng.lat(),
      lat: location.latLng.lng()
    });
  }

  onPlaceSelected = (place) => {
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());

    this.setState({
      lng: place.geometry.location.lng(),
      lat: place.geometry.location.lat()
    });
  }

  stopPropagation = (e) => {e.stopPropagation()}
}

MapView.propTypes = {
  dispatch: React.PropTypes.func,
  entries: React.PropTypes.array
}
