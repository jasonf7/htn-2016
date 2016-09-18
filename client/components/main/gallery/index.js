import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { IndexLink } from 'react-router';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 800,
    height: 1000,
    overflowY: 'visible',
    marginBottom: 24,
  },
};

export default class GalleryView extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }
  /*eslint-enable */

  render() {
    return <div style={styles.root}>
      <Helmet title='Gallery' />
      <GridList
        style={styles.gridList}
        cellHeight={400}
        cellWidth={400}
      >
        {this.props.entries.map((entry) => (
          <GridTile
            titlePosition='top'
            key={entry.Id}
            title={entry.Id}
            subtitle={<span>by <b>{entry.UserId}</b></span>}
            actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
          >
            <video src={entry.Url} type="video/mp4" height="400" width="400" controls>
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
