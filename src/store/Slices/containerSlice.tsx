import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../';

// Define a type for the slice state
interface ContainerSliceState {
    temperature: boolean
}

// Define the initial state using that type
const initialState: ContainerSliceState = {
    temperature: true
}

export const containerSlice = createSlice({
    name: 'container',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        changeTemperature: (state) => {
            state.temperature ? localStorage.removeItem('celsius') : localStorage.setItem('celsius', 'true');
            state.temperature = !state.temperature;
        }
    }
})

// Action creators are generated for each case reducer function
export const { changeTemperature } = containerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTemperature = (state: RootState) => state.container.temperature;

export default containerSlice.reducer;