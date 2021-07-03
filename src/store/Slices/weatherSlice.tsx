import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '..';
import * as Fetch from '../fetch';

// Define a type for the slice state
interface WeatherState {
    searchAutocomplete: [],
    selectedAutocomplete: any,
    weather: any,
    weatherFiveDays: [],
    errorMessage: string[] | []
}

// Define the initial state using that type
const initialState: WeatherState = {
    searchAutocomplete: [],
    selectedAutocomplete: null,
    weather: null,
    weatherFiveDays: [],
    errorMessage: []
}

interface Geolocation {
    latitude: number,
    longitude: number
}

export const fetchWeatherByGeolocation: any = createAsyncThunk('get/geolocation', async (location: Geolocation) =>
    await Fetch.Get(`locations/v1/cities/geoposition/search?apikey=${process.env.REACT_APP_API_KEY}&q=${location.latitude},${location.longitude}`))

export const fetchAutocomplete: any = createAsyncThunk('get/autocomplete', async (search: string) =>
    await Fetch.Get(`locations/v1/cities/autocomplete?apikey=${process.env.REACT_APP_API_KEY}&q=${search}`))

export const fetchWeather: any = createAsyncThunk('get/weather', async (key: string) =>
    await Fetch.Get(`currentconditions/v1/${key}?apikey=${process.env.REACT_APP_API_KEY}`)
        .then(res => res[0]))

export const fetchWeatherFiveDay: any = createAsyncThunk('get/weatherFiveDay', async (key: string) =>
    await Fetch.Get(`forecasts/v1/daily/5day/${key}?apikey=${process.env.REACT_APP_API_KEY}`)
        .then(res => res.DailyForecasts))

export const weatherSlice = createSlice({
    name: 'weather',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setSelectedAutocomplete: (state, action: PayloadAction<any>) => {
            state.selectedAutocomplete = action.payload;
        },
        resetErrorMessage: (state) => {
            state.errorMessage = [];
        }
    },
    extraReducers: {
        [fetchWeatherByGeolocation.fulfilled](state, { payload }) {
            state.selectedAutocomplete = payload;
        },
        [fetchAutocomplete.fulfilled](state, { payload }) {
            payload ?
                (state.searchAutocomplete = payload) :
                (state.errorMessage = [...state.errorMessage, "Can't get Autocomplete Location data from API, Try again laiter"]);
        },
        [fetchWeather.fulfilled](state, { payload }) {
            state.weather = payload;
        },
        [fetchWeatherFiveDay.fulfilled](state, { payload }) {
            state.weatherFiveDays = payload;
        },
        // handle show popup error
        [fetchWeatherByGeolocation.rejected](state) {
            state.errorMessage = [...state.errorMessage, "Can't get data Weather By Geolocation from API, Try again laiter"];
        },
        [fetchWeather.rejected](state) {
            state.errorMessage = [...state.errorMessage, "Can't get data Weather from API, Try again laiter"];
        },
        [fetchWeatherFiveDay.rejected](state) {
            state.errorMessage = [...state.errorMessage, "Can't get data Weather Five Day from API, Try again laiter"];
        }
    }
})

// Action creators are generated for each case reducer function
export const { actions } = weatherSlice;

// Other code such as selectors can use the imported `RootState` type
export const selectors = (state: RootState) => state.weather;

export default weatherSlice.reducer;