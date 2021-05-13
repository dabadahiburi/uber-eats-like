import React, { Fragment,useReducer, useEffect,useState } from 'react';
import styled from 'styled-components';
import { Link,useHistory } from 'react-router-dom';


//components
import { LocalMallIcon } from '../components/Icons';
import { FoodWrapper } from '../components/FoodWrapper';
import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';
import Skeleton from '@material-ui/lab/Skeleton';


//reducers
import {
  initialState as foodsInitialState,
  foodsActionTyps,
  foodsReducer,
} from '../reducers/foods';


//api
import { fetchFoods } from '../apis/foods';
import { postLineFoods, replaceLineFoods } from '../apis/line_foods';


//image
import MainLogo from '../images/logo.png';
import { FoodOrderDialog } from '../components/FoodOrderDialog';
import FoodImage from '../images/food-image.jpg';

//constats
import { REQUEST_STATE } from '../constants';
import { COLORS } from '../style_constants';
import { HTTP_STATUS_CODE } from '../constants';



const HeaderWrapper = styled.div
  `display: flex;
   justify-content: space-between;
   padding: 8px 32px;`;

const BagIconWrapper = styled.div
  `padding-top: 24px;`;

const ColoredBagIcon = styled(LocalMallIcon)
  `color: ${COLORS.MAIN};`;

const FoodsList = styled.div
  `display: flex;
  justyfy-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;`;

//styleImages
const MainLogoImage = styled.img
  `height: 90px;`;

const ItemWrapper = styled.div
  `margin: 16px;`;



export const Foods = ({
  match
}) => {

  //state
  const initialState = {
    isOpenOrderDialog: false,
    selectedFood: null,
    selectedFoodCount: 1,
    isOpenNewOrderDialog: false,
    existingRestaurantName: '',
    newRestaurantName: '',
  }
  const [state, setState] = useState(initialState);
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  const history = useHistory();



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
  }, []);
//submitOrder
  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingRestaurantName: e.response.data.existing_restaurant,
            newRestaurantName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
      })
  };


  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
  };


  return (
    <Fragment>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <Fragment>
              {
                [...Array(12).keys()].map(i =>
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </Fragment>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={
                    (food) => setState({
                    ...state,
                    isOpenOrderDialog: true,
                    selectedFood: food,
                    })
                  }
                  imageUrl={FoodImage}
                />
              </ItemWrapper>
            )
        }
      </FoodsList>
      {
        state.isOpenOrderDialog &&
        <FoodOrderDialog
        isOpen={state.isOpenOrderDialog}
        food={state.selectedFood}
        countNumber={state.selectedFoodCount}
        onClickCountUp={() => setState({
          ...state,
          selectedFoodCount: state.selectedFoodCount + 1,
        })}
        onClickCountDown={() => setState({
          ...state,
          selectedFoodCount: state.selectedFoodCount - 1,
        })}
        // 先ほど作った関数を渡します
        onClickOrder={() => submitOrder()}
        // モーダルを閉じる時はすべてのstateを初期化する
        onClose={() => setState({
          ...state,
          isOpenOrderDialog: false,
          selectedFood: null,
          selectedFoodCount: 1,
        })}
      />
      }
      {
        state.isOpenNewOrderDialog &&
        <NewOrderConfirmDialog
          isOpen={state.isOpenNewOrderDialog}
          onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
          existingRestaurantName={state.existingRestaurantName}
          newRestaurantName={state.newRestaurantName}
          onClickSubmit={() => replaceOrder()}
        />
      }
    </Fragment>
  )
}