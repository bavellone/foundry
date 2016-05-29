/*eslint-env browser*/
'use strict';

import React from 'react';
import validate from '../../../../common/validate';
import q from 'q';
import _ from 'lodash';

export default function Form(Component, constraints, formOps) {
	return class Form extends React.Component {
		constructor(props) {
			super(props)
		}

		state = {
			formData: {},
			err: {
				fields: [],
				messages: []
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

		_updateForm = (key, ops) => {
			ops = _.merge({
				checkbox: false
			}, ops);

			return (event) => {
				const val = (event.target ? (ops.checkbox ? event.target.checked : event.target.value) : event);

				this.setState({
					...this.state,
					formData: {
						[key]: val
					}
				});

				if (formOps.realtime)
					this._submit();
				else
					this.setState({
						...this.state,
						err: {
							fields: _.filter(this.state.err.fields, field => field != key),
							messages: this.state.err.messages
						}
					})
			}
		};

		_submit = (data) => {
			return Form._validate(data || this.state.formData, constraints)
				.then(this._onValidate, this._onValidateErr);
		};

		_onValidate = (data) => {
			this.setState({
				...this.state,
				err: {
					fields: [],
					messages: []
				}
			});
			return data;
		};

		_onValidateErr = (err) => {
			this.setState({...this.state, err});
			return q.reject(err);
		};

		_hasError = (field) => {
			return _.includes(this.state.err.fields, field)
		};

		_getErrors = () => {
			return this.state.err.messages;
		};

		_setError = (err) => {
			this.setState({
				...this.state,
				err: {
					fields: this.state.fields,
					messages: this.state.err.messages.concat(err)
				}
			})
		};

		_clearError = (err) => {
			this.setState({
				...this.state,
				err: {
					fields: this.state.fields,
					messages: _.remove(this.state.messages, msg => msg == err)
				}
			})
		};

		render() {
			return (<Component
				form={{
					update: this._updateForm,
					validate: Form._validate,
					submit: this._submit,
					hasError: this._hasError,
					errors: this._getErrors,
					setError: this._setError,
					clearError: this._clearError
				}}
				{...this.props}
			/>)
		}
	}
}
