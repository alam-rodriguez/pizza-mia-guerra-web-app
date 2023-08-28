// React
import React, { useEffect, useContext } from 'react';

// React Router
import { useNavigate } from 'react-router-dom';

// Componentes
import CreateArticleHeader from './sections/CreateArticleHeader';

// Context
import { AppContext } from '../../context/AppContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, obtenerInfoApp } from '../../firebase/firebaseFirestore';

const AdminOptions = () => {

  const navigate = useNavigate();

  const { isAdmin, setEmail, setIsAdmin } = useContext(AppContext);

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

  // Handles
  const handleClickViewCategories = () => navigate('/view-categories') ;
  const handleClickViewArticles = () => navigate('/view-articles');
  const handleClickviewEstadisticasApp = () => navigate('/admin-options/view-estadisticas-app');
  const handleClickAjustesPuntos = () => navigate('/admin-options/ajustes-puntos');
  const handleClickViewListArticles = () => navigate('/admin-options/list-clients');

  return (
    <section className='container'>

      {/* Header */}
      <CreateArticleHeader path='/home' />

      {/* Btn para ver las categorias */}
      <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickViewCategories}>Ver las Categorias</button>

      {/* Btn para ver los articulos */}
      <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickViewArticles}>Ver los Articulos</button>

      <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickviewEstadisticasApp}>Estadiscas de app</button>

      <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickViewListArticles}>Lista de Clientes</button>

      <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickAjustesPuntos}>Ajustes de Puntos</button>
      
    </section>
  );
}

export default AdminOptions;
