/*eslint-env browser*/
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default class Dropdown extends React.Component {
	static defaultProps = {
		items: [],
		itemID: 'id',
		itemText: 'text',
		itemVal: null,
		label: 'Select...',
		transition: 'fade up',
		selectDropdown: false,
		allowAdditions: false,
		searchDropdown: false,
		button: false,
    returnItem: false,
		onChange: () => {}
	};

	componentDidMount() {
		$(ReactDOM.findDOMNode(this)).dropdown({
      ...this.props, 
      onChange: this.onChange
    })
	}
  
  onChange = (v) => {
    if (this.props.returnItem)
      v = this.props.items.find(i => this.getItemVal(i) == v)
    this.props.onChange(v);
  }
	
	_classes = () => 
		classnames('ui', this.props.classes, {
			search: this.props.searchDropdown,
			selection: this.props.searchDropdown,
			button: this.props.button
		}, 'dropdown');
  
  getItemVal = item => {
    return item[this.props.itemVal || this.props.itemID]
  }

	render() {
    
		if (this.props.selectDropdown)
			return (
				<select className={this._classes()}>
					<option value="">{this.props.label}</option>
					{this.props.items.map(item => {
						return (<option key={item[this.props.itemID]}
						                value={this.getItemVal(item)}>
                            {item[this.props.itemText]}
                    </option>)
					})}
				</select>
			);
		
		return (
			<div
				className={this._classes()}>
				
				{(this.props.button ? 
					null :
					<div className="text">
						{this.props.label}
					</div>)}
				
				{this.props.selectDropdown ? '' : <i className='dropdown icon'/>}
				
				<div className='menu'>
					{this.props.items.map(item => {
						return <div 
							className='item' 
							key={item[this.props.itemID]}
						  data-value={this.getItemVal(item)}>
							
							{item[this.props.itemText]}
						</div>
					})}
				</div>
				
			</div>
		)
	}
}
