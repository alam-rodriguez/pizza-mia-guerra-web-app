import React, { useContext, useEffect, useState } from 'react';

// Firebase
import { auth, getCategoryPoints, obtenerInfoApp } from '../../../../firebase/firebaseFirestore';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import Header from '../ajustes-puntos-componentes/Header'

// Context
import { AppContext } from '../../../../context/AppContext';
import { onAuthStateChanged } from 'firebase/auth';

const ViewCategoryPuntos = () => {

  const navigate = useNavigate();

  const { isAdmin, setCategorySelected, email, setEmail, setIsAdmin } = useContext(AppContext);

  useEffect( () => {
    if(isAdmin == ''){
      // logear usuario automaticamente
      onAuthStateChanged(auth, (user) => {
        if(user == null) {
          navigate('/home'); 
        }else {
          getData(user.email);
          console.log(user.email);
          setEmail(user.email);
        }
      });
      // obtener info de la app y compruebo si es admin
      const getData = async (emailUser) => {
        let status = 'customer';
        const appInfo = await obtenerInfoApp();
        if(appInfo == 'no hay datos de esta app'){
          navigate('/home'); 
          return
        }
        if(appInfo.nombre == undefined){
          alert('No hay datos de la app');
          navigate('/home');
          return; 
        } 
        if(appInfo.admin == emailUser) status = 'admin';
        else {
          if(appInfo.semisAdmins != undefined){
            appInfo.semisAdmins.forEach( (semiAdmin) => {
              if(semiAdmin == emailUser) status = 'semi-admin';
              else status = 'customer';
            });
          }
        }
        setIsAdmin(status);
        if(status != 'admin') navigate('/home');
      }
    }
  }, [] );

  // States
  const [categoryPuntos, setCategoryPuntos] = useState(null);

  // Effects
  useEffect( () => {
    const f = async () => {
      const categoryPuntos = await getCategoryPoints();
      console.log(categoryPuntos);
      if(categoryPuntos == 'no existe la categoria de puntos'){
        if(email == null){
          navigate('/home');

        }else{
          navigate('/admin-options/ajustes-puntos/create-category');
        }
      }else{
        setCategoryPuntos(categoryPuntos);
      }
    }
    f();
  }, [] );

  // Handles
  const handleClickCategoryPoints = () => {
    setCategorySelected(categoryPuntos);
    navigate('/admin-options/ajustes-puntos/create-category');
  }

  const handleClickCrearCategoria = () => {
    setCategorySelected(categoryPuntos);
    navigate('/admin-options/ajustes-puntos/view-articles');
  };

  const handleClickAtras = () => navigate('/admin-options/ajustes-puntos');

  if(categoryPuntos != null){
    return (
      <main className='border-0 mx-3' >
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} />
  
        <section className='d-flex flex-column gap-4'>
          <div className='border-bottom py-4' key={categoryPuntos.id} onClick={handleClickCategoryPoints}>
            <p className='m-0 fs-1 fw-medium'>{categoryPuntos.nombre}</p>
          </div>
  
        <button className='btn form-control btn-success fs-3 position-absolute bottom-0 start-50 mb-4 translate-middle rounded-0' onClick={handleClickCrearCategoria}>Articulos de la Categoria</button>
  
        </section>
      </main>
    );
  }else {
    return(
      <main className='d-flex justify-content-center align-items-center vh-100'>
        <div className="spinner-border text-success fs-2" role="status" style={{height:50, width:50}}>
          <span className="visually-hidden">Loading...</span>
        </div> 
      </main>
    );
  }
}


export default ViewCategoryPuntos;
