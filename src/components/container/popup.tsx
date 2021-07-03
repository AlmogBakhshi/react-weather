import React from 'react';
import { MdClose } from 'react-icons/md';

interface Props {
    data: string[] | [],
    clickClose: () => void
}

const Popup: React.FC<Props> = ({ data, clickClose }) => {
    return (
        data.length > 0 ? <div className='popup'>
            <div className='popup__container'>
                <MdClose size='1em' className='popup__container__close' onClick={() => clickClose()} />
                {data.map((message, index) => <div key={index} className='popup__container__text'>{message}</div>)}
            </div>
        </div> : <></>
    );
}

export default Popup;