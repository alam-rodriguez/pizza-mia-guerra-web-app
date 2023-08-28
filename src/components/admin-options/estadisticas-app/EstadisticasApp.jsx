import React, { useState, useEffect, useContext } from 'react';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Components
import Header from './estadisticas-app-components/Header';
import ItemTableEstadisticas from './estadisticas-app-components/ItemTableEstadisticas';

// Firebase
import { auth, getEveryStatistics, obtenerInfoApp } from '../../../firebase/firebaseFirestore';

// Swal-alerts
import Swal from 'sweetalert2';
import { onAuthStateChanged } from 'firebase/auth';
import { AppContext } from '../../../context/AppContext';

const EstadisticasApp = () => {

  const navigate = useNavigate();

  const { isAdmin, setEmail, setIsAdmin} = useContext(AppContext);

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

  const alert = (text) => Swal.fire({
    icon: 'info',
    title: 'Nota',
    text: text,
  });

  // to render
  const [dias, setDias] = useState([]);
  const [months, setmonths] = useState([]);
  const [anios, setAnios] = useState([]);

  // Estadisticas to view
  const [estadisticasApp, setEstadisticasApp] = useState({
    dineroGastado: 0,
    puntosGenerados: 0,
    puntosGastados: 0,
    cantidadClientes: 0,
  });

  // Todas las estadisticas
  const [everyStatistics, setEveryStatistics] = useState([]);

  useEffect( () => {

    const f = async () => {
      const everyStatistics = await getEveryStatistics();
      setEveryStatistics(everyStatistics);

      let dineroGastado = 0;
      let puntosGenerados = 0;
      let puntosGastados = 0;
      let cantidadClientes = 0;
      everyStatistics.forEach( (statistics) => {
        dineroGastado += statistics.gastado;
        puntosGenerados += statistics.puntosGenerados;
        puntosGastados += statistics.puntosGastados;
        cantidadClientes = cantidadClientes + 1;
      });
      setEstadisticasApp({
        dineroGastado: dineroGastado,
        puntosGenerados: puntosGenerados,
        puntosGastados: puntosGastados,
        cantidadClientes: cantidadClientes,
      })
      console.log(everyStatistics);
    }
    f();

    let dias = [];
    for(let i = 1 ; i <= 31; i++){
      dias.push(<option key={i} value={i}>{i}</option>);
    }
    setDias(dias);

    const eachMonth = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Obtubre', 'Noviembre', 'Dicciembre'];
    let monthss = [];
    for(let i = 1; i < eachMonth.length; i++){
      monthss.push(<option key={i} value={i + 1}>{eachMonth[i]}</option>);
    }
    setmonths(monthss);

    let anios = [];
    for(let i = 2020 ; i <= 2100; i++){
      anios.push(<option key={i} value={i}>{i}</option>);
    }
    setAnios(anios);
  }, [] );

  // Dia, Mes y Año
  const [daySelect, setDaySelect] = useState('todos');
  const [monthSelect, setMonthSelect] = useState('todos');
  const [yearSelect, setYearSelect] = useState('todos');

  // handle par cambiar dia, mes y año seleccionado
  const handleClickDaySelect = () => {
    if(monthSelect == 'todos'){
      alert('No puedes seleccionar el dia sin seleccionar mes');
      return;
    }
  }
  const handleChangeDaySelect = (e) => setDaySelect(e.target.value);
  
  const handleClickMonthSelect = () => {
    if(yearSelect == 'todos'){
      alert('No puedes seleccionar el mes sin seleccionar año');
      return;
    }
  }
  const handleChangeMonthSelect = (e) => setMonthSelect(e.target.value);
  
  const handleChangeYearSelect = (e) => setYearSelect(e.target.value);

  // handleClick para buscar estadisticas
  const handleClickBuscar = async () => {

    let res = [];

    everyStatistics.forEach( (statistics) => {
      
      // Si no hay ninguna fecha seleccionada
      if(daySelect == 'todos' && monthSelect == 'todos' && yearSelect == 'todos') {
        res.push(statistics);
      }

      // Si hay año seleccionado
      if(daySelect == 'todos' && monthSelect == 'todos' && yearSelect != 'todos'){
        console.log(yearSelect);
        const fechaStatistcs = statistics.fecha.split('/');
        const anioStatistics = fechaStatistcs[2];
        // console.log(anioStatistics);
        if(anioStatistics == yearSelect){
          res.push(statistics);
          console.log(statistics);
        }
      }

      // Si hay mes seleccionado y año seleccionado 
      if(daySelect == 'todos' && monthSelect != 'todos' && yearSelect != 'todos'){
        const fechaStatistcs = statistics.fecha.split('/');
        const monthStatistics = fechaStatistcs[1];
        const anioStatistics = fechaStatistcs[2];
        console.log(monthStatistics);
        console.log(monthSelect)
        if(anioStatistics == yearSelect && monthStatistics == monthSelect){
          res.push(statistics);
        }
      }

      // Si hay dia seleccionado, mes seleccionado y año seleccionado 
      if(daySelect != 'todos' && monthSelect != 'todos' && yearSelect != 'todos'){
        const fechaStatistcs = statistics.fecha.split('/');
        const diaStatistics = fechaStatistcs[0];
        const monthStatistics = fechaStatistcs[1];
        const anioStatistics = fechaStatistcs[2];
        if(diaStatistics == daySelect && anioStatistics == yearSelect && monthStatistics == monthSelect){
          res.push(statistics);
        }
      }
      
    });

    let dineroGastado = 0;
    let puntosGenerados = 0;
    let puntosGastados = 0;
    let cantidadClientes = 0;

    res.forEach( (statistics) => {
      dineroGastado += statistics.gastado;
      puntosGenerados += statistics.puntosGenerados;
      puntosGastados += statistics.puntosGastados;
      cantidadClientes = cantidadClientes + 1;
    });
    setEstadisticasApp({
      dineroGastado: dineroGastado,
      puntosGenerados: puntosGenerados,
      puntosGastados: puntosGastados,
      cantidadClientes: cantidadClientes,
    })
    console.log(everyStatistics);

  }

  const handleClickAtras = () => navigate('/admin-options');

  return (
    <main className='container'>
      <Header handleClickAtras={handleClickAtras}/>
      <section className='mx-3-'>

        <div className='row'>

          <div className='col-3 my-4 px-1'>
            <p className='m-0 fs-5 fw-medium text-center'>Dia</p>
            <select className="form-select" aria-label="Default select example" onChange={handleChangeDaySelect} onClick={handleClickDaySelect}>
              <option value='todos' defaultValue>Todos</option>
              {dias}
            </select>
          </div>

          <div className='col-3 my-4 px-1'>
            <p className='m-0 fs-5 fw-medium text-center'>Mes</p>
            <select className="form-select" aria-label="Default select example" onChange={handleChangeMonthSelect} onClick={handleClickMonthSelect}>
              <option value='todos' defaultValue>Todos</option>
              {months}
            </select>
          </div>

          <div className='col-3 my-4 px-1'>
            <p className='m-0 fs-5 fw-medium text-center'>Año:</p>
            <select className="form-select" aria-label="Default select example" onChange={handleChangeYearSelect}>
              <option value='todos' defaultValue>Todos</option>
              {anios}
            </select>
          </div>

          <div className='col-3 d-flex justify-content-center align-items-center px-1'>
            <button className='btn btn-success' onClick={handleClickBuscar}>Buscar</button>
          </div>

        </div>

        <div>
          <p className='text-center fs-3 fw-medium'>Resutado</p>

          <ItemTableEstadisticas
            llave='Dinero gastado por usuarios:' 
            valor={Math.trunc(estadisticasApp.dineroGastado) + ' $'}
          />

          <ItemTableEstadisticas
            llave='Puntos generados por usuarios:' 
            valor={Math.trunc(estadisticasApp.puntosGenerados)}
          />

          <ItemTableEstadisticas
            llave='Puntos gastados por usuarios:' 
            valor={Math.trunc(estadisticasApp.puntosGastados)}
          />

          <ItemTableEstadisticas
            llave='Cantidad de usuarios:' 
            valor={Math.trunc(estadisticasApp.cantidadClientes)}
          />

        </div>

      </section>
    </main>
  )
}

export default EstadisticasApp;
