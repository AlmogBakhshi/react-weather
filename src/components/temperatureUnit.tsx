import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectTemperature } from '../store/Slices/containerSlice';
import { RiCelsiusLine, RiFahrenheitLine } from 'react-icons/ri';

interface Props {
    value: number,
    temperature: boolean
}

const TemperatureUnit: React.FC<Props> = ({ value, temperature }) => {
    // const temperature = useSelector(selectTemperature);
    return (
        temperature ?
            <>
                {((value - 32) / 1.8).toFixed(1)}<RiCelsiusLine size='0.7em' />
            </> :
            <>
                {value.toFixed(1)} <RiFahrenheitLine size='0.7em' />
            </>
    );
}

export default TemperatureUnit;