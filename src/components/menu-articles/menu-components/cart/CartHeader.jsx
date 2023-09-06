import React from 'react';

// React-Icons
import { IoIosArrowBack } from 'react-icons/io';

const CartHeader = ({isFixed, handleClickBack}) => {

  return (
    <header className={`CartHeader- position-fixed position-sticky-  py-4 border-bottom start-50 top-0 w-100 bg-white z-3 translate-middle-x`} style={{maxWidth:600}}>
      <IoIosArrowBack className='position-absolute display-5' onClick={handleClickBack} />
      <h1 className='text-center m-0 fs-3'>Carrito</h1>
    </header>
  )
}

export default CartHeader
