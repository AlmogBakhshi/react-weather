import { configureStore } from '@reduxjs/toolkit'
import container from './Slices/containerSlice';
import weather from './Slices/weatherSlice';
import favorites from './Slices/favoritesSlice'

export const store = configureStore({
    reducer: {
        container,
        weather,
        favorites
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>