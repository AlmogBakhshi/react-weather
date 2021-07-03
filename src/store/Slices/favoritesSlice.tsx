import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../';
import * as Fetch from '../fetch';

export interface Favorite {
    key: string,
    localizedName: string,
    lastUpdate: string,
    temperature: number
}

// Define a type for the slice state
interface FavoritesSliceState {
    favorites: Favorite[],
    errorMessage: string[] | []
}

// Define the initial state using that type
const initialState: FavoritesSliceState = {
    favorites: [],
    errorMessage: []
}

export const fetchWeather: any = createAsyncThunk('get/weather', async (key: string) =>
    await Fetch.Get(`currentconditions/v1/${key}?apikey=${process.env.REACT_APP_API_KEY}`)
        .then(res => ({ key, data: res[0] })))

export const favoritesSlice = createSlice({
    name: 'favorites',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setFavoritesStorage: (state) => {
            const favoritesStorage = localStorage.getItem('favorites');
            favoritesStorage && (state.favorites = JSON.parse(favoritesStorage));
        },
        addFavorite: (state, action: PayloadAction<Favorite>) => {
            const newFavorites = [...state.favorites, action.payload];
            // set new localStorage, with selected weather
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            state.favorites = newFavorites;
        },
        removeFavorire: (state, action: PayloadAction<string>) => {
            const newFavorites = state.favorites.filter(favorite => favorite.key !== action.payload);
            // set new localStorage, without selected weather
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            state.favorites = newFavorites;
        },
        resetErrorMessage: (state) => {
            state.errorMessage = [];
        }
    },
    extraReducers: {
        [fetchWeather.fulfilled](state, { payload }) {
            if (payload) {
                const newFavorites = state.favorites.map(favorite => {
                    if (favorite.key === payload.key) {
                        favorite.lastUpdate = payload.data.LocalObservationDateTime.slice(0, 10);
                        favorite.temperature = payload.data.Temperature.Imperial.Value;
                    }
                    return favorite;
                })
                localStorage.setItem('favorites', JSON.stringify(newFavorites));
                state.favorites = newFavorites;
            }
        },
        // handle show popup error
        [fetchWeather.rejected](state) {
            state.errorMessage = [...state.errorMessage, "Can't get data Weather from API, Try again later"];
        }
    }
})

// Action creators are generated for each case reducer function
export const { actions } = favoritesSlice;

// Other code such as selectors can use the imported `RootState` type
export const selectors = (state: RootState) => state.favorites;

export default favoritesSlice.reducer;