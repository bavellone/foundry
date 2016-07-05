/*eslint-env browser*/
'use strict';

import React from 'react';
import {Link} from 'react-router';
import _ from 'lodash';
import classnames from 'classnames';
import axios from 'axios';
import moment from 'moment';

import SidebarMenu from '../components/menu/sidebar';
import MenuLink from '../components/menu/link';
import ContentSegment from '../components/contentSegment';

export default class Home extends React.Component {
	static route = '/';
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
		},
		users: []
	};

	componentDidMount() {
		this.getUsers();
	}

	getUsers = () =>
		axios.get('/api/user')
			.then(res => res.data)
			.then(users => {
				this.setState({...this.state, users})
			});

	createUser = () =>
		this.getUserData()
			.then(data => axios.post('/api/user', data))
			.then(res => res.data)
			.then(user => this.setState({...this.state, users: this.state.users.concat(user)}));
	
	deleteUser = uuid =>
		axios.delete(`/api/user/${uuid}`)
			.then(() => this.getUsers());
	
	deleteUsers = () =>
		axios.delete('/api/user')
			.then(() => this.setState({...this.state, users: []}));

	getUserData = () =>
		axios.get('https://randomuser.me/api')
			.then(res => res.data)
			.then(data => {
				let user = data.results[0];
				return {
					name: user.name.first + ' ' + user.name.last,
					email: user.email,
					password: user.login.password,
					img: user.picture.large,
					registered: user.registered,
					phone: user.phone,
					nat: user.nat.toLowerCase()
				}
			});

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
					to: route.component.route, text: route.component.linkText, icon: route.component.linkIcon
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
							<div className="row"><h1>Users: {this.state.users.length}</h1></div>
							<div className="row">
								<button className="ui huge primary button" onClick={this.createUser}>Add User</button>
								<button className="ui huge primary button" onClick={this.deleteUsers}>Delete Users</button>
							</div>
							<div className="row">
								<div className="ui four cards" style={{width:'100%'}}>
									{_.map(this.state.users, user =>
										<div className="ui link card" key={user.uuid}>
											<div className="image">
												<img src={user.img}/>
											</div>
											<div className="content">
												<div className="header">{user.name}</div>
												<div className="meta">
													Joined {moment([2016 - Math.round(Math.random() * 6), Math.round(Math.random() * 12)]).format('MMM YYYY')}</div>
												<i className={classnames(user.nat, 'flag', 'right floated')}/>
											</div>
											<div className="extra content">
												<a><span className="">{user.email}</span></a>
												< className="right floated close large icon"
												   onClick={this.deleteUser.bind(null, user.uuid)}/>
											</div>
										</div>
									)}
								</div>
							</div>
						</ContentSegment>

					</div>

				</div>
			</div>
		);
	}
}
