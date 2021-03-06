import { createStore } from 'redux';

const initialState = {
  bikes: [],
  logos: [],
  firstBike: {},
  secondBike: {},
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        bikes: action.payload.bikes,
        logos: action.payload.logos,
      };
    case 'FIRST_BIKE':
      return {
        ...state,
        firstBike: action.payload,
      };
    case 'SECOND_BIKE':
      return {
        ...state,
        secondBike: action.payload,
      };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
