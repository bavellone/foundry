/*eslint-env browser*/
'use strict';

import React from 'react';

export default class ImageStrip extends React.Component {
	static defaultProps = {
		images: []
	};

	render() {
		return (
      <div className="ui medium images imagestrip">
        {this.props.images.map(img =>
          <img src={`/assets/uploads/${img.id}.${img.extension}`} alt={img.name} className="ui image"/>
        )}
      </div>
    )
	}
	
}
