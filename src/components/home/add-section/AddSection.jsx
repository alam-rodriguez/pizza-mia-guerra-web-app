// React
import React from 'react';
import { useContext } from 'react';

// React Icons
import { BsListNested } from 'react-icons/bs';

import { IoSettings } from 'react-icons/io5';

// Reatc Router
import { useNavigate } from 'react-router-dom';

import { AppContext } from '../../../context/AppContext';

const AddSection = () => {

  const {isAdmin} = useContext(AppContext);

  const navigate = useNavigate();

  const handleClickAddArtice = () => navigate('/admin-options');

  const handleClickSeeOrders = () => navigate('/see-orders');

  if(isAdmin == 'admin'){
    return (
      <section className='w-100 pb-5'>
  
        <div className='bg-black me-4 rounded-5 d-flex justify-content-center align-items-center gap-3' style={{height:70, minWidth:'100%'}} onClick={handleClickAddArtice}>
          <IoSettings className='text-white display-4' />
          <p className='m-0 text-white fs-1 fw-bold'>Ajustes</p>  
        </div>
  
        <div className='bg-black me-4 rounded-5 d-flex justify-content-center align-items-center mt-5 gap-3' style={{height:70, minWidth:'100%'}} onClick={handleClickSeeOrders}>
          <BsListNested className='text-white display-4' />
          <p className='m-0 text-white fs-1 fw-bold'>Ver Pedidos</p>  
        </div>
  
        <p className='text-center fs-3'>Eres admin</p>
  
      </section>
    );
  } else {
    return (
      <section className='w-100 pb-5'>
  
        <div className='bg-black me-4 rounded-5 d-flex justify-content-center align-items-center mt-0 gap-3' style={{height:70, minWidth:'100%'}} onClick={handleClickSeeOrders}>
          <BsListNested className='text-white display-4' />
          <p className='m-0 text-white fs-1 fw-bold'>Ver Pedidos</p>  
        </div>
  
        <p className='text-center fs-3'>Eres semi admin</p>
  
      </section>
    );
  }
}

export default AddSection;
