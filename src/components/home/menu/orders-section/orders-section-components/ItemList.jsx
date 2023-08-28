import React from 'react'

const ItemList = ({clave, valor}) => {
  return (
    <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
      <p className='m-0 fw-bold fs-6 w-25'>{clave}</p>
      <p className='m-0 fw-medium fs-6 w-75 text-end'>{valor}</p>
    </div>
  );
}

export default ItemList
