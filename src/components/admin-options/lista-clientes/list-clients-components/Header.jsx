import React from 'react';

// React Icons
import { IoIosArrowBack } from 'react-icons/io';

const Header = ({handleClickAtras, title = 'Lista de clientes'}) => {

  const handleClickBack = () =>  handleClickAtras();

  return (
    <header className='row border-bottom py-3'>
      <IoIosArrowBack className='display-2 col-2' onClick={handleClickBack} />
      <p className='m-0 fs-1 fw-medium col-8 text-center'>{title}</p>
      <div className='col-2'></div>
    </header>
  );
}

export default Header;
