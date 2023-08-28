// React
import React, { useContext, useEffect, useState } from 'react';

// React Icons
import { TbCopy } from 'react-icons/tb';
import { FaPizzaSlice } from 'react-icons/fa';

// React Router
import { useNavigate } from 'react-router-dom';

// Firebase 
import { getInfoUser } from '../../../../firebase/firebaseFirestore';

// Context
import { AppContext } from '../../../../context/AppContext';

// Componentes
import MenuHeader from '../MenuHeader';

const InviteFriends = () => {

  const navigate = useNavigate();

  const { email, codeUser, setCodeUser, infoPoints } = useContext(AppContext);

  useEffect( () => {
    if(email == null || infoPoints == null) {
      navigate('/home');
      return;
    }
    if(codeUser == null){
      const f = async () => {
        const res = await getInfoUser(email);
        if(res) setCodeUser(res.codeRef);
        console.log(infoPoints);
      }
      f();
    }
  }, [] );

  const { color1 } = useContext(AppContext); 

  
    if(infoPoints != null){
      return (
        <main className='container-fluid p-0 overflow-hidden'>
      
          <MenuHeader text='Invitar Amigos' />
  
          <section className='mx-3 d-flex flex-column justify-content-between' style={{height:'87vh'}}>
  
            <div></div>
  
            <div className='border rounded-4 py-4'>
              <p className='m-0 text-center fs-3'>Comparte tu codigo de referido</p>
              <div className='d-flex justify-content-center align-items-center mt-3 gap-2'>
                { codeUser != null 
                  ? <p className='m-0 fw-bold display-3'>{codeUser}</p>
                  : <p className='m-0 fw-bold display-3'>00000</p>
                }
                <TbCopy className='display-3 text-secondary' />
              </div>
            </div>
  
            <div className='' >
  
              <p className='fs-3 fw-bold'>Obtiene {infoPoints.refFriendGenerate + infoPoints.pointsForMinSpend} puntos por cada amigo invitado</p>
              <div className='row'>
                <p className='fs-5 fw-medium col-9'>Si un amigo se registra en la pagina y usa tu codigo y hace su primera orden</p>
                <div className='d-flex justify-content-end align-items-center col-3 gap-2 align-self-start'>
                  <p className={`m-0 fs-3 fw-medium ${color1.textColor}`}>+{infoPoints.refFriendGenerate + infoPoints.pointsForMinSpend}</p>
                  <FaPizzaSlice className={`fs-5 ${color1.textColor}`} />
                </div>
              </div>
  
              <button className={`mt-5 btn form-control fs-3 py-3 rounded-3 ${color1.btn}`}>Compartir codigo de referido</button>
  
            </div>
          </section>
      
        </main>
      );
    }
}

export default InviteFriends;
