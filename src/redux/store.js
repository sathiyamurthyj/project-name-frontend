import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import loaderReducer from "./loaderSlice";

// store to access global user and loader states
const store = configureStore({
    reducer: {
        users:usersReducer,
        loaders:loaderReducer
    }
});

export default store;
