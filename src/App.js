import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from './store/actions';
import './App.scss';
import ChooseBike from './components/ChooseBike';
import SelectedBike from './components/SelectedBike';

const App = () => {
  const store = useSelector(store => store);
  const dispatch = useDispatch();
  const [selectFirstBikeModal, setSelectFirstBikeModal] = useState(false);
  const [selectSecondBikeModal, setSelectSecondBikeModal] = useState(false);

  const showFirstBikeModal = () => {
    setSelectFirstBikeModal(true);
  };

  const showSecondBikeModal = () => {
    setSelectSecondBikeModal(true);
  };

  const closeModal = () => {
    setSelectFirstBikeModal(false);
    setSelectSecondBikeModal(false);
  };

  useEffect(() => {
    fetch(
      'https://bike-comparison-8bd3b-default-rtdb.europe-west1.firebasedatabase.app/bikes.json'
    )
      .then(response => response.json())
      .then(responseData => {
        dispatch(setData(responseData));
      });
  }, []);

  return (
    <Fragment>
      {selectFirstBikeModal && (
        <ChooseBike whichBike="1" vis={setSelectFirstBikeModal} />
      )}
      {selectSecondBikeModal && (
        <ChooseBike whichBike="2" vis={setSelectSecondBikeModal} />
      )}

      <div className="header-container">
        <h1>
          Bikes <br />
          Comparison
        </h1>
      </div>

      <div className="comparison-container">
        {Object.keys(store.firstBike).length === 0 ? (
          <div className="bike-container" onClick={showFirstBikeModal}>
            <p>Choose bike to compare +</p>
          </div>
        ) : (
          <SelectedBike bikeData={store.firstBike} whichBike="1" />
        )}

        {Object.keys(store.secondBike).length === 0 ? (
          <div className="bike-container" onClick={showSecondBikeModal}>
            <p>Choose bike to compare +</p>
          </div>
        ) : (
          <SelectedBike bikeData={store.secondBike} whichBike="2" />
        )}
      </div>

      {(selectFirstBikeModal || selectSecondBikeModal) && (
        <div className="overlay" onClick={closeModal} />
      )}
    </Fragment>
  );
};

export default App;
