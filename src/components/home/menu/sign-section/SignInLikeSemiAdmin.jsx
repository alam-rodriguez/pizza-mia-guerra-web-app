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
import { registrarAdmin, registrarSemiAdmin } from '../../../../firebase/firebaseAuthGoogle';
import { existAdmin, guardarSemisAdmins, obtenerInfoApp } from '../../../../firebase/firebaseFirestore';
// import { existAdmin, registrarAdmin, registrarUsuario } from '../../../../firebase/firebase';

// Contetx
import { AppContext } from '../../../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import { getMessaging, getToken } from 'firebase/messaging';
import { messaging } from '../../../../firebase/firebaseConfig';

const SignInLikeSemiAdmin = () => {

  // const [canStayHere, setCanStayHere] = useState(false);

  // const [first, setfirst] = useState(second)
  
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

  // const generarToken = async () => {
    function requestPermission() {
      console.log('Requesting permission...');
      Notification.requestPermission().then( async (permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          const token = await getToken(messaging, {
            vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
          });
          console.log(token);
          return(token);
        } else {
          console.log('permiso denegado');
          return false;
        }
      });
    // }
    // const messaging = getMessaging();
    // getToken(messaging, { vapidKey: '<YOUR_PUBLIC_VAPID_KEY_HERE>' }).then((currentToken) => {
    //   if (currentToken) {
    //     return currentToken;
    //   } else {
    //     function requestPermission() {
    //       console.log('Requesting permission...');
    //       Notification.requestPermission().then((permission) => {
    //         if (permission === 'granted') {
    //           console.log('Notification permission granted.');
    //         }
    //       })
    //     }
    //   }
    // }).catch((err) => {
    //   console.log(err);
    //   // ...
    // });
    
  }

  const isSupported = () =>
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window

  const logUserAdmin = async () => {

    const createSemiAdminPromise = new Promise( async (resolve, reject) => {

      const semiAdmins = await obtenerInfoApp();

      // let admin = undefined;
      let saveAdminBD = true;

      let admin = await registrarSemiAdmin();

      if(admin == semiAdmins.admin){
        alert('eres admin y esta pagina es solo para los semis-Admins.');
        resolve();
        return;
      }


      // const token = await getToken(messaging, {
      //   vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
      // }).catch(e => console.log(e));
      // console.log(token);
  
      if(semiAdmins.semisAdmins == undefined){

        admin = await registrarSemiAdmin();

        // const token = await getToken(messaging, {
        //   vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
        // }).catch(e => console.log(e));
        // console.log(token);
        
        

        if (!isSupported()) {
          alert('no podemos mandar notificacioones a tu dispositivo, asi que te mandaremos un email');
          // if(admin != false) saveAdminBD = await guardarSemisAdmins( admins, newAdminsTokens );

          const admins = [ admin ];
          const newAdminsTokens = {...semiAdmins.adminsTokens};
          newAdminsTokens[admin] = 'sin-token';  
          if(admin != false) saveAdminBD = await guardarSemisAdmins( admins, newAdminsTokens );

          return;
        }

        const token = requestPermission();

        console.log(1)
        const admins = [ admin ];
        const newAdminsTokens = {...semiAdmins.adminsTokens};
        newAdminsTokens[admin] = token;
        // const adminsTokens = {...semiAdmins.adminsTokens, admin:token};
        
        if(admin != false) saveAdminBD = await guardarSemisAdmins( admins, newAdminsTokens );
        // if(saveAdminBD) navigate('/home');
        // else console.log('ha ocurrido un error');
      } else if(semiAdmins.semisAdmins.length <= 5){

        // const token = await getToken(messaging, {
        //   vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
        // }).catch(e => console.log(e));
        // console.log(token); 
        const token = requestPermission();
        console.log(2)

        let createAdmin = true;
        admin = await registrarSemiAdmin();
        semiAdmins.semisAdmins.forEach( adminApp => {
          if(adminApp == admin){
            createAdmin = false;
            return;
          }
        });
        if(createAdmin){

          if (!isSupported()) {
            alert('no podemos mandar notificacioones a tu dispositivo, asi que te mandaremos un email');
            const admins = [...semiAdmins.semisAdmins, admin];
            const newAdminsTokens = {...semiAdmins.adminsTokens};
            newAdminsTokens[admin] = 'sin-token';  
            if(admin != false) saveAdminBD = await guardarSemisAdmins( admins, newAdminsTokens );
  
            return;
          }

          
          
          // console.log([...semiAdmins.semisAdmins, admin]);
          
          const admins = [...semiAdmins.semisAdmins, admin];
          const newAdminsTokens = {...semiAdmins.adminsTokens};
          // const adminsTokens =  {...semiAdmins.adminsTokens, admin:token};
          newAdminsTokens[admin] = token;
          console.log( admin );
          if(admin != false) saveAdminBD = await guardarSemisAdmins( admins, newAdminsTokens );
        }else {

          const admin = await registrarSemiAdmin();
          console.log(admin)

          if (!isSupported()) {
            alert('Ya esta cuenta esta registrada como semi admin');
         
            return;
          }

          // const token = await getToken(messaging, {
          //   vapidKey: 'BFawL779CXJIflZHL6ERnDErm4qUQZiixQPTxAyKyiO3G6Sxv9tyBL3JEtNZhrxTxmzz6hjoepQEjtsf7fXw_co'
          // }).catch(e => console.log(e));
          // console.log(token);
          // console.log(admin);
        const token = requestPermission();


        console.log(semiAdmins.adminsTokens)
          let newAdminsTokens = {...semiAdmins.adminsTokens};
          newAdminsTokens[admin] = token;
          // const adminsTokens =  {...semiAdmins.adminsTokens, admin:token};
          console.log(semiAdmins.semisAdmins);
          if(admin != false) saveAdminBD = await guardarSemisAdmins( semiAdmins.semisAdmins, newAdminsTokens );
          alert('Ya esta cuenta esta registrada como semi admin');
        }
        // if(saveAdminBD) navigate('/home');
        // else console.log('ha ocurrido un error');

      }else if(semiAdmins.semisAdmins.length > 5){
        alert('no se pueden registrar como semi admin, hay demacidos admin');
      }

      if(semiAdmins != false && admin != false && saveAdminBD == true){
        resolve();
        setTimeout(() => {
          navigate('/home');
        }, 5000);
      }else {
        reject();
        alert('ha ocurrido un error');
      }

    });

    toast.promise( createSemiAdminPromise, {
      pending: 'Promise is pending',
      success: 'Promise resolved 👌',
      error: 'Promise rejected 🤯'
    });

    

    // const res = await existAdmin();
    // if( res == false){
    //   navigate('/registro-like-admin/details-app');
    // }else {
    //   console.log('Lo siento pero no se puede cambiar el admin de la app una vez creado, para mas informacion comuniquese con el desarrollador');
    // }
  }

  if(viewInfo){
    return (
      <section className='d-flex justify-content-center flex-column align-items-center col-9 m-auto mt-5 vh-100'>
        
        {/* <IoIosArrowBack className='position-absolute top-0 start-0 mt-4 display-4' onClick={handleClickBack} /> */}
  
        <h2 className='display-1 text-danger fw-bold mb-5'>ComiApp</h2>
        <p className='text-start fw-bold fs-3'>Por favor inicia sesion con tu email.</p>
        <p>Ut nisi ad commodo veniam mollit ullamco. In Lorem cillum anim cillum et aliqua. Dolore anim cillum id veniam elit esse excepteur.</p>
  
        <SingInButton 
          icon={<RiAdminFill className='fs-1 text-white' />} 
          bgColor='bg-success'
          text='iniciar sesion admin 2' 
          handleClick={logUserAdmin}
        />
          
        <p className='position-absolute bottom-0 w-75 text-center'>Nostrud adipisicing labore laboris amet non sint laboris aute nulla cillum est voluptate.</p>
        <ToastContainer />
      </section>
    )
  }
}

export default SignInLikeSemiAdmin;
