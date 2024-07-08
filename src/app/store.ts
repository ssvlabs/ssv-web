import { configureStore } from '@reduxjs/toolkit';
import { appStateReducer } from '~app/redux/appState.slice';
import { navStateReducer } from '~app/redux/navigation.slice';
import { walletStateReducer } from '~app/redux/wallet.slice';
import { notificationsStateReducer } from '~app/redux/notifications.slice';
import { accountStateReducer } from '~app/redux/account.slice';
import { networkStateReducer } from '~app/redux/network.slice';
import { operatorStateReducer } from '~app/redux/operator.slice.ts';
import { operatorMetadataReducer } from '~app/redux/operatorMetadata.slice.ts';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    navState: navStateReducer,
    walletState: walletStateReducer,
    notificationsState: notificationsStateReducer,
    accountState: accountStateReducer,
    networkState: networkStateReducer,
    operatorState: operatorStateReducer,
    operatorMetadataState: operatorMetadataReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
