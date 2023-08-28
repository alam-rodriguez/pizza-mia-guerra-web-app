import React, { useContext } from 'react';

// Context
import { AppContext } from '../../../../context/AppContext';

// React Icon
import { IoIosArrowBack } from 'react-icons/io';

const Header = ({handleClickAtras}) => {

  const { appInfo } = useContext(AppContext);

  const handleClickBack = () => handleClickAtras();

  return (
    <header className='d-flex justify-content-between align-items-center my-4 mx-3'>
      <IoIosArrowBack className='display-4' onClick={handleClickBack} />
      { appInfo != null 
        ? <p className='m-0 fs-1 fw-bold'>{appInfo.nombre}</p>
        : <p className='m-0 fs-1 fw-bold'>Nombre de la app</p>
      }
    </header>
  );
}

export default Header;
