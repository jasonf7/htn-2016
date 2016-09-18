import React, { Component } from 'react';
import { container } from './styles';
import Autocomplete from 'react-google-autocomplete';
import { GoogleMap, Marker, GoogleMapLoader } from "react-google-maps";

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
      lng: -80.5204096,
      lat: 43.4642578
    }
  }

  componentDidMount() {
    if ('geolocation' in navigator) {
      this.watchID = navigator.geolocation.watchPosition((position) => {
        this.setState({
          lng: position.coords.longitude,
          lat: position.coords.latitude
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
            ref={(map) => console.log(map)}
            defaultZoom={16}
            defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
            onClick={this.props.onMapClick}
          >
          </GoogleMap>
        }
      />
    </div>
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
