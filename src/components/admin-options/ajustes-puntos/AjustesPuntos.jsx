import React, { useContext, useEffect, useState } from 'react';

// Componentes
import Header from './ajustes-puntos-componentes/Header';
import AjustesPuntosCodigoRef from './AjustesPuntosCodigoRef';

// Firebase
import { addInfoPoints, auth, obtenerInfoApp } from '../../../firebase/firebaseFirestore';

// Context
import { AppContext } from '../../../context/AppContext';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

const AjustesPuntos = () => {

  const navigate = useNavigate();

  const { isAdmin, setIsAdmin, email, setEmail } = useContext(AppContext);

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

  const [configCodeRef, setConfigCodeRef] = useState({
    refFriendGenerate: 10,
    minForSpend: 7500,
    pointsForMinSpend: 50,
  });

  useEffect( () => {
    const f = async () => {
      const res = await obtenerInfoApp();
      if(res.infoPoints != undefined){
        console.log(res);
        console.log(res.infoPoints.activatePoints);
        setActivatePoints(res.infoPoints.activatePoints);
        setEachPointValue(res.infoPoints.eachPointValue);
        setEachMoneyGenerateOnePoint(res.infoPoints.eachMoneyGenerateOnePoint);
        setConfigCodeRef({
          refFriendGenerate: res.infoPoints.refFriendGenerate,
          minForSpend: res.infoPoints.minForSpend,
          pointsForMinSpend: res.infoPoints.pointsForMinSpend,
        });
      }
    }
    f();
  }, [] );

  const [activatePoints, setActivatePoints] = useState(false);
  const [eachPointValue, setEachPointValue] = useState(25);
  const [eachMoneyGenerateOnePoint, setEachMoneyGenerateOnePoint] = useState(1);

  // Handles
  const handleChangeWantPoints = (e) => setActivatePoints(e.target.checked);
  const handleChangeEachPointValue = (e) => (e.target.value > 0) ? setEachPointValue(Number(e.target.value)) : null;
  const handleChangeEachMoneyGenerateOnePoin = (e) => (e.target.value > 0) ? setEachMoneyGenerateOnePoint(Number(e.target.value)) : null;

  const handleClickGuardar = async () => {
    const infoPoints = {
      activatePoints,
      eachPointValue,
      eachMoneyGenerateOnePoint,
      refFriendGenerate: configCodeRef.refFriendGenerate,
      minForSpend: configCodeRef.minForSpend,
      pointsForMinSpend: configCodeRef.pointsForMinSpend,
    }
    const res = await addInfoPoints(email, infoPoints);

    if( res ) alert('Ajustes guardados correctamente');
    else if( !res ) alert('Ha ocurrido un error al guardar los ajustes, intentelo de nuevo');
  }

  const handleClickCategoryPoints = () => navigate('/admin-options/ajustes-puntos/view-category');

  const handleClickAtras = () => navigate('/admin-options');

  return (
    <main>

      <Header handleClickAtras={handleClickAtras}  />

      <section className='mx-4' >
        <p className='m-0 fs-5'>Los puntos son recompensas que los usuarios obtienen al hacer compras, y estas recompensas o puntos los pueden utilizar para hacer compras gratuitas de articulos.</p>


        <div className="form-check form-switch my-4">
          <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={activatePoints} onChange={handleChangeWantPoints} />
          <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Deseas activar la opcion de los puntos ? si desactivas esta funcion los clientes no generaran puntos ni podran usar los que ya tienen</label>
        </div>

        <div className='my-4'>
          <p className='m-0 fw-bold fs-2 text-center'>Reglas de los puntos</p>
          
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <label htmlFor="inputPassword6" className="col-form-label">cada {eachPointValue} pesos genera 1 punto</label>
            </div>
            <div className="col-auto">
              <input type="number" className="form-control" placeholder='pesos' value={eachPointValue} onChange={handleChangeEachPointValue} />
            </div>
          </div>

          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <label htmlFor="inputPassword6" className="col-form-label">Cada punto vale {eachMoneyGenerateOnePoint} pesos</label>
            </div>
            <div className="col-auto">
              <input type="number" className="form-control" placeholder='pesos' value={eachMoneyGenerateOnePoint} onChange={handleChangeEachMoneyGenerateOnePoin} />
            </div>
          </div>

        </div>

        <AjustesPuntosCodigoRef configCodeRef={configCodeRef} setConfigCodeRef={setConfigCodeRef} />

        <button className='btn btn-success form-control fs-3 p-3' style={{marginTop:100}} onClick={handleClickCategoryPoints}>Categoria de puntos</button>

        <button className='btn btn-success form-control fs-3 p-3' style={{marginTop:100}} onClick={handleClickGuardar}>Guardar Informacion</button>

      </section>
      
    </main>
  );
}

export default AjustesPuntos;