import React from 'react';

// React-Icons
import { IoIosArrowBack } from 'react-icons/io';

const CartHeader = ({isFixed, handleClickBack}) => {

  return (
    <header className={`${isFixed ? 'position-fixed' :'position-sticky'} py-4 border-bottom start-0 top-0 w-100 bg-white z-2 bg-danger`} style={{height:'10%'}}>
      <IoIosArrowBack className='position-absolute display-5' onClick={handleClickBack} />
      <h1 className='text-center m-0 fs-3'>Carrito</h1>
    </header>
  )
}

export default CartHeader
