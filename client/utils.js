import _ from 'lodash';

export function normalizeSentimentData(data) {
  return _.map(data, (entry) => {
    const location = new google.maps.LatLng(entry.Longitude, entry.Latitude);
    const weight = entry.Mood_Polarity * entry.Mood_Intensity * 10;

    return {
      location,
      weight
    };
  });
}
