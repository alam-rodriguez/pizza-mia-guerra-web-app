import React, { useEffect } from 'react';

// React Icons
import { IoIosArrowBack } from 'react-icons/io';

const Header = ({link = '/home', title = 'Pedidos', setViewSearchCode}) => {
  
  const handleClickBack = () => setViewSearchCode('cerrar');

  return (
    <header className='row border-bottom py-3'>
      <IoIosArrowBack className='display-4 col-2 z-1' onClick={handleClickBack} />
      <p className='m-0 fs-4 fw-medium position-absolute start-50 translate-middle-x text-center'>{title}</p>
    </header>
  );
}

export default Header;
