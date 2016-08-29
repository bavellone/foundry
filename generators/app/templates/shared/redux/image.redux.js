import {createAction, createAPIAction} from '../utils';
import {ImageSchema} from '../schemas'

/**
 * Constants
 */
export const OPERATION_ADD = 'IMAGE/OPERATION/ADD';
export const OPERATION_REMOVE = 'IMAGE/OPERATION/REMOVE';

export const IMAGE_LIST = 'IMAGE/LIST';
export const IMAGE_LIST_REQUEST = 'IMAGE/LIST/REQUEST';
export const IMAGE_LIST_SUCCESS = 'IMAGE/LIST/SUCCESS';
export const IMAGE_LIST_FAILURE = 'IMAGE/LIST/FAILURE';

export const IMAGE_ADD = 'IMAGE/ADD';
export const IMAGE_ADD_REQUEST = 'IMAGE/ADD/REQUEST';
export const IMAGE_ADD_SUCCESS = 'IMAGE/ADD/SUCCESS';
export const IMAGE_ADD_FAILURE = 'IMAGE/ADD/FAILURE';

export const IMAGE_REMOVE = 'IMAGE/REMOVE';

export const CLEAR_ALL = 'IMAGE/CLEAR_ALL';
export const CLEAR_ALL_REQUEST = 'IMAGE/CLEAR_ALL/REQUEST';
export const CLEAR_ALL_SUCCESS = 'IMAGE/CLEAR_ALL/SUCCESS';
export const CLEAR_ALL_FAILURE = 'IMAGE/CLEAR_ALL/FAILURE';


/**
 * Reducer
 */
export default function reducer(state = {
  operations: [
    {id: 'avg', text: 'Blur', optionName: 'Radius', optionProps: {min:0}},
    {id: 'der', text: 'Derivative', optionName: 'Radius', optionProps: {min:0}},
    {id: 'lap', text: 'Laplacian', optionName: 'Neighbors', optionProps: {step:4, min:4, max:8}},
    {id: 'thresh', text: 'Threshold', optionName: 'Threshold', optionProps: {min:0, max:255}}
  ],
  pipeline: [],
  image: {},
  images: []
}, action) {
  return ({
    [OPERATION_ADD]: (state, transform) => ({
      ...state,
      pipeline: state.pipeline.concat(transform)
    }),
    [OPERATION_REMOVE]: (state, transform) => ({
      ...state,
      pipeline: state.pipeline.filter(t => t != transform)
    }),
    [IMAGE_LIST_SUCCESS]: (state, images) => ({
      ...state,
      images
    }),
    [IMAGE_ADD_SUCCESS]: (state, image) => ({
      ...state,
      image,
      images: state.images.concat(image)
    }),
    [IMAGE_ADD_FAILURE]: (state, error) => ({
      ...state,
      error
    }),
    [IMAGE_REMOVE]: state => ({
      ...state,
      image: {}
    }),
    [CLEAR_ALL]: state => ({
      ...state,
      image: {},
      pipeline: [],
      images: []
    })
  }[action.type] || (state => state))(state, action.error || action.payload)
}


/**
 * Actions
 */
export function addOperation(operation) {
  return dispatch => 
    dispatch(createAction(OPERATION_ADD, operation))
}

export function removeOperation(operation) {
  return dispatch => 
    dispatch(createAction(OPERATION_REMOVE, operation))
}

export function listImages() {
  return dispatch => 
    dispatch(createAPIAction(
      [IMAGE_LIST_REQUEST, IMAGE_LIST_SUCCESS, IMAGE_LIST_FAILURE], 
      api => api.Image.list()
    ))
}

export function addImage(image) {
  return dispatch => 
    dispatch(createAPIAction(
      [IMAGE_ADD_REQUEST, IMAGE_ADD_SUCCESS, IMAGE_ADD_FAILURE], 
      api => api.Image.create(
        ImageSchema.sanitize(image, ImageSchema.constraints)
      ),
      image
    ))
}

export function removeImage() {
  return dispatch => 
    dispatch(createAction(IMAGE_REMOVE))
}

export function clearAll() {
  return dispatch => 
    dispatch(createAPIAction(
      [CLEAR_ALL_REQUEST, CLEAR_ALL_SUCCESS, CLEAR_ALL_FAILURE],
      api => api.Image.destroyAll()
    ))
}
