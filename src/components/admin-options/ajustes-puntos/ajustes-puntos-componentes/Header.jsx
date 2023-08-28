import React from 'react';

// React Icons
import { IoIosArrowBack } from 'react-icons/io';

const Header = ({handleClickAtras, title = 'Ajustes de Puntos'}) => {

  return (
    <header className='d-flex align-items-center border-bottom- py-3 m-0'>
      <IoIosArrowBack className='display-4 col-2- text-start' onClick={handleClickAtras} />
      <p className='m-0 w-100 fs-1 fw-medium col-8- text-center'>{title}</p>
      <div className='col-2-'></div>
    </header>
  );

}

export default Header;
