/*eslint-env browser*/
'use strict';

import React from 'react';
import classnames from 'classnames';

export default class Pipeline extends React.Component {
  static defaultProps = {
    pipeline: [],
    operations: [],
    onDelete: () => {}
  };
  state = {
    deleting: [],
    deleteTimeout: undefined
  }
  
  componentWillUnmount() {
    clearTimeout(this.state.deleteTimeout)
  }
  
  onDelete = item => {
    return () => {
      this.setState({
        deleting: this.state.deleting.concat(item),
        deleteTimeout: setTimeout(() => this.removeItem(item),300)
      });
    }
  }
  
  removeItem = item => {
    this.setState({
      ...this.state,
      deleting: this.state.deleting.filter(i => i != item)
    }, () => {
      this.props.onDelete(item);
    })
  }

	render() {
		return (
      <div className="ui segment">
        <div className="ui top attached label">
          Pipeline
        </div>
        <div className="ui cards">
          {this.props.pipeline.map(item => {
            let operation = this.props.operations
            .find(i => i.id == item.type);

            return (
              <div 
                className={classnames("ui fluid card", {deleting: this.state.deleting.indexOf(item) !== -1})}
                key={item.id}
              >
                <div className="extra content">
                  <span className="left floated">
                    <i className="angle up icon"></i>
                    <i className="angle down icon"></i>
                  </span>
                  <span className="right floated">
                    <i className="red trash icon"
                    onClick={this.onDelete(item)}
                    ></i>
                  </span>
                </div>
                <div className="content">
                  <div className="header">
                    {operation.text}
                  </div>
                  <div className="meta">
                    {operation.optionName}: {item.option}
                  </div>
                </div>
              </div>
            )
        }
        )}
      </div>
      </div>
		)
	}	
}
