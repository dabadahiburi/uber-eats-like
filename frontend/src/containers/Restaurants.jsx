import React, { Fragment,useReducer, useEffect } from 'react';
//style
import styled from 'styled-components';

//react-router-dom
import { Link } from 'react-router-dom';

//components
import Skeleton from '@material-ui/lab/Skeleton';

//apis
import { fetchRestaurants } from '../apis/restaurants';

//reducer
import {
  initialState,
  restaurantsActionTypes,
  restaurantsReducer,
} from '../reducers/restaurants';

//constants
import { REQUEST_STATE } from '../constants';

//images
import MainLogo from '../images/logo.png';
import MainCoverImage from '../images/main-cover-image.png';
import RestaurantsImage from '../images/restaurant-image.jpg';
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

const RestaurantsContentsList = styled.div
  `display: flex;
  justify-content: space-around;
  margin-bottom: 150px;`;

const RestaurantsContentWrapper = styled.div
  `width: 450px;
  height: 300px;
  padding: 48px;`;

const RestaurantsImageNode = styled.img
  `width: 100%;`;

const MainText = styled.p
  `color: black;
  font-size: 18px;`;

const SubText = styled.p
  `cokor: black;
  font-size: 12px;`;


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
      <RestaurantsContentsList>
        {
          state.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              <Skeleton cariant="rect" width={450} height={300} />
              <Skeleton cariant="rect" width={450} height={300} />
              <Skeleton cariant="rect" width={450} height={300} />
            </Fragment>
            :
            state.restaurantsList.map((item, index) =>
              <Link to={`/restaurants/${item.id}/foods`} key={index} style={{ textDecoration: 'none' }}>
                <RestaurantsContentWrapper>
                  <RestaurantsImageNode src={RestaurantsImage} />
                  <MainText>{item.name}</MainText>
                  <SubText>{`配送料:${item.fee}円　${item.time_required}分`} </SubText>
                </RestaurantsContentWrapper>
            </Link>
            )
        }
      </RestaurantsContentsList>
    </Fragment>
  )
}