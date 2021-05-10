import axios from "axios";

const DEFAULT_API_LOCALHOST = 'http://localhost:3000/api/v1'

export const restaurantsIndex = `${DEFAULT_API_LOCALHOST}/restaurants`
export const foodsIndex=(restaurantId)=>
  `${DEFAULT_API_LOCALHOST}/restaurants/${restaurantId}/foods`
export const lineFoods = `${DEFAULT_API_LOCALHOST}/line_foods`;
export const lineFoodsReplace = `${DEFAULT_API_LOCALHOST}/line_foods/replace`;
export const orders = `${DEFAULT_API_LOCALHOST}/orders`;

export const fetchFoods = (restaurantId) => {
  //foodIndex(restaurantId)はURL文字列を返す
  return axios.get(foodsIndex(restaurantId))
}