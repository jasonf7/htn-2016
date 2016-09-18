import React, { Component } from 'react';
import { container } from './styles';
import Autocomplete from 'react-google-autocomplete';
import { GoogleMap, Marker, GoogleMapLoader, OverlayView } from "react-google-maps";
import { radialOverlay } from './styles';

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
    var dummyHeatMapData = [
      {location: new google.maps.LatLng(43.4642578, -80.5204096), weight: 5},
      {location: new google.maps.LatLng(43.46000, -80.5204096), weight: 1},
      {location: new google.maps.LatLng(44.782, -81.443), weight: 2},
      {location: new google.maps.LatLng(40.582, -79.441), weight: 3},
      {location: new google.maps.LatLng(38.182, -80.439), weight: 2},
      new google.maps.LatLng(39.182, -82.37)
    ];

    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: dummyHeatMapData
    });
    heatmap.setMap(this._gmap.props.map);
    heatmap.set('radius', heatmap.get('radius') ? null : 20);

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
