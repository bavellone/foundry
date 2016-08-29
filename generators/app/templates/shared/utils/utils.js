import React from 'react';

export default function connectDataFetchers(Component, actionCreators) {
  return class DataFetcherWrapper extends React.Component {
    static fetchData(dispatch, params = {}, query = {}) {
      return Promise.all(
        actionCreators.map( actionCreator =>
          dispatch( actionCreator(params, query) )
        )
      );
    }

    componentDidMount() {
      DataFetcherWrapper.fetchData(
        this.props.dispatch,
        this.props.params,
        this.props.location.query
      );
    }

    render() {
      return (
        <Component {...this.props} />
      );
    }
  };
}

export function fetchComponentsData({ dispatch, components, params, query }) {
  const promises = components.map(current => {
    const component = current.WrappedComponent ? current.WrappedComponent : current;
    return component.fetchData
      ? component.fetchData({ dispatch, params, query })
      : null;
  });
  
  return Promise.all(promises);
}

export function createAction(type, payload) {
  return {
    type,
    payload
  }
}

export function createAPIAction(types, apiCall, payload) {
  return {
    type: 'API_CALL',
    types,
    apiCall,
    payload
  }
}
