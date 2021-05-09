import React, { Fragment,useReducer, useEffect } from 'react';
//style
import styled from 'styled-components';

//apis
import { fetchRestaurants } from '../apis/restaurants';

//reducer
import {
  initialState,
  restaurantsActionTypes,
  restaurantsReducer,
} from '../reducers/restaurants';


//images
import MainLogo from '../images/logo.png';
import MainCoverImage from '../images/main-cover-image.png';

//style setting
const HeaderWrapper = styled.div
  `display:flex;
  justyfy-content: flex-start;
  padding: 8px 32px;`;

const MainLogoImage = styled.img
  `height: 90px;`

const MainCoverImageWrapper = styled.div
  `text-allign: cover;`;

const MainCover = styled.img
  `geight:600px;`;



  //main
export const Restaurants = () => {
  // <api>
  const [state, dispatch] = useReducer(restaurantsReducer, initialState);

  useEffect(() => {
    dispatch({ type: restaurantsActionTypes.FETCHING });
    fetchRestaurants()
      .then((data) =>
        dispatch({
          type: restaurantsActionTypes.FETCH_SUCCESS,
          payload: {
            restaurants: data.restaurants
          }
        })
      )
  }, [])
  // </api>
  return (
    <Fragment>
      <HeaderWrapper>
        <MainLogoImage src={MainLogo} alt='main logo'/>
      </HeaderWrapper>
      <MainCoverImageWrapper>
        <MainCover src={MainCoverImage} alt='main cover'/>
      </MainCoverImageWrapper>
      レストラン一覧
      {
        state.restaurantsList.map(restaurant =>
        <div key={restaurant.id}>
          {restaurant.name}
        </div>
        )
      }
    </Fragment>
  )
}