// Reatc
import React from 'react';

const SingInButton = ({icon, bgColor, text, handleClick}) => {

  return (
    <button className='overflow-hidden d-flex bg-white border-1 border-secondary rounded-3 row w-100 form-control my-3 p-0' style={{height:35}} onClick={handleClick}>
      <div className={`d-flex align-items-center justify-content-center col-2 border-end h-100  ${bgColor}`}>
        {icon}
      </div>
      <div className='col-10'>
        <p className='m-0 text-start fw-bold fs-5'>{text}</p>
      </div>
    </button>
  )
}

export default SingInButton;
