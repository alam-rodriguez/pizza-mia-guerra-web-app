// React
import React from 'react';

// React Router Dom
import { useNavigate } from 'react-router-dom'

const OrderButton = ({text, textColor, bgColor, type, link, seletionLetf}) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(link);

  if(type == 'imagen'){
    return (
      <div className={`d-flex justify-content-center align-items-center w-50 rounded-4 overflow-hidden ${bgColor}`} style={{height:60}} onClick={handleClick}>
        <p className={`m-0 ms-5 ps-3 fs-6 fw-bold ${textColor}`}>{text}</p>
        <img src={seletionLetf} className='w-75' style={{position:'relative', left:5}} alt="" />
      </div>
    );
  }else {
    return (
      <div className={`d-flex justify-content-between align-items-center w-50 rounded-4 overflow-hidden px-4 ${bgColor}`} style={{height:60}} onClick={handleClick}>
        <p className={`m-0 ${type == 'imagen' ? 'ms-5' : 'w-25'} fs-6 fw-bold ${textColor}`}>{text}</p>
        <div className='w-25'>{seletionLetf}</div>
      </div>
    )
  }
  
}

export default OrderButton
