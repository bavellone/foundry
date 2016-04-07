/*eslint-env browser*/
'use strict';

import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';

import SidebarMenu from '../components/menu/sidebar';
import MenuLink from '../components/menu/link';
import ContentSegment from '../components/contentSegment';

export default class Home extends React.Component {
	static route = 'home';
	static linkText = 'Home';
	static linkIcon = 'home';
	
	static defaultProps = {
		menuAnimationDelay: 500
	};

	constructor(props) {
		super(props);
	}

	state = {
		menu: {
			following: {
				visible: false
			},
			sidebar: {
				visible: false
			},
			delayAnimation: false,
			delayTimeout: 0
		}
	};

	componentDidMount() {

	}

	_setSidebarMenu = (visible) => {
		clearTimeout(this.state.menu.delayTimeout);
		this.setState(_.merge({}, this.state, {
			menu: {
				delayAnimation: true,
				sidebar: {
					visible: visible
				},
				delayTimeout: setTimeout(() => this.setState(_.merge({}, this.state, {
					menu: {
						delayAnimation: false
					}
				})), this.props.menuAnimationDelay)
			}
		}));
	};

	_openSidebarMenu = (event) => {
		if (!this.state.menu.sidebar.visible)
			this._setSidebarMenu(true);
		event.stopPropagation();
	};

	_closeSidebarMenu = () => {
		if (this.state.menu.sidebar.visible)
			this._setSidebarMenu(false);
		event.stopPropagation();
	};

	_genLinks = () =>
		_.reduce(this.props.routes, (links, route) => {
			if (route.path != '/')
				links.push({
					to: route.path, text: route.component.linkText, icon: route.component.linkIcon
				});
			return links;
		}, []);

	render() {
		const links = this._genLinks();
		return (
			<div id="app-body-container">

				<SidebarMenu
					className="sidebar-menu"
					links={links}
					animate={this.state.menu.delayAnimation || this.state.menu.sidebar.visible}
					visible={this.state.menu.sidebar.visible}
					onLinkClick={this._closeSidebarMenu}/>

				<div id="app-body"
				     className={classnames({dimmed: this.state.menu.sidebar.visible || this.state.menu.delayAnimation})}
				     onClick={this._closeSidebarMenu}>
					<div className="view home">
						<div className="ui view home inverted vertical masthead center aligned segment">

							<div className="ui container">
								<div className="ui large secondary inverted pointing menu">
									<a className="toc item" onClick={this._openSidebarMenu}>
										<i className="sidebar icon"/>
									</a>
									{links.map((link) =>
										<MenuLink
											key={link.to}
											to={link.to}
											icon={link.icon}
											text={link.text}
											onClick={this._openSidebarMenu}
										/>
									)}

								</div>
							</div>

							<div className="ui text container">
								<h1 className="ui inverted header">
									<%= appName %>
								</h1>
								<h2 className="ui inverted header">
									<%= appNS %></h2>
								<Link to='/' className="ui huge primary button">Get Started <i className="right arrow icon"/></Link>
							</div>

						</div>

						<ContentSegment>
							<div className="column">
								<h1>Welcome!</h1>
								<p>
									<%= appName %>: <%= appDesc %>
								</p>
							</div>

						</ContentSegment>

					</div>

				</div>
			</div>
		);
	}
}
