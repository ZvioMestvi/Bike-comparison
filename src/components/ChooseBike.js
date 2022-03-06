import { Fragment, useState, useRef, useEffect } from 'react';
import { setFirstBike, setSecondBike } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import classes from './ChooseBike.module.scss';

const ChooseBike = props => {
  const brandListEl = useRef();
  const dispatch = useDispatch();
  const store = useSelector(store => store);
  const [brandOptionsVis, setBrandOptionsVis] = useState(false);
  const [modelOptionsVis, setModelOptionsVis] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [brandSearchInput, setBrandSearchInput] = useState('');
  const [modelSearchInput, setModelSearchInput] = useState('');
  const [optionsNotSelected, setOptionsNotSelected] = useState(false);

  const openBrandList = () => {
    setBrandOptionsVis(true);
    setModelOptionsVis(false);
  };

  const openModelList = () => {
    setModelOptionsVis(true);
    setBrandOptionsVis(false);
  };

  const selectOption = (optionsType, key) => {
    if (optionsType === 'brand' && selectedBrand !== undefined) {
      setSelectedBrand(key.toLowerCase());
      setSelectedModel(undefined);
    } else if (optionsType === 'brand' && selectedBrand === undefined) {
      setSelectedBrand(key.toLowerCase());
    }

    if (optionsType === 'model') setSelectedModel(key);
    setBrandOptionsVis(false);
    setModelOptionsVis(false);

    setBrandSearchInput('');
    setModelSearchInput('');
  };

  const selectBike = () => {
    // This prevents error when user selects bike in modal without choosing brand or/and modal.
    if (selectedBrand === undefined || selectedModel === undefined) {
      setOptionsNotSelected(true);
      return;
    }

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

    if (props.bikeSlot === '1') dispatch(setFirstBike(selectedBike));
    if (props.bikeSlot === '2') dispatch(setSecondBike(selectedBike));
    props.modalVis(false);
  };

  const bikeBrands = [];
  const bikeModels = [];
  const getBrands = (() => {
    for (const key in store.bikes) {
      bikeBrands.push(
        <li key={key} onClick={selectOption.bind(null, 'brand', key)}>
          <p>{key}</p>
        </li>
      );
    }

    for (const key in store.bikes[selectedBrand]) {
      bikeModels.push(
        <li key={key} onClick={selectOption.bind(null, 'model', key)}>
          <p>{key}</p>
        </li>
      );
    }
  })();

  useEffect(() => {
    // This is needed to close dropdown list (options menu) of brands and models, when clicked outside of it.
    const closeOptionsMenu = event => {
      if (!brandListEl.current.contains(event.target)) {
        setBrandOptionsVis(false);
        setModelOptionsVis(false);
        setBrandSearchInput('');
        setModelSearchInput('');
      }
    };
    document.addEventListener('mousedown', closeOptionsMenu);

    return () => {
      document.removeEventListener('mousedown', closeOptionsMenu);
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
          <form
            className={classes.form}
            ref={brandListEl}
            onSubmit={e => e.preventDefault()}
            autoComplete="off"
          >
            <button
              type="button"
              className={classes.selectedBike}
              onClick={openBrandList}
            >
              {selectedBrand ? selectedBrand : 'Select brand...'}
            </button>
            {brandOptionsVis && (
              <div className={classes.brandList}>
                <label />
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  placeholder="Search"
                  onChange={e => {
                    setBrandSearchInput(e.target.value);
                  }}
                />
                <ul>
                  {bikeBrands.filter(brand => {
                    if (brandSearchInput === '') return brand;
                    if (
                      brand.key
                        .toLowerCase()
                        .includes(brandSearchInput.toLowerCase())
                    ) {
                      return brand;
                    }
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
            {modelOptionsVis && (
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
                        setModelSearchInput(e.target.value);
                      }}
                    />
                    <ul>
                      {bikeModels.filter(model => {
                        if (modelSearchInput === '') return model;
                        if (
                          model.key
                            .toLowerCase()
                            .includes(modelSearchInput.toLowerCase())
                        ) {
                          return model;
                        }
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
          <button onClick={props.modalVis.bind(null, false)}>Cancel</button>
          <button onClick={selectBike} id={classes.selectBtn}>
            Select
          </button>
        </div>
      </div>
    </Fragment>
  );
};

export default ChooseBike;
