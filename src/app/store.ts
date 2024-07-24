import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { accountStateReducer } from '~app/redux/account.slice';
import { appStateReducer } from '~app/redux/appState.slice';
import { navStateReducer } from '~app/redux/navigation.slice';
import { networkStateReducer } from '~app/redux/network.slice';
import { notificationsStateReducer } from '~app/redux/notifications.slice';
import { operatorStateReducer } from '~app/redux/operator.slice.ts';
import { operatorMetadataReducer } from '~app/redux/operatorMetadata.slice.ts';
import { walletStateReducer } from '~app/redux/wallet.slice';

const reducers = combineReducers({
  appState: appStateReducer,
  navState: navStateReducer,
  walletState: walletStateReducer,
  notificationsState: notificationsStateReducer,
  accountState: persistReducer(
    {
      key: 'optimistic',
      storage,
      whitelist: ['optimisticOperatorsMap']
    },
    accountStateReducer
  ),
  networkState: networkStateReducer,
  operatorState: operatorStateReducer,
  operatorMetadataState: operatorMetadataReducer
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage,
    whitelist: ['placeholder']
  },
  reducers
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
