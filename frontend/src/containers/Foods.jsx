import React, { Fragment, useEffect,useReducer } from 'react';


//reducers
import {
  initialState as foodsInitialState,
  foodsActionTyps,
  foodsReducer,
} from '../reducers/foods';


//api
import { fetchFoods } from '../apis/foods'


//constats
import { REQUEST_STATE } from '../constants';


export const Foods = ({ match }) => {

  const[foodsState,dispatch]=useReducer(foodsReducer,foodsInitialState)


  //useEffect
  useEffect(() => {
    dispatch({ type: foodsActionTyps.FETCHING });
    fetchFoods(match.params.restaurantsId)
      .then((data) => {
        dispatch({
          type: foodsActionTyps.FETCH_SUCCESS,
          payload: {
            foods: data.foods
          }
        });
      })
  }, [])
  return (
    <Fragment>
      {foodsState.fetchState === REQUEST_STATE.LOADING ?
        <Fragment>
          <p>
            ロード中...
          </p>
        </Fragment>
        :
        foodsState.foodsList.map(food =>
          <div key={food.id}>
            {food.name}
          </div>
        )
      }
      </Fragment>
  )
}