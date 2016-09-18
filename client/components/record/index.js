import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import { upload } from '#app/webapi';

class Record extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet title='Record' />
      <h2>Record</h2>
      <input
        ref='inputVideo'
        type="file"
        accept="video/*"
        onChange={this.onVideoCaptured}
        capture="camcorder"
      />
      <div><video ref='videoPlayer' controls></video></div>
      <div>
        <img width="4%" height="4%" src='static/sunny.png'></img>
        Bay Front Park, ON
      </div>
      <textarea rows="4" cols="50">Write about your time</textarea>
    </div>;
  }

  onVideoCaptured = () => {
    const videoFile = this.refs.inputVideo.files[0]
    const videoPlayer = this.refs.videoPlayer

    const canPlayVideo = videoPlayer.canPlayType(videoFile.type) !== '' ? true : false

    if (canPlayVideo) {
      const videoURL = URL.createObjectURL(videoFile)
      this.refs.videoPlayer.src = videoURL

      // Create the file metadata
      const metadata = {
        contentType: 'video/mp4'
      };

      const storageRef = firebase.storage().ref();

      const unixTimestamp = Math.round(+new Date()/1000).toString();
      const videoFileName = this.props.auth.user.Id + "-" + unixTimestamp;
      // Upload file and metadata to the object 'images/mountains.jpg'
      let uploadTask = storageRef.child('vio-video/' + videoFileName).put(videoFile, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        (snapshot) => {
          // TODO: Progress bar
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, (error) => {
          // TODO: error popup
          console.log("Error: " + error.code)
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;

          case 'storage/canceled':
            // User canceled the upload
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, () => {
        // Upload completed successfully, now we can get the download URL
        const downloadURL = uploadTask.snapshot.downloadURL;
        console.log(downloadURL)

        let uploadObj = {
          Id: -1,
          Longitude: 0.0,
        	Latitude: 0.0,
        	Mood_Polarity: 0.0,
        	Mood_Intensity: 0.0,
        	Description: "",
        	Url: downloadURL,
        	UserId: parseInt(this.props.auth.user.Id)
        }

        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              Object.assign(uploadObj, {
                Longitude: pos.coords.longitude,
                Latitude: pos.coords.latitude
              })

              console.log(pos)
              console.log(uploadObj)

              upload(uploadObj, () => {
                console.log("DONE")
              })
            },
            (err) => {
              console.log('ERROR(' + err.code + '): ' + err.message)
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          )
        } else {
          console.log("ERROR: location not supported")
        }

      });

    } else {
      // TODO: Add error pop-up?
    }
  }

}

export default connect(store => ({ auth: store.authentication }))(Record);
