export const setData = fetchedData => {
  return {
    type: 'SET_DATA',
    payload: fetchedData,
  };
};

export const setFirstBike = data => {
  return {
    type: 'FIRST_BIKE',
    payload: data,
  };
};

export const setSecondBike = data => {
  return {
    type: 'SECOND_BIKE',
    payload: data,
  };
};
