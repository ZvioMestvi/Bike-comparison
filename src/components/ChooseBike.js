import { Fragment, useState, useRef, useEffect } from 'react';
import { setFirstBike, setSecondBike } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ChooseBike.module.css';

const ChooseBike = props => {
  const brandListEl = useRef();
  const store = useSelector(store => store);
  const dispatch = useDispatch();
  const [brandListVis, setBrandListVis] = useState(false);
  const [modelListVis, setModelListVis] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedModel, setSelectedModel] = useState();

  const openBrandList = () => {
    setBrandListVis(true);
    setModelListVis(false);
  };

  const openModelList = () => {
    setModelListVis(true);
    setBrandListVis(false);
  };

  const select = (value, key) => {
    if (value === 'brand') setSelectedBrand(key.toLowerCase());
    if (value === 'model') setSelectedModel(key.toLowerCase());
    setBrandListVis(false);
    setModelListVis(false);
  };

  const selectBike = () => {
    if ((selectedBrand || selectedModel) === '') return;

    const selectedBike = {
      brand: selectedBrand,
      model: store.bikes[selectedBrand][selectedModel].model,
      engine: store.bikes[selectedBrand][selectedModel].engine,
      horsepower: store.bikes[selectedBrand][selectedModel].horsepower,
      price: store.bikes[selectedBrand][selectedModel].price,
      rpm: store.bikes[selectedBrand][selectedModel].rpm,
      torque: store.bikes[selectedBrand][selectedModel].torque,
      thumbnail: store.bikes[selectedBrand][selectedModel].thumbnail,
      weight: store.bikes[selectedBrand][selectedModel].weight,
    };

    if (props.whichBike === '1') dispatch(setFirstBike(selectedBike));
    if (props.whichBike === '2') dispatch(setSecondBike(selectedBike));
    props.vis(false);
  };

  const bikeBrands = [];
  const bikeModels = [];
  const getBrands = (() => {
    for (const key in store.bikes) {
      bikeBrands.push(
        <li key={key} onClick={select.bind(null, 'brand', key)}>
          <p>{key}</p>
        </li>
      );
    }

    for (const key in store.bikes[selectedBrand]) {
      bikeModels.push(
        <li key={key} onClick={select.bind(null, 'model', key)}>
          <p>{key}</p>
        </li>
      );
    }
  })();

  useEffect(() => {
    const handler = event => {
      if (!brandListEl.current.contains(event.target)) {
        setBrandListVis(false);
        setModelListVis(false);
      }
    };
    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, []);

  return (
    <Fragment>
      <div className={classes.mainContainer}>
        <div className={classes.imagesContainer}>
          <div className={classes.images} />
          <p>Select bike to compare</p>
        </div>
        <div>
          <form className={classes.form} ref={brandListEl} autoComplete="off">
            <button
              type="button"
              className={classes.selectedBike}
              onClick={openBrandList}
            >
              {selectedBrand ? selectedBrand : 'Select brand...'}
            </button>
            {brandListVis && (
              <div className={classes.brandList}>
                <label />
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  placeholder="Search"
                />
                <ul>{bikeBrands}</ul>
              </div>
            )}

            <button
              type="button"
              className={classes.selectedBike}
              onClick={openModelList}
            >
              {selectedModel ? selectedModel : 'Select model...'}
            </button>
            {modelListVis && (
              <div className={classes.modelList}>
                <label />
                <input
                  type="text"
                  id="model"
                  name="model"
                  placeholder="Search"
                />
                <ul>{bikeModels}</ul>
              </div>
            )}
          </form>
        </div>

        <div className={classes.btnsContainer}>
          <button onClick={props.vis.bind(null, false)}>Cancel</button>
          <button onClick={selectBike} id={classes.selectBtn}>
            Select
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ChooseBike;
