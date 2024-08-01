import { createSlice } from "@reduxjs/toolkit";

// global states related to loaders/spinners
const loaderSlice = createSlice({
    name:"loaders",
    initialState:{
        loading: false,
        buttonLoading: false
    },
    reducers:{
        SetLoading(state, action){
            state.loading = action.payload;
        },
        SetButtonLoading(state, action){
            state.buttonLoading = action.payload;
        }
    }
});

export const {SetLoading, SetButtonLoading} = loaderSlice.actions;

export default loaderSlice.reducer;