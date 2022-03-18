import { Action, combineReducers, configureStore, Store, ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { userReducer, UserState } from "./userStore";

export interface RootState {
	user: UserState;
}

const rootReducer = combineReducers({
  user: userReducer,
});

export function createStore(initialState?: RootState): Store<RootState> {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),//.concat(loggerThunk),
    preloadedState: initialState,
  });

  // if (process.env.NODE_ENV !== 'production' && module.hot) {
  //   module.hot.accept(
  //     ['./userStore',],
  //     () => store.replaceReducer(rootReducer),
  //   );
  // }

  return store;
}
export const useAppDispatch = () => useDispatch<ThunkDispatch<RootState, void, Action>>();