// React
import React, { useContext, useEffect, useState } from 'react';

// React Icons
import { RiShoppingBag2Line } from 'react-icons/ri'
import { HiOutlineShoppingBag } from 'react-icons/hi2';

// React Router
import { useNavigate } from 'react-router-dom';

// Firebase 
import { getPedidosByClient } from '../../../../firebase/firebaseFirestore';

// Context
import { AppContext } from '../../../../context/AppContext';

// Componentes
import MenuHeader from '../MenuHeader';
import ListPedidos from './ListPedidos';

const OrderHistory = () => {
  const navigate = useNavigate();

  const { email, clientOrders, setClientOrders } = useContext(AppContext);

  const [ordenes, setOrdenes] = useState([]);

  useEffect( () => {
    if( email == null ) {
      navigate('/home');
      return;
    }
    if(clientOrders == null){
      const f = async () => {
        const res = await getPedidosByClient(email);
        setClientOrders(res);
        setOrdenes(res);
      }
      f();
    }else {
      setOrdenes(clientOrders);
    }
  }, [clientOrders] );


  const { color1 } = useContext(AppContext); 

  const handleClickOrdenar = () => navigate('/menu-articles');

  if(ordenes.length == 0){
    return (
      <main className='animate__animated animate__fadeIn container-fluid p-0 overflow-hidden'>
  
        <MenuHeader text='Historial de Ordenes' />
  
        <section className='d-flex flex-column justify-content-between mx-auto '>
  
          <div className='d-flex flex-column justify-content-center' style={{marginTop:120}}>
            <div className='position-relative mx-auto' style={{height: 130, width:130}}>
              <HiOutlineShoppingBag className='text-secondary position-absolute bottom-0' style={{fontSize:140}} />
              <RiShoppingBag2Line className='text-secondary position-absolute bg-white' style={{fontSize:70, left:70, bottom:5}} />
            </div>
            <h2 className='text-center text-black'>No tienes ninguna orden</h2>
            <p className='m-0 text-center'>Todas tus ordenes se mostraran aqui</p>
          </div>
  
          <button className={`btn ${color1.btn} form-control p-3 fs-3 position-absolute bottom-0 start-50 translate-middle`} style={{width:'93%'}} onClick={handleClickOrdenar}>Ordenar</button>
  
        </section>
  
      </main>
        
    );
  } else {
    return (
      <main className='animate__animated animate__fadeIn container-fluid overflow-hidden-'>
    
        <MenuHeader text='Historial de Ordenes' />
    
        <ListPedidos ordenes={ordenes} />
    
      </main>
    );
  }
}

export default OrderHistory;
