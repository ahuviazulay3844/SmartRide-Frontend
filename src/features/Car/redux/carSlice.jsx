import { createSlice } from "@reduxjs/toolkit";
import { carApi } from "./carApi";

const initialState = {
    carsList: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null
};

const carSlice = createSlice({
    name: 'car',
    initialState,
    reducers: {
        resetCarState: () => initialState,
        // עדכון סטטוס של רכב בודד בזמן אמת
        updateCarStatusInList: (state, action) => {
            const { carId, status } = action.payload;
            const car = state.carsList.find(c => c.id === carId);
            if (car) {
                car.status = status;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // 1. מצב שבו הבקשה התחילה (Loading)
            .addMatcher(
                carApi.endpoints.getAllCars.matchPending, 
                (state) => {
                    state.status = 'loading';
                }
            )
            // (Succeeded)
            .addMatcher(
                carApi.endpoints.getAllCars.matchFulfilled, 
                (state, { payload }) => {
                    state.status = 'succeeded';
                    state.carsList = payload;
                }
            )
            //(Failed)
            .addMatcher(
                carApi.endpoints.getAllCars.matchRejected, 
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.error?.message || "חלה שגיאה בטעינת הרכבים";
                }
            );
    },
});
export const selectCarStatus = (state) => state.car.status;
export const selectAllCars = (state) => state.car.carsList;
export const { resetCarState, updateCarStatusInList } = carSlice.actions;
export default carSlice.reducer;