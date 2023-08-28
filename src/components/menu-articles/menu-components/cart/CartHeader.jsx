import React from 'react';

// React-Icons
import { IoIosArrowBack } from 'react-icons/io';

const CartHeader = ({handleClickBack}) => {

  return (
    <header className='py-4 border-bottom position-sticky start-0 top-0 w-100 bg-white z-2' >
      <IoIosArrowBack className='position-absolute display-5' onClick={handleClickBack} />
      <h1 className='text-center m-0 fs-3'>Carrito</h1>
    </header>
  )
}

export default CartHeader
