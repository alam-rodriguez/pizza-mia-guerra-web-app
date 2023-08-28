// React
import React, { useContext } from 'react';

// React Icons
import { GrFacebookOption } from 'react-icons/gr';
import { IoIosArrowBack } from 'react-icons/io';
import { FcGoogle } from 'react-icons/fc';
import { TfiEmail } from 'react-icons/tfi'
import { RiAdminFill } from 'react-icons/ri'

// React Router
import { useNavigate, Link } from 'react-router-dom';

// Firebase 
import { logOut } from '../../../../firebase/firebaseAuthGoogle';
// import { FiLogOut } from 'react-icons/fi';
// import { logOut } from '../../../../firebase/firebase';
// import { FiLogOut } from 'react-icons/fi';

// Contetx
import { AppContext } from '../../../../context/AppContext';

// Componentes
import SettingsItem from './SettingsItem';

// Toaster
import { toast } from 'react-toastify';


const Settings = () => {
  const navigate = useNavigate();

  const { setIsAdmin } = useContext(AppContext); 

  const handleClickBack = () => navigate('/home');

  // const handleChangeBeAdmin = (e) => {
  //   if(e.target.value == 'aabbccdd112233'){
  //     console.log('seras Admin');
  //     setIsAdmin(true);
  //   }
  // }

  const notificationSucces = (text) => {
    return toast.success( text, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const notificationError = (text) => {
    return toast.error( text, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  const handleClickCerrarSesion = async () => {
    const res = await logOut();
    if(res){
      notificationSucces('Haz cerrado sesion exitosamente');
      setTimeout( () => {
        window.location.reload();
        navigate('/home');
        setIsAdmin(false);
      }, 5000);
    }else notificationError();
  }

  return (
    <section className='d-flex flex-column col-11 mt-5 mx-4 pt-4'>
      {/* Para ingresar como admin */}
      {/* <input type="text" className='position-absolute end-0 top-0 border-0' style={{width:'5px'}} onChange={handleChangeBeAdmin} /> */}
      
      <IoIosArrowBack className='position-absolute top-0 start-0 mt-4 display-4' onClick={handleClickBack} />

      <h2 className='display-1 fw-bold mb-3'>Ajustes</h2>

      <SettingsItem
        text='Notificaciones' 
        link=''
        other={''}
      />
      <SettingsItem
        text='Idioma' 
        link=''
        other={<p className='m-0 fs-4 text-secondary'>Español</p>}
      />
      <SettingsItem
        text='Politica de Privacidad' 
        link=''
        other={''}
      />
      <SettingsItem
        text='Terminos de uso' 
        link=''
        other={''}
      />

      <button className='position-absolute start-50 bottom-0 col-11 translate-middle fs-3 rounded-0 py-3 btn border-0 border-secondary border-top border-bottom' onClick={handleClickCerrarSesion}>Cerrar Sesion</button>
    </section>
  )
}

export default Settings;
