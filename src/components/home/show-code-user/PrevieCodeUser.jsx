import React, { useContext, useEffect } from 'react';

// Image
import PersonWithCell from '../../../images/home/personHoldingPhone.webp'

// Context
import { AppContext } from '../../../context/AppContext';

// Component
import ShowCodeUser from './ShowCodeUser';

// Firebase
import { getInfoUser } from '../../../firebase/firebaseFirestore';

// React-Toaster
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const PrevieCodeUser = ({viewCodeUser, setViewCodeUser}) => {

  const { email, color1, codeUser, setCodeUser } = useContext(AppContext);

  const notification = (text) => Swal.fire({
    icon: 'info',
    title: 'No puedes',
    text: text,
  });
  
  // toast.info( text, {
  //   position: "top-center",
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: true,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "light",
  // });

  const handleClick = async () => {
    if(email == null) {
      notification('Debes iniciar sesion y hacer un pedido para acceder a esta funciona');
      return;
    } 
    if(email != null){
      const res = await getInfoUser(email);
      console.log(res);
      if(res == 'no-exist' || res.codeRef == 0){
        notification('Aun no tienes tu codigo de usuario, para conseguirlo debes hacer un pedido');
        return;
      }else {
        setCodeUser(res.codeRef);
        console.log('first');
        setViewCodeUser('open');
      }
      // if(res == 'no-exist') notification('Aun no tienes tu codigo de usuario, para conseguirlo debes hacer un pedido');
      // if(res.codeRef == 0) notification('Aun no tienes tu codigo de usuario, para conseguirlo debes hacer un pedido');
    }
  }

  return (
    <main>
      <section className={`${color1.bgColor} rounded-4 w-100 my-5 d-flex flex-row overflow-hidden`} style={{height:120, minWidth:'100%'}} onClick={handleClick}>
      
        <div className='d-flex flex-column ms-4 justify-content-center'>
          <h3 className='text-white fw-medium m-0'>CENAR EN?</h3>
          <p className='text-white m-0 fw-light' style={{fontSize:14.5}}>muestra tu código QR para ganar puntos</p>
        </div>

        <div className='w-50 position-relative'>
          <img className='position-absolute bottom-0 start-50 translate-middle-x' src={PersonWithCell} alt="" style={{height:'auto', width:'220px'}}/>
        </div>

      </section>

      { (viewCodeUser == 'open' || viewCodeUser == 'close')
        ? <ShowCodeUser viewCodeUser={viewCodeUser} setViewCodeUser={setViewCodeUser} />
        : <></>
      }
    </main>
  );
}

export default PrevieCodeUser
