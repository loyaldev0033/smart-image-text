// import { configureStore } from "@reduxjs/toolkit";
// import { Store } from "redux";
// import createSagaMiddleware from "redux-saga";
// import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
// import { persistStore } from "redux-persist";

// const sagaMiddleware = createSagaMiddleware();

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }).concat(sagaMiddleware),
// });

// sagaMiddleware.run(rootSaga);

// const persistor = persistStore(store as Store<any, any>);

// export default store;
// export { persistor };

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
