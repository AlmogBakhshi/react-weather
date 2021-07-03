import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors, fetchWeather } from '../../store/Slices/favoritesSlice';
import Container from '../container';
import Popup from '../container/popup';
import Card from './card';

const Favorites = () => {
    const selector = useSelector(selectors);
    const dispatch = useDispatch();

    useEffect(() => {
        // init favoritesStorage in state
        dispatch(actions.setFavoritesStorage());

        HandleDataScroll();
        window.onresize = () => {
            // add data-scroll to html tag and change is value if scroll view
            HandleDataScroll();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const HandleDataScroll = () => {
        const scrollHeight = document.querySelector('.favorites')?.scrollHeight;
        if (scrollHeight) {
            document.documentElement.dataset.scroll = `${scrollHeight > window.innerHeight}`;
        }
    }

    const HadleRemoveFavorite = (key: string) => {
        dispatch(actions.removeFavorire(key));
    }

    const HadleRefresh = (key: string) => {
        // update weather temperature
        dispatch(fetchWeather(key));
    }


    return (
        <Container>
            <div className='favorites'>
                {selector.favorites.map(favorite =>
                    <Card key={favorite.key} data={favorite}
                        favorite className='favorites__card'
                        hadleRefresh={() => HadleRefresh(favorite.key)}
                        hadleRemoveFavorite={() => HadleRemoveFavorite(favorite.key)} />)}
            </div>
            <Popup data={selector.errorMessage} clickClose={() => dispatch(actions.resetErrorMessage())} />
        </Container>

    );
}

export default Favorites;