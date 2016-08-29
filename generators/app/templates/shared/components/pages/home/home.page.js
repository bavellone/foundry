/*eslint-env browser*/
'use strict';

import React, {PropTypes} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';

import Dropdown from '../../dropdown.component';
import Form from '../../form.component';
import Pipeline from '../../pipeline.component';

import {addOperation, removeOperation, listImages, addImage, removeImage, clearAll} from '../../../redux'

class Home extends React.Component {
  static propTypes = {
    form: PropTypes.object
  }
  
  static fetchData({dispatch}) {
    return dispatch(listImages());
  }
  
  static mapStateToProps(state) {
    return {
      image: state.image.image,
      images: state.image.images,
      pipeline: state.image.pipeline,
      operations: state.image.operations,
      error: state.image.error
    }
  }
  
  static mapDispatchToProps(dispatch) {
    return {
      addOperation: operation => dispatch(addOperation(operation)),
      removeOperation: operation => dispatch(removeOperation(operation)),
      addImage: image => dispatch(addImage(image)),
      removeImage: image => dispatch(removeImage(image)),
      clearAll: () => dispatch(clearAll())
    }
  }
  
	componentDidMount() {
		// this.getUsers();
	}
  
  loadImage = (e) => {
    let file;
    let imageType = /^image\//;
    e.preventDefault();
    if (e.dataTransfer)
      file = e.dataTransfer.files[0];
    else
      file = e.target.files[0];
    
    if (!imageType.test(file.type)) {
      console.error('Not an image')
      return
    }
    
    let reader = new FileReader();
    reader.onload = e => this.props.addImage({
        name: file.name,
        size: file.size,
        dataURI: e.target.result
      });
    reader.readAsDataURL(file);
  }
  
  addImage = (name, dataURI, size) => {
    this.props.addImage({
      dataURI,
      name,
      size
    })
  }
  
  addOperation = () => {
    if (this.data.operation && this.data.option) {
      const data = {
        type: this.data.operation.id,
        name: this.data.operation.text,
        option: this.data.option
      };
      this.props.addOperation(data)
    }
  }
  
  removeOperation = item => {
    this.props.removeOperation(item)
  }
  
  get data() {
    return this.props.form.data;
  }
      
  get optionText() {
    return this.data.operation ?
      this.data.operation.optionName :
      'Option'
  }
  
  get operation() {
    return this.data.operation ?
      this.data.operation :
      {}
  }

	render() {
		return (
			<div className="view home" onDragOver={(e) => e.preventDefault() && false} onDrop={this.loadImage}>
        <Helmet title='Home'/>

        <div id="toolbar">
          <div className='toolbar-row'>
            <div className="ui items">
              {this.props.images.map(image => 
                <div className="item" key={image.uuid}>
                  <div className="content">
                    <a href="#" className="header">{image.name}</a>
                    <div className="meta"><span>{image.size / 1024}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='spacious toolbar-row'>
            <input type="file" hidden ref={r => this.fileInput = r}
            onChange={this.loadImage}
            />
            <button className="ui button load" onClick={e => this.fileInput.click(e)}>
              <span><i className='ui image icon'></i></span>
              Load Image 2
            </button>

            <button className="ui button clear" onClick={this.props.clearAll}>
              <span><i className="ui trash icon"></i></span>
              Clear 
            </button>
          </div>
        </div>
				<div id="workspace">
          <div id="transformations">
            <div className="controls ui segment">
              <div className="ui top attached label">
                Tools
              </div>
              <form className="ui form" onSubmit={e => e.preventDefault() || this.addOperation()}>
                <div className="field">
                  <label>Operations</label>
                  <Dropdown 
                  items={this.props.operations}
                  selectDropdown
                  returnItem
                  onChange={this.props.form.update('operation')}
                  />
                </div>
                <div className="field">
                  <label>{this.optionText}</label>
                  <div className="field">
                    <input type="number" onChange={this.props.form.update('option')}  {...this.operation.optionProps}/>
                  </div>
                </div>
                <div className="ui fluid positive button" onClick={this.addOperation}>Add Operation</div>
              </form>

            </div>
            <Pipeline pipeline={this.props.pipeline} operations={this.props.operations}
            onDelete={this.removeOperation}
            />
          </div>
          <div id="image-container">
            <div>
              <h1>{this.props.image.name}</h1>
              <img src={this.props.image.dataURI} alt={this.props.image.name}/>
            </div>
          </div>

        </div>

		</div>
    );
	}
}

let App = connect(
  Home.mapStateToProps,
  Home.mapDispatchToProps
)(Form(Home));

App.route = Home.route;
App.linkText = Home.linkText;
App.linkIcon = Home.linkIcon;

export default App;
