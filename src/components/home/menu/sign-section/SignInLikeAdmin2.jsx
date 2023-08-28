import React, { useContext, useState, useEffect } from 'react';

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
import { infoApp } from '../../../../firebase/firebaseFirestore';
// import { registrarAdmin, registrarUsuario, infoApp } from '../../../../firebase/firebase';

// Contetx
import { AppContext } from '../../../../context/AppContext';

const SignInLikeAdmin2 = () => {
  const navigate = useNavigate();

  const { isAdmin, color1 } = useContext(AppContext); 

  const [info, setInfo] = useState({
    nombre: '',
    whatsapp: '',
    instagram: '',
    facebook: '',
    descripcion: '',
  });

  // const handleClickBack = () => navigate('/home');

  const [viewInfo, setViewInfo] = useState(false);
  useEffect( () => {
    const password = prompt('Contraseña');
    if(password != '123456789'){
      navigate('/home');
    }else {
      setViewInfo(true);
    }
  }, [] );

  const handleClickGuardarInfo = async () => {
    console.log(info);
    const res = await infoApp(info);
    if(res == true){
      navigate('/home');
    }
  }

  // Handle Inputs
  const handleChangeNombre = (e) => setInfo( state => ({...state, nombre: e.target.value} ) );
  const handleChangeWhatsapp = (e) => setInfo(state => ({...state, whatsapp: e.target.value} ) );
  const handleChangeinstagram = (e) => setInfo(state => ({...state, instagram:e.target.value} ) );
  const handleChangeFacebook = (e) => setInfo(state => ({...state,facebook: e.target.value } ) );
  const handleChangeDescripcion = (e) => setInfo(state => ({...state,descripcion: e.target.value } ) );

  if(viewInfo){
    return (
      <section className='d-flex flex-column align-items-center col-9 m-auto vh-100' style={{paddingTop:60}}>
        
        {/* <IoIosArrowBack className='position-absolute top-0 start-0 mt-4 display-4' onClick={handleClickBack} /> */}
  
        <h2 className='display-1 text-danger fw-bold mb-5'>PidoYa</h2>
        <p className='text-start fw-bold fs-5'>Haz iniciado sesion como admin, pero ahora tienes que agregar mas datos</p>
        {/* <p>Ut nisi ad commodo veniam mollit ullamco. In Lorem cillum anim cillum et aliqua. Dolore anim cillum id veniam elit esse excepteur.</p> */}
  
        {/* <form action=""> */}
  
          <p className='text-center fs-3 fw-bold'>Nombre de Negocio</p>
          <div className="input-group mb-3">
            <span className="input-group-text" id="inputGroup-sizing-default">Nombre</span>
            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='nombre del negocio' onChange={handleChangeNombre} />
          </div>
          <p className='text-center fs-3 fw-bold'>Redes</p>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">WhatsApp</span>
              <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Link de tu WhatsApp' onChange={handleChangeWhatsapp}/>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Instagram</span>
              <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Link de tu Instagram' onChange={handleChangeinstagram} />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text" id="inputGroup-sizing-default">Facebook</span>
              <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Link de tu Facebook' onChange={handleChangeFacebook} />
            </div>
  
            <p className='text-center fs-3 fw-bold'>Descripcion de tu negocio</p>
   
            <textarea className='border w-100' style={{minHeight:100, maxHeight:500}} onChange={handleChangeDescripcion}></textarea>
  
            
            <button className={`btn form-control text-white mt-4 fs-4 position-absolute bottom-0 start-50 translate-middle mb-5 w-75 p-2 ${color1.bgColor}`} onClick={handleClickGuardarInfo} >Guardar Informacion</button>
            
        {/* </form> */}
        
      </section>
    );
  }
}

export default SignInLikeAdmin2
