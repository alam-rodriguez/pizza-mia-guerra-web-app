import React, { useContext, useEffect, useState } from 'react';

// React-Icons

// Firebase
import { auth, getCategories, obtenerInfoApp } from '../../../firebase/firebaseFirestore';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import Header from './components/Header';

// Context
import { AppContext } from '../../../context/AppContext';
import { ToastContainer } from 'react-toastify';
import { onAuthStateChanged } from 'firebase/auth';

const ViewCategories = () => {
  
  const { setCategorySelected, appInfo, isAdmin, setEmail, setInfoPoints, setAppInfo, setIsAdmin } = useContext(AppContext);

  const navigate = useNavigate();

  // useEffect( () => {
  //   if(appInfo == null){
  //     // logear usuario automaticamente
  //     onAuthStateChanged(auth, (user) => {
  //       if(user == null) {
  //         navigate('/home'); 
  //       }else {
  //         getData(user.email);
  //         console.log(user.email);
  //         setEmail(user.email);
  //       }
  //     });
  //     // obtener info de la app y compruebo si es admin
  //     const getData = async (emailUser) => {
  //       let status = 'customer';
  //       const appInfo = await obtenerInfoApp();
  //       if(appInfo == 'no hay datos de esta app'){
  //         navigate('/home'); 
  //         return
  //       }
  //       console.log(appInfo);
  //       setInfoPoints(appInfo.infoPoints);
  //       // const pedidosClient = await getPedidosByClient( emailUser );
  //       // setClientOrders(pedidosClient);
  //       if(appInfo.nombre == undefined){
  //         // navigate('/registro-like-admin/details-app');
  //         alert('No hay datos de la app');
  //         navigate('/home');
  //         return; 
  //       } 
  //       setAppInfo(appInfo);
  //       if(appInfo.admin == emailUser) status = 'admin';
  //       else {
  //         if(appInfo.semisAdmins != undefined){
  //           appInfo.semisAdmins.forEach( (semiAdmin) => {
  //             if(semiAdmin == emailUser) {
  //               status = 'semi-admin';
  //             }else status = 'customer';
  //           });
  //         }
  //       }
  //       console.log(isAdmin)
  //       if(status != 'admin') navigate('/home');
  //     }
  //   }
  // }, [] );

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

  

  // Effects
  useEffect( () => {
    const f = async () => { 
      const res = await getCategories();
      res.sort((a, b) => a.position - b.position);
      setCategories(res);
    }
    f();
  }, [] );

  // States
  const [categories, setCategories] = useState(null);

  // handles
  const handleClickCategory = (category) => {
    setCategorySelected(category);
    navigate('/edit-category');
  }

  const handleClickCrearCategoria = () => navigate('/create-categories');

  const handleClickAtras = () => navigate('/admin-options');

  if(categories != null){
    return (
      <main className='border-0 mx-3-'>
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} />
  
        <section>
  
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height: '80vh'}}>
            { categories != null 
              ? categories.length > 0 
                ? categories.map((category)=>(
                  <div className='border-bottom py-2' key={category.id} onClick={()=>handleClickCategory(category)}>
                    <p className='m-0 fs-1 fw-medium'>{category.position} - {category.nombre}</p>
                  </div>
                ))
                : <p className='m-0 fs-1 fw-medium text-center'>No hay categorias</p>
            : <></>}
          </div>
  
          <div className='bg-white position-fixed w-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            <button className='btn form-control btn-success fs-3 rounded-3' onClick={handleClickCrearCategoria}>Crear Categoria</button>
          </div>
  
        </section>
        <ToastContainer />
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

export default ViewCategories;

