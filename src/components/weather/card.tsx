import React from 'react';
import { useSelector } from 'react-redux';
import { selectTemperature } from '../../store/Slices/containerSlice';
import TemperatureUnit from '../temperatureUnit';
import { Paper } from '@material-ui/core';
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface Props {
    className?: string | undefined,
    data: any,
    favorite?: boolean,
    hadleRefresh?: () => void,
    hadleRemoveFavorite?: () => void,
}

const Card: React.FC<Props> = ({ data, className, favorite, hadleRefresh, hadleRemoveFavorite }) => {
    const temperature = useSelector(selectTemperature);

    const HandleShowDataCard = () => {
        return (
            favorite ?
                <>
                    <AiOutlineCloseCircle size='1em' onClick={hadleRemoveFavorite} />
                    <div>{data.localizedName}</div>
                    <div>{data.lastUpdate}</div>
                    <div>{TemperatureUnit({ value: data.temperature, temperature })}</div>
                    <div onClick={hadleRefresh}>Refresh</div>
                </> :
                <>
                    <div>{new Date(data.Date).toLocaleString('en-us', { weekday: 'long' })}</div>
                    <div> {TemperatureUnit({ value: data.Temperature.Minimum.Value, temperature })} - {TemperatureUnit({ value: data.Temperature.Maximum.Value, temperature })}</div>
                </>
        );
    }

    return (
        <Paper className={className}>
            <HandleShowDataCard />
        </Paper>
    );
}

export default Card;