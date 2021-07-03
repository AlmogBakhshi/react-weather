import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    actions, selectors, fetchWeatherByGeolocation,
    fetchAutocomplete, fetchWeather, fetchWeatherFiveDay
} from '../../store/Slices/weatherSlice';
import { actions as favoritesActions, selectors as favoritesSelectors, Favorite } from '../../store/Slices/favoritesSlice';
import { selectTemperature } from '../../store/Slices/containerSlice';
import Container from '../container';
import Popup from '../container/popup';
import Card from './card';
import TemperatureUnit from '../temperatureUnit';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { TextField, Paper } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

const Weather = () => {
    const selector = useSelector(selectors);
    const dispatch = useDispatch();

    const favoritesSelector = useSelector(favoritesSelectors);
    const temperature = useSelector(selectTemperature);


    useEffect(() => {
        // init favoritesStorage in state
        dispatch(favoritesActions.setFavoritesStorage())

        navigator.geolocation.getCurrentPosition(position => {
            position && dispatch(fetchWeatherByGeolocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }));
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (selector.selectedAutocomplete) {
            dispatch(fetchWeather(selector.selectedAutocomplete.Key));
            dispatch(fetchWeatherFiveDay(selector.selectedAutocomplete.Key));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.selectedAutocomplete])

    const HandleFetchSelectedWeather = (e: React.ChangeEvent<{}>, weather: any) => {
        if (weather) {
            dispatch(actions.setSelectedAutocomplete(weather));
        }
    }

    const HandleSearch = (weatherInput: string) => {
        // send string to fetch autocomplete
        dispatch(fetchAutocomplete(weatherInput))
    }

    const HandleAddOrRemoveFavorite = (remove: boolean) => {
        const newFavorite: Favorite = {
            key: selector.selectedAutocomplete.Key,
            localizedName: `${selector.selectedAutocomplete.LocalizedName} (${selector.selectedAutocomplete.Country.LocalizedName})`,
            lastUpdate: selector.weather.LocalObservationDateTime.slice(0, 10),
            temperature: selector.weather.Temperature.Imperial.Value
        };

        remove ?
            dispatch(favoritesActions.removeFavorire(selector.selectedAutocomplete.Key)) :
            dispatch(favoritesActions.addFavorite(newFavorite));
    }

    const HandleShowFavorite = () => {
        // Check which button should show (add or remove)
        const favoriteExist = favoritesSelector.favorites.some(favorite => favorite.key === selector.selectedAutocomplete.Key)
        return (
            <div className="weather__container__current_weather__favorite__button" onClick={() => HandleAddOrRemoveFavorite(favoriteExist)}>
                {favoriteExist ? <MdFavorite size='1em' className="weather__container__current_weather__favorite__button__icon" /> :
                    <MdFavoriteBorder size='1em' className="weather__container__current_weather__favorite__button__icon" />}
                {favoriteExist ? 'Remove from Favorites' : 'Add to Favorites'}
            </div>
        );
    }

    return (
        <Container>
            <div className='weather'>
                <Autocomplete
                    className='weather__search'
                    freeSolo
                    onChange={HandleFetchSelectedWeather}
                    onInputChange={(e, weatherInput) => HandleSearch(weatherInput)}
                    options={selector.searchAutocomplete}
                    getOptionLabel={(option: any) => option?.Country ? `${option.LocalizedName} (${option.Country.LocalizedName})` : ''}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                />
                {selector.selectedAutocomplete && selector.weather && <Paper className='weather__container' elevation={8}>
                    <div className='weather__container__current_weather'>
                        <div className="weather__container__current_weather__temperature">
                            <div>{selector.selectedAutocomplete?.Country ? `${selector.selectedAutocomplete.LocalizedName} (${selector.selectedAutocomplete.Country.LocalizedName})` : ''}</div>
                            <div>{TemperatureUnit({ value: selector.weather.Temperature?.Imperial.Value, temperature })}</div>
                        </div>
                        <div className="weather__container__current_weather__favorite">
                            <HandleShowFavorite />
                        </div>
                    </div>
                    <div className="weather__container__weather_text">{selector.weather.WeatherText}</div>
                    <div className="weather__container__five_days">
                        {selector.weatherFiveDays?.map((day: any, index) => <Card key={index} data={day} className='weather__container__five_days__day' />)}
                    </div>
                </Paper>}
            </div>
            <Popup data={selector.errorMessage} clickClose={() => dispatch(actions.resetErrorMessage())} />
        </Container>
    );
}

export default Weather;