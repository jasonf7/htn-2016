import React, { Component } from 'react';
import { container } from './styles';
import Autocomplete from 'react-google-autocomplete';

export default class MapView extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    // Load here any data.
    callback(); // this call is important, don't forget it
  }
  /*eslint-enable */

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
    </div>
  }

  onPlaceSelected = (place) => {
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
  }

  stopPropagation = (e) => {e.stopPropagation()}
}
