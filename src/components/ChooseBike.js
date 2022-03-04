import { Fragment, useState, useRef, useEffect } from 'react';
import { setFirstBike, setSecondBike } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ChooseBike.module.css';

const ChooseBike = props => {
  const brandListEl = useRef();
  const dispatch = useDispatch();
  const store = useSelector(store => store);
  const [brandListVis, setBrandListVis] = useState(false);
  const [modelListVis, setModelListVis] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [searchInput, setSearchInput] = useState('');
  const [optionsNotSelected, setOptionsNotSelected] = useState(false);

  const openBrandList = () => {
    setBrandListVis(true);
    setModelListVis(false);
  };

  const openModelList = () => {
    setModelListVis(true);
    setBrandListVis(false);
  };

  const select = (value, key) => {
    if (value === 'brand' && selectedBrand !== undefined) {
      setSelectedBrand(key.toLowerCase());
      setSelectedModel(undefined);
    } else if (value === 'brand' && selectedBrand === undefined) {
      setSelectedBrand(key.toLowerCase());
    }

    if (value === 'model') setSelectedModel(key);
    setBrandListVis(false);
    setModelListVis(false);
  };

  const selectBike = () => {
    if (selectedBrand === undefined) setOptionsNotSelected(true);
    if (selectedModel === undefined) setOptionsNotSelected(true);

    const selectedBike = {
      brand: selectedBrand,
      model: selectedModel,
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
          <div className={classes.images}>
            {selectedBrand !== undefined && !selectedModel ? (
              <img src={store.logos[selectedBrand]} alt="brand logo" />
            ) : (
              ''
            )}

            {selectedModel !== undefined ? (
              <img
                src={store.bikes[selectedBrand][selectedModel]?.thumbnail}
                alt="bike model"
              />
            ) : (
              ''
            )}
          </div>
          {selectedBrand === undefined ? <p>Select bike to compare</p> : ''}
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
                  onChange={e => {
                    setSearchInput(e.target.value);
                  }}
                />
                <ul>
                  {bikeBrands.filter(brand => {
                    if (searchInput === '') return brand;
                    if (
                      brand.key
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                    )
                      return brand;
                  })}
                </ul>
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
                {selectedBrand === undefined ? (
                  <p className={classes.noBrandErrorText}>
                    Choose brand first...
                  </p>
                ) : (
                  <Fragment>
                    <label />
                    <input
                      type="text"
                      id="model"
                      name="model"
                      placeholder="Search"
                      onChange={e => {
                        setSearchInput(e.target.value);
                      }}
                    />
                    <ul>
                      {bikeModels.filter(model => {
                        if (searchInput === '') return model;
                        if (
                          model.key
                            .toLowerCase()
                            .includes(searchInput.toLowerCase())
                        )
                          return model;
                      })}
                    </ul>
                  </Fragment>
                )}
              </div>
            )}
          </form>
        </div>

        {optionsNotSelected && (
          <p className={classes.noBikeModelErrorText}>
            Please select all options!
          </p>
        )}

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
