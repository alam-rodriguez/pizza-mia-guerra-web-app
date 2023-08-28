import React from 'react'

const ItemTableEstadisticas = ({llave, valor}) => {
  return (
    <div className='d-flex justify-content-between my-4'>
      <p className='m-0 fw-medium fs-5'>{llave}</p>
      <p className='m-0 fw-medium fs-5'>{valor}</p>
    </div>
  );
}

export default ItemTableEstadisticas;
