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
// import { existAdmin, registrarAdmin, registrarUsuario } from '../../../../firebase/firebase';
import { registrarUsuario } from '../../../../firebase/firebaseAuthGoogle';

// Contetx
import { AppContext } from '../../../../context/AppContext';

import { ToastContainer, toast } from 'react-toastify';

import Swal from 'sweetalert2';
// import { saveInfoUser } from '../../../../firebase/firebaseFirestore';

const SingIn = () => {

  const { isAdmin, appInfo } = useContext(AppContext); 

  const navigate = useNavigate();

  const [appName, setAppName] = useState('');
	useEffect(()=>{
    console.log(appInfo);
		if(appInfo != null)setAppName(appInfo.nombre);
    else handleClickBack();
	});

  const handleClickBack = () => navigate('/home');

  const handleClickGoogle = async () => {

    const iniciarSesionPromise = new Promise( async (resolve, reject) => {
      
      const res = await registrarUsuario(appInfo.admin, appInfo.adminsTokens);

      if(res == 'usuario-registrado'){
        resolve();
        Swal.fire({
          icon: 'success',
          title: 'Usuario',
          text: 'Ya este usuario esta registrado',
        });
        return;
      }
      if(res != false && res != 'usuario-registrado'){
        resolve();
        setTimeout(() => {
          navigate('/home');
        }, 5000);
      }else {
        reject();
      }

    });

    toast.promise( iniciarSesionPromise ,{
      pending: 'Iniciando sesion',
      success: 'Sesion iniciada con exito',
      error: 'Error al iniciar secion'
    })

  }
  
  return (
    <section className='d-flex justify-content-center flex-column align-items-center col-9 m-auto mx-5 vh-100'>
      
      <IoIosArrowBack className='position-absolute top-0 start-0 mt-4 display-4' onClick={handleClickBack} />

      <h2 className='display-1 text-danger fw-bold mb-5'>{appName}</h2>
      <p className='text-start fw-bold fs-3'>Por favor inicia sesion con tu email.</p>
      <p>Es importante que inicies sesion con tu email, de esta manera te daremos un mejor servicio y podremos otorgarte los puntos que mereces. </p>

        <div className='w-100 z-1'>
          <SingInButton 
            icon={<GrFacebookOption className='fs-1 text-white' />} 
            bgColor='bg-primary' 
            text='Facebook' 
            handleClick={handleClickGoogle}
          />
          <SingInButton 
            icon={<FcGoogle className='fs-1' />} 
            bgColor='' 
            text='Google' 
            handleClick={handleClickGoogle}
          />
          <SingInButton 
            icon={<TfiEmail className='fs-1' />} 
            bgColor='' 
            text='Email' 
            handleClick={handleClickGoogle}
          />
        </div>     
        
      <p className='position-absolute bottom-0 w-75 text-center z-0'>Le recordamos que esta app es nuestra y las reglas las ponemos nosotros.</p>
      <ToastContainer />
    </section>
  )
}

export default SingIn
