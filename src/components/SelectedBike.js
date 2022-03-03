import { useDispatch, useSelector } from 'react-redux';
import { setFirstBike, setSecondBike } from '../store/actions';
import classes from './SelectedBike.module.css';
import xIcon from '../assets/x-icon.svg';

const SelectedBike = props => {
  const dispatch = useDispatch();
  const selectedBike = props.bikeData;

  const clearSelectedBike = () => {
    if (props.whichBike === '1') dispatch(setFirstBike({}));
    if (props.whichBike === '2') dispatch(setSecondBike({}));
  };

  return (
    <div className={classes.mainContainer}>
      <div className={classes.imagesContainer}>
        <div>
          <img
            src={xIcon}
            alt="close button"
            id={classes.closeBtn}
            onClick={clearSelectedBike}
          />
        </div>
        <img src={selectedBike.thumbnail} alt="bike thumbnail" />
      </div>

      <div className={classes.infoContainer}>
        <div>
          <h4>Brand:</h4>
        </div>
        <div>
          <p>{selectedBike.brand}</p>
        </div>
        <div>
          <h4>Model:</h4>
        </div>
        <div>
          <p>{selectedBike.model}</p>
        </div>
        <div>
          <h4>Engine Type:</h4>
        </div>
        <div>
          <p>{`${selectedBike.engine}cc`}</p>
        </div>
        <div>
          <h4>Horsepower:</h4>
        </div>
        <div>
          <p>{selectedBike.horsepower}</p>
        </div>
        <div>
          <h4>Torque:</h4>
        </div>
        <div>
          <p>{`${selectedBike.torque}Nm`}</p>
        </div>
        <div>
          <h4>RPM:</h4>
        </div>
        <div>
          <p>{selectedBike.rpm}</p>
        </div>
        <div>
          <h4>Wet Weight:</h4>
        </div>
        <div>
          <p>{`${selectedBike.weight}Kg`}</p>
        </div>
        <div>
          <h4>Price:</h4>
        </div>
        <div>
          <p>{`$${selectedBike.price}`}</p>
        </div>
      </div>
    </div>
  );
};

export default SelectedBike;
