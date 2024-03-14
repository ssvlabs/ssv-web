import { configureStore } from '@reduxjs/toolkit';
import { appStateReducer } from '~app/redux/appState.slice';
import { navStateReducer } from '~app/redux/navigation.slice';
import { walletStateReducer } from '~app/redux/wallet.slice';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    navState: navStateReducer,
    walletState: walletStateReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
