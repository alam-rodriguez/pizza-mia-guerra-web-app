import React from 'react';

// React Icon
import { IoIosArrowBack } from 'react-icons/io';

// React Router Dom
import { useNavigate } from 'react-router-dom';

const MenuHeader = ({text, actions = ''}) => {

  const navigate = useNavigate();

  const handleClickBack = () => navigate('/home');

  return (
    <header className='row py-4'>
      <IoIosArrowBack className='display-4 col-2 text-start' onClick={handleClickBack} />
      <p className='m-0 fs-3 fw-bold col-8 text-center'>{text}</p>
      <div className='col-2'>{actions}</div>
    </header>
  );
}

export default MenuHeader
