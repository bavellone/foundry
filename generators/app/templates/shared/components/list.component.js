/*eslint-env browser*/
'use strict';

import React from 'react';
import _ from 'lodash';

export default function List(Component) {
	return class List extends React.Component {
		state = {
			page: 1
		};

		static defaultProps = {
			pagination: 10
		};

		_paginateItems = (items) => {
			return _.slice(items, 
				(this.state.page - 1) * this.props.pagination,
				(this.state.page - 1) * this.props.pagination + this.props.pagination)
		};

		_setPage = (page, numItems) => {
			if (page > 0 && page <= (numItems / this.props.pagination) + 1)
				this.setState({page});
		};

		_decPage = numItems =>
			this._setPage(this.state.page - 1, numItems);

		_incPage = numItems =>
			this._setPage(this.state.page + 1, numItems);
		
		render() {
			return (
				<Component 
				page={this.state.page}
				setPage={this._setPage}
				paginateItems={this._paginateItems} 
				incPage={this._incPage}
				decPage={this._decPage}
				{...this.props}/>
			)
		}
		
	}
}
