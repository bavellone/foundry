/*eslint-env browser*/
'use strict';

import React from 'react';

export default class Footer extends React.Component {
	static defaultProps = {};
	state = {};

	render() {
		return (
			<div className="ui inverted vertical footer segment">
				<div className="ui container">
					<div className="ui stackable inverted divided equal height stackable grid">
						<div className="three wide column">
							<h4 className="ui inverted header">Links</h4>
							<div className="ui inverted link list">
								<a href="#" className="item">Page 1</a>
								<a href="#" className="item">Page 2</a>
							</div>
						</div>
            <div className="three wide column">
							<h4 className="ui inverted header">Links</h4>
							<div className="ui inverted link list">
                <a href="#" className="item">Page 1</a>
                <a href="#" className="item">Page 2</a>
							</div>
						</div>
						<div className="ten wide column">
							<h4 className="ui inverted header">Footer</h4>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae quis magni, quia ut possimus eligendi tenetur quibusdam quas consequatur facilis.</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque, maxime, nam. Optio voluptatem modi quo odio doloremque consequuntur itaque ipsa quae praesentium sed, eveniet eum quas ut maiores tempore dicta.
              </p>
						</div>
					</div>
				</div>
        
        <div className="ui center aligned container">
          <div className="ui inverted section divider"></div>
          <img src="assets/logo.png" className="ui centered tiny image"/>
          <div className="ui horizontal inverted small divided link list">
            <a className="item" href="#">Contact Us</a>
            <div className="item">Copyright &copy; 2016</div>
            <a className="item" href="#">Privacy Policy</a>
          </div>
        </div>
        
			</div>
		)
	}
}
