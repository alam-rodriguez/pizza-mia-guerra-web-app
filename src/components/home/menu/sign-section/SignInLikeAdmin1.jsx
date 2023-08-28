import React, { useContext, useEffect, useState } from 'react';

// React Icons
import { GrFacebookOption } from 'react-icons/gr';
import { IoIosArrowBack } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { TfiEmail } from 'react-icons/tfi'
import { RiAdminFill } from 'react-icons/ri'

// Components
import SingInButton from './SingInButton';

// React Router
import { useNavigate } from 'react-router-dom';

// Firebase 
import { changeTokenAdmin, registrarAdmin, registrarUsuario } from '../../../../firebase/firebaseAuthGoogle';
import { existAdmin, obtenerInfoApp } from '../../../../firebase/firebaseFirestore';
// import { existAdmin, registrarAdmin, registrarUsuario } from '../../../../firebase/firebase';

// Contetx
import { AppContext } from '../../../../context/AppContext';
import { messaging } from '../../../../firebase/firebaseConfig';
import { getToken } from 'firebase/messaging';

const SignInLikeAdmin1 = () => {

  const navigate = useNavigate();

  const { isAdmin } = useContext(AppContext); 

  const handleClickBack = () => navigate('/home');

  const [viewInfo, setViewInfo] = useState(false);
  useEffect( () => {
    const password = prompt('Contraseña');
    if(password != '123456789'){
      navigate('/home');
    }else {
      setViewInfo(true);
    }
  }, [] );

  

  const logUserAdmin = async () => {
    
    const res = await existAdmin();
    if(res == false){
      // const token = await getToken(messaging, {
      //   vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
      // }).catch(e => console.log(e));
      // console.log(token);
      // const token = requestPermission();

      const res2 = await registrarAdmin();
      if(res2 != false){
        alert('Te has registrado como admin');
        setTimeout( () => {
          navigate('/registro-like-admin/details-app');
        }, 5000);
      }
    }else {

      // const res = await registrarUsuario(appInfo.admin, appInfo.adminsTokens);

      // function requestPermission() {
      //   console.log('Requesting permission...');
      //   Notification.requestPermission().then( async (permission) => {
      //     if (permission === 'granted') {
      //       console.log('Notification permission granted.');
      //       const token = await getToken(messaging, {
      //         vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
      //       });
      //       console.log(token);
      //       return(token);
      //     } else {
      //       console.log('permiso denegado');
      //       return false;
      //     }
      //   });  
      // }
      // const token = requestPermission();

      // const newAdminsTokens = {...adminsTokens};
      //     newAdminsTokens[admin] = currentToken; 

      //     actualizarTokensAdmins(newAdminsTokens);

      const infoApp = await obtenerInfoApp();

      console.log(infoApp);

      await changeTokenAdmin(infoApp.admin, infoApp.adminsTokens);
      alert('Lo siento pero no se puede cambiar el admin de la app una vez creado, para mas informacion comuniquese con el desarrollador');
    }
  }

  if(viewInfo){
    return (
      <section className='d-flex justify-content-center flex-column align-items-center col-9 m-auto mt-5 vh-100'>
        
        {/* <IoIosArrowBack className='position-absolute top-0 start-0 mt-4 display-4' onClick={handleClickBack} /> */}
  
        <h2 className='display-1 text-danger fw-bold mb-5'>Pedido ya</h2>
        <p className='text-start fw-bold fs-3'>Por favor inicia sesion con tu email.</p>
        <p>Ut nisi ad commodo veniam mollit ullamco. In Lorem cillum anim cillum et aliqua. Dolore anim cillum id veniam elit esse excepteur.</p>
  
        <SingInButton 
          icon={<RiAdminFill className='fs-1 text-white' />} 
          bgColor='bg-success'
          text='iniciar sesion admin' 
          handleClick={logUserAdmin}
        />
          
        <p className='position-absolute bottom-0 w-75 text-center'>Nostrud adipisicing labore laboris amet non sint laboris aute nulla cillum est voluptate.</p>
      </section>
    );
  }
}

export default SignInLikeAdmin1
