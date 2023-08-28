import React, { useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import { AppContext } from '../../../context/AppContext';

// React Icon
import { IoIosArrowBack } from 'react-icons/io';

const CreateArticleHeader = ({path, whatReset}) => {

  const { appInfo, setArticleSelected } = useContext(AppContext);
  
  const navigate = useNavigate();

  const handleClickBack = () => {
    if(whatReset == 'articleSeletc') setArticleSelected(null);
    navigate(path);
  }

  return (
    <header className='d-flex justify-content-between align-items-center my-4 mx-2'>
      <IoIosArrowBack className='display-4' onClick={handleClickBack} />
      { appInfo != null 
        ? <p className='m-0 fs-1 fw-bold'>{appInfo.nombre}</p>
        : <p className='m-0 fs-1 fw-bold'>Nombre de la app</p>
      }
    </header>
  )
}

export default CreateArticleHeader
