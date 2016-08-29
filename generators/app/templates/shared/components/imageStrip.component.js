/*eslint-env browser*/
'use strict';

import React from 'react';
import _ from 'lodash';

export default class ImageStrip extends React.Component {
	static defaultProps = {
		images: []
	};

	render() {
		return (
      <div className="ui medium images imagestrip">
        {this.props.images.map(img =>
          <img src={img.path} alt={img.name} className="ui image"/>
        )}
      </div>
    )
	}
	
}
