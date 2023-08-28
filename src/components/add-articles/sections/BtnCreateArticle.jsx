import React from 'react';

// React Router Dom
import { useNavigate } from 'react-router-dom';

const CreateArticle = () => {
  const navigate = useNavigate();

  const handleClickCrearArticulos = () => {
    navigate('/create-article');
  }

  return (
    <button className='btn btn-success form-control mt-5 fs-2' onClick={handleClickCrearArticulos}>Crear Articulos</button>
  )
}

export default CreateArticle
