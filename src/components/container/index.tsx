import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeTemperature, selectTemperature } from '../../store/Slices/containerSlice';
import { useHistory } from 'react-router-dom';
import { Paper } from '@material-ui/core';

interface Props {
    children: React.ReactNode
}

interface Link {
    title: string,
    location: string,
    onClick?: () => void
}

const Container: React.FC<Props> = ({ children }) => {
    const history = useHistory();
    const temperature = useSelector(selectTemperature);
    const dispatch = useDispatch();

    const links: Link[] = [
        { title: 'Main', location: '/' },
        { title: 'Favorites', location: '/favorites' },
        { title: `Unit: ${temperature ? 'C' : 'F'}`, location: '', onClick: () => { dispatch(changeTemperature()); } },
    ]

    const HandleOpenMenuBar = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // open, close burger bar
        if (document.querySelector('.container__header__navs__line')?.classList.contains('container__header__navs__line__open')) {
            e.currentTarget.parentElement?.parentElement?.classList.remove('container__open');
            e.currentTarget.parentElement?.classList.remove('container__header__open');
            document.querySelector('.container__header__navs__line')?.classList.remove('container__header__navs__line__open');
            document.querySelector('.container__header__navs')?.classList.remove('container__header__navs__open');
        } else {
            e.currentTarget.parentElement?.parentElement?.classList.add('container__open');
            e.currentTarget.parentElement?.classList.add('container__header__open');
            document.querySelector('.container__header__navs__line')?.classList.add('container__header__navs__line__open');
            document.querySelector('.container__header__navs')?.classList.add('container__header__navs__open');
        }
    }

    return (
        <div className='container'>
            <Paper className='container__header'>
                <div className='container__header__title'>Weather</div>
                <div className='container__header__navs'>
                    {links.map((link, index) =>
                        <div key={index} onClick={() => link.onClick ? link.onClick() : history.push(link.location)}
                            className={`container__header__navs__link ${history.location.pathname === link.location && 'container__header__navs__link__selected'}`}>
                            {link.title}
                        </div>
                    )}
                </div>
                <div className='container__header__navs__line__container' onClick={HandleOpenMenuBar}>
                    <div className='container__header__navs__line' >
                    </div>
                </div>
            </Paper>
            <div className='container__body'>
                {children}
            </div>
        </div>
    );
}

export default Container;