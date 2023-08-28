import React, {useContext, useEffect, useState} from 'react';

// Header
import Header from './list-clients-components/Header';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Components
import ItemClientList from './ItemClientList';

// Firebase
import { auth, getAllStatistics, obtenerInfoApp } from '../../../firebase/firebaseFirestore';
import { onAuthStateChanged } from 'firebase/auth';
import { AppContext } from '../../../context/AppContext';

const ListClients = () => {

  const navigate = useNavigate();

  const { isAdmin, setIsAdmin, setEmail } = useContext(AppContext);

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

  const [listUsers, setListUsers] = useState([]);
  
  const [selectValue, setSelectValue] = useState('dinero-gastado');
  const handleChangeSelect = (e) => setSelectValue(e.target.value);
  
  useEffect( () => {
    const f = async () => {
      let users = await getAllStatistics();
      setListUsers(users);
    }
    f();
  }, [] );

  useEffect(()=>{
    const f = async () => {
      let users = [...listUsers];
      
      if(selectValue == 'dinero-gastado'){
        users.sort((a, b) => b.dineroGastado - a.dineroGastado);
        setListUsers(users);
      }else if(selectValue == 'puntos-ganados'){
        users.sort((a, b) => b.puntosGanados - a.puntosGanados);
        setListUsers(users);
      }else if(selectValue == 'puntos-por-invitar'){
        users.sort((a, b) => b.pointsForInviteFriend - a.pointsForInviteFriend);
        setListUsers(users);
      }else if(selectValue == 'puntos-gastados'){
        users.sort((a, b) => b.puntosGastados - a.puntosGastados);
        setListUsers(users);
      }else if(selectValue == 'puntos-restantes'){
        users.sort((a, b) => b.puntosRestantes - a.puntosRestantes);
        setListUsers(users);
      }
      
    }
    f();
  }, [selectValue] );



  const handleClickAtras = () => navigate('/admin-options');
  return (
    <main className='container'>
      <Header handleClickAtras={handleClickAtras}/>
      <section className='mx-3-'>

        <div className='d-flex justify-content-between my-4'>
          <p className='m-0 w-50 fs-3 fw-medium'>Nombre</p>
          <select className="form-select w-50" aria-label="Default select example" onChange={handleChangeSelect}>
            <option value='dinero-gastado'>Dinero gastado</option>
            <option value="puntos-ganados">Puntos ganados</option>
            <option value="puntos-por-invitar">Puntos Por invitar amigos</option>
            <option value="puntos-gastados">Puntos gastados</option>
            <option value="puntos-restantes">Puntos restantes</option>
          </select>
        </div>

        { listUsers.map( (user) => (
          <ItemClientList nombre={user.nombre} email={user.email} valueProp={user} selectValue={selectValue} key={user.email}/>
        ))}

      </section>
    </main>
  )
}

export default ListClients;
