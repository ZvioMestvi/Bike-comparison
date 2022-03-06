import { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setData, setFirstBike, setSecondBike } from './store/actions';
import './App.scss';
import ChooseBike from './components/ChooseBike';
import SelectedBike from './components/SelectedBike';

const App = () => {
  const dispatch = useDispatch();
  const store = useSelector(store => store);
  const [firstBikeModalVis, setFirstBikeModalVis] = useState(false);
  const [secondBikeModalVis, setSecondBikeModalVis] = useState(false);

  const showFirstBikeModal = () => {
    setFirstBikeModalVis(true);
  };

  const showSecondBikeModal = () => {
    setSecondBikeModalVis(true);
  };

  const closeModal = () => {
    setFirstBikeModalVis(false);
    setSecondBikeModalVis(false);
  };

  const firstBikeStorageShortcut = Object.keys(
    JSON.parse(localStorage.getItem('firstSelectedBike'))
  );

  const secondBikeStorageShortcut = Object.keys(
    JSON.parse(localStorage.getItem('secondSelectedBike'))
  );

  useEffect(() => {
    // Get items from local storage when website loads.
    if (firstBikeStorageShortcut.length !== 0) {
      dispatch(
        setFirstBike(JSON.parse(localStorage.getItem('firstSelectedBike')))
      );
    }

    if (secondBikeStorageShortcut.length !== 0) {
      dispatch(
        setSecondBike(JSON.parse(localStorage.getItem('secondSelectedBike')))
      );
    }

    const getData = (async () => {
      const response = await fetch(
        'https://bike-comparison-8bd3b-default-rtdb.europe-west1.firebasedatabase.app/data.json'
      );
      const data = await response.json();
      dispatch(setData(data));
    })();
  }, []);

  useEffect(() => {
    // Set items to local storage when chosen bike changes.
    localStorage.setItem('firstSelectedBike', JSON.stringify(store.firstBike));
    localStorage.setItem(
      'secondSelectedBike',
      JSON.stringify(store.secondBike)
    );
  }, [store.firstBike, store.secondBike]);

  return (
    <Fragment>
      {firstBikeModalVis && (
        <ChooseBike bikeSlot="1" modalVis={setFirstBikeModalVis} />
      )}
      {secondBikeModalVis && (
        <ChooseBike bikeSlot="2" modalVis={setSecondBikeModalVis} />
      )}

      <div className="header-container">
        <h1>Bikes Comparison</h1>
        <p>
          This is a simple website where you can compare two motorbike's stats.
          <br />
          Made by Zvio Mestvi for portfolio.
        </p>
      </div>

      <div className="comparison-container">
        {Object.keys(store.firstBike).length === 0 ? (
          <div className="bike-container" onClick={showFirstBikeModal}>
            <p>Choose bike to compare +</p>
          </div>
        ) : (
          <SelectedBike bikeData={store.firstBike} bikeSlot="1" />
        )}

        {Object.keys(store.secondBike).length === 0 ? (
          <div className="bike-container" onClick={showSecondBikeModal}>
            <p>Choose bike to compare +</p>
          </div>
        ) : (
          <SelectedBike bikeData={store.secondBike} bikeSlot="2" />
        )}
      </div>

      {(firstBikeModalVis || secondBikeModalVis) && (
        <div className="overlay" onClick={closeModal} />
      )}
    </Fragment>
  );
};

export default App;
