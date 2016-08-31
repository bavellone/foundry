/*eslint-env browser*/

import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';

// import Dropdown from '../../dropdown.component';
// import Form from '../../form.component';

// import {} from '../../../redux'

export class NavContainer extends React.Component {
  static propTypes = {
    // form: PropTypes.object
  }
  
  static mapStateToProps(state) {
    return {
      router: state.routing
    }
  }
  
  static mapDispatchToProps(dispatch) {
    return {
      // pageLoad: page => dispatch(pageLoad(page))
    }
  }
  
	render() {
		return (
        <div className='ui fixed stackable menu'>
          <div className="ui nav container">
            <a className='header item' href='/'>
              <img src="/assets/logo.png" alt="Logo" className="logo"/>
              <%= appName %>
            </a>
            <div className="ui simple dropdown item">
            Dropdown <i className="dropdown icon"></i>
            <div className="menu">
              <div className="header">Header</div>
              <a className="item" href="#">Page 1</a>
              <a className="item" href="#">Page 2</a>
              <div className="divider"></div>
              <div className="header">Header</div>
              <a className="item" href="#">Page 1</a>
              <a className="item" href="#">Page 2</a>
            </div>
          </div>
            <a className='item' href='#'>
              Link
            </a>
            <a className='item' href='#'>
              Link
            </a>
          </div>
        </div>
    );
	}
}

let App = connect(
  NavContainer.mapStateToProps,
  NavContainer.mapDispatchToProps
)(NavContainer);


export default App;
