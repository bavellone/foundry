/*eslint-env browser*/
'use strict';

import React from 'react';
import validate from '../../../../common/validate';
import q from 'q';
import _ from 'lodash';

export default function Form(Component, constraints) {
	return class Form extends React.Component {
		constructor(props) {
			super(props)
		}

		state = {
			err: {
				fields: [],
				messages: []
			}
		};
		
		// TODO - let _updateForm update the formData prop
		_updateState = (child, key, checkbox = false) => {
			return (event) => {
				const val = (event.target ? (checkbox ? event.target.checked : event.target.value) : event);

				child.setState(_.merge({}, child.state, {
					formData: {
						[key]: val
					}
				}));

				this.setState({
					err: {
						fields: _.filter(this.state.err.fields, field => field != key),
						messages: this.state.err.messages
					}
				})
			}
		};
		
		
		_updateForm = (child, key, checkbox = false) => {
			return (event) => {
				const val = (event.target ? (checkbox ? event.target.checked : event.target.value) : event);

				child.setState(_.merge({}, child.state, {
					formData: {
						[key]: val
					}
				}));

				this.setState({
					err: {
						fields: _.filter(this.state.err.fields, field => field != key),
						messages: this.state.err.messages
					}
				})
			}
		};

		static _validate = (data = {}, constraints = {}, ops = {}) => {
			const err = validate(data, constraints, ops);
			if (err) {
				let fields = _.keys(err),
					messages = _.reduce(err, (msgs, e) => {
						return msgs.concat(e);
					}, []);

				return q.reject({fields, messages});
			}

			else
				return q.resolve(data);
		};

		_submit = (child, data) => {
			return Form._validate(data || child.state.formData, constraints)
				.then(this._onValidate, this._onValidateErr);
		};
		
		_onValidate = (data) => {
			this.setState({
				err: {
					fields: [],
					messages: []
				}
			});
			return data;
		}
		
		_onValidateErr = (err) => {
			this.setState({err});
			return q.reject(err);
		}

		_hasError = (field) => {
			return _.includes(this.state.err.fields, field)
		};

		_getErrors = () => {
			return this.state.err.messages;
		};

		_setError = function (err) {
			this.setState({
				err: {
					fields: this.state.fields,
					messages: this.state.err.messages.concat(err)
				}
			})
		};

		_clearError = (err) => {
			this.setState({
				err: {
					fields: this.state.fields,
					messages: _.remove(this.state.messages, msg => msg == err)
				}
			})
		};

		render() {
			return (<Component
				updateState={this._updateState}
				validate={this._validate}
				submit={this._submit}
				hasError={this._hasError}
				errors={this._getErrors()}
				setError={::this._setError}
				clearError={this._clearError}
				{...this.props}
			/>)
		}
	}
}
