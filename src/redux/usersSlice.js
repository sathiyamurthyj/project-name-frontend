import {createSlice} from "@reduxjs/toolkit";

// global states related to users
const usersSlice = createSlice({
    name: "users",
    initialState:{
        user: null,
        users: [],
        notifications:[]
    },
    reducers: {
        SetUser(state, action) {
            state.user = action.payload;
        },
        SetUsers(state, action){
            state.users = action.payload;
        },
        SetNotifications(state,action){
            state.notifications = action.payload;
        }
    }
});

export const {SetUser, SetUsers, SetNotifications} = usersSlice.actions;

export default usersSlice.reducer;