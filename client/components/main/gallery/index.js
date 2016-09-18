import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

export default class GalleryView extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  render() {
    return <div>
      <Helmet title='Gallery' />
      <h2>Gallery</h2>
      <GridList
        cellHeight={200}
      >
        <Subheader>test</Subheader>
        {this.props.entries.map((entry) => (
          <GridTile
            key={entry.Id}
            title={entry.Id}
            subtitle={<span>by <b>{entry.UserId}</b></span>}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          >
            <video>
              <source src={entry.Url} type="video/mp4" />
            </video>
          </GridTile>
        ))}
      </GridList>
    </div>;
  }
}

GalleryView.propTypes = {
  dispatch: React.PropTypes.func,
  entries: React.PropTypes.array
}

// export default connect(store => ({ config: store.config }))(Preview);
