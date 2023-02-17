import { combineReducers } from 'redux';
import userReducer from '../slice/userSlice';
import cartReducer from '../slice/cartSlice';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

export default rootReducer;
