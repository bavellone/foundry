/*eslint-env node browser*/

import React from 'react';

// import NavContainer from '../nav/nav';
// import Footer from '../footer/footer';

import DevTools from '../../../redux/devTools';

class App extends React.Component {
	static defaultProps = {};

	state = {};

	render() {
		return (
			<div id="app">
        <DevTools/>
        {/* <NavContainer/> */}
        {this.props.children}
        {/* <Footer/> */}
      </div>
		);
	}
}

export default App;
