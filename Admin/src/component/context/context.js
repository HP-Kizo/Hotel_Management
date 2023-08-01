import { createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const SEARCH_HOTEL = "SEARCH_HOTEL";

const persistConfig = {
  key: "root",
  storage,
};

const initState = {
  userLogin: undefined,
};

const reducerContext = (state = initState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        adminLogin: action.user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        adminLogin: false,
      };
    }
    case SEARCH_HOTEL: {
      return {
        ...state,
        hotel: action.hotel,
      };
    }
    default:
      return state;
  }
};
const persistedReducer = persistReducer(persistConfig, reducerContext);
const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export default store;
