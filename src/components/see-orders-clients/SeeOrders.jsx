import React, { useContext, useEffect, useState } from 'react';

// Firebase
import { auth, getordersNotView, obtenerInfoApp, orderOfToday } from '../../firebase/firebaseFirestore';

// Components
import Header from './see-orders-clients-components/Header';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Context
import { AppContext } from '../../context/AppContext';
import Swal from 'sweetalert2';
import { onAuthStateChanged } from 'firebase/auth';
import { onMessage } from 'firebase/messaging';
import { toast, ToastContainer } from 'react-toastify';
import { messaging } from '../../firebase/firebaseConfig';

const SeeOrders = () => {

  const navigate = useNavigate();

  const { SeletedOrder, setSeletedOrder, isAdmin, setIsAdmin, setEmail } = useContext(AppContext);

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

  const [orders, setOrders] = useState(null);

  const [dateToSearch, setDateToSearch] = useState('');

  const [hayPedidos, setHayPedidos] = useState(false);

  const fecha = () => {
    const day = new Date();
    const hoy = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
    setDateToSearch(hoy);
    return hoy;
  }

  const viewNewOrders = async () => {
    
    if(dateToSearch === '') fecha();
    
    const orders = await orderOfToday(dateToSearch);
    
    if(orders == 'no-hay-pedidos') {
      setHayPedidos(false);
      setOrders([]);
      return
    }
  
    if(orders != null && orders != 'no-hay-pedidos' && !viewSaved){
      setHayPedidos(true);
      let res = [];
      orders.forEach( (order) => {
        if(!order.wasView){
          Swal.fire({
            icon: 'warning',
            title: 'Nuevo pedido',
            text: 'Hay un nuevo pedido, tienes que revisarlo',
          });
        }
        if(!order.guardar) res.push(order);
      });
      res.sort((a, b) => parseFloat(`${b.horaPedido.hora}.${b.horaPedido.minuto}`) -  parseFloat(`${a.horaPedido.hora}.${a.horaPedido.minuto}`));
      setOrders(res);
      return;
    }

    if(orders != null && orders != 'no-hay-pedidos' && viewSaved) {
      setHayPedidos(true);
      orders.sort((a, b) => parseFloat(`${b.horaPedido.hora}.${b.horaPedido.minuto}`) -  parseFloat(`${a.horaPedido.hora}.${a.horaPedido.minuto}`));
      setOrders(orders);
      return;
    }

  }

  const [viewSaved, setviewSaved] = useState(false);

  useEffect( () => {
    viewNewOrders();
    // const timeInterval = setInterval(viewNewOrders, 60000);
    // return () => {
    //   clearInterval(timeInterval);
    // }
  }, [dateToSearch, viewSaved] );

  useEffect( () => {
    onMessage(messaging, message => {
      console.log('tu mensaje:', message);
      toast(message.notification.title);
      viewNewOrders();
    })
  }, [] );

  // const viewOders = async () => {
  //   if(isAdmin == 'admin' || isAdmin == 'semi-admin'){
  //     console.log(isAdmin)
  //     const day = new Date();
  //     const hoy = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
  //     const orders = await orderOfToday(hoy);

  //     if(orders == 'no-hay-pedidos') return;
  //     orders.forEach( (order) => {
  //       if(!order.wasView){
  //         alert('Hay un nuevo pedido, tienes que revisarlo');
  //       }
  //     })
  //   }
  // }
  
  // useEffect( () => {
  //   viewOders();
  //   setInterval(viewOders,60000);
  // }, [isAdmin] );

  const handleClickOrder = (orden) => {
    setSeletedOrder(orden);
    navigate('/see-order');
  }

  const handleClickChangeDate = (e) => {
    const fechaPartes = e.target.value.split('-');
    const dia = Number(fechaPartes[2]);
    const mes = Number(fechaPartes[1]);
    const anio = Number(fechaPartes[0]);
    const hoy = `${dia}/${mes}/${anio}`;
    console.log(hoy);
    setDateToSearch(hoy);
  }

  const handleChangeSeeGuardados = (e) => setviewSaved(e.target.checked);

  return (
    <main className='overflow-scroll container vh-100'>
      <Header />

      <section>

        <div className='d-flex align-items-center m-2 gap-3 justify-content-center'>
          <input className='w-50 border-black border text-black bg-transparent rounded-3 border p-3' type="date" style={{height:30}} onChange={handleClickChangeDate} />

          <div className="d-flex gap-3 align-items-center justify-content-center form-check form-switch w-50">
            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" onChange={handleChangeSeeGuardados} />
            <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Ver todos los pedidos</label>
          </div>
        </div>

        { 
          (orders != null )
            ? orders != 'no-hay-pedidos' && orders.length > 0 ?
              orders.map((orden)=>{
                let total = 0;
                orden.pedido.map( (item) => {
                  total += Number(item.precioVariosArticles);
                });
                if(orden.deliveryInfo != null) total += Number(orden.deliveryInfo.costo);

                let puntos = 0;
                orden.pedidoOfPoints.map( (item) => {
                  puntos += Number(item.PuntosVariosArticles);
                });
                return(
                  <div key={orden.id} className='border m-4 shadow-lg rounded-5 border border-success' onClick={ () => handleClickOrder(orden) }>

                    <p className='m-0 fw-bold fs-3 text-center py-2 border-bottom border-success'>{orden.user}</p>
                    <div className='p-3'>

                      <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                        <p className='m-0 fw-bold fs-5 w-25'>Pedido id:</p>
                        <p className='m-0 fw-medium fs-5 w-75 text-end'>{orden.id}</p>
                      </div>

                      <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                        <p className='m-0 fw-bold fs-5 w-25'>Fecha:</p>
                        <p className='m-0 fw-medium fs-5 w-75 text-end'>{orden.dia} | {orden.horaPedido.hora}:{orden.horaPedido.minuto}</p>
                      </div>

                      { orden.pedidoOfPoints.length > 0 ?  
                        <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                          <p className='m-0 fw-bold fs-5 w-25'>Puntos:</p>
                          <p className='m-0 fw-medium fs-5 w-75 text-end'>{puntos}</p>
                        </div>
                        : <></>
                      }

                      { orden.isDelivery ?  
                        <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                          <p className='m-0 fw-bold fs-5 w-25'>Delivery:</p>
                          <p className='m-0 fw-medium fs-5 w-75 text-end'>{orden.deliveryInfo.lugar}</p>
                        </div>
                        : <></>
                      }

                    </div>

                    <div className='d-flex justify-content-between border-top border-success p-3'>
                      <p className='m-0 fw-bold fs-5 w-25'>Total:</p>
                      <p className='m-0 fw-bold fs-5 w-75 text-end'>{total}</p>
                    </div>

                  </div>
                );
              })
            : (!viewSaved && hayPedidos)
              ? <p className='text-center fs-4 mt-5 fw-medium'>Todos los pedidos estan guardados.</p> 
              : <p className='text-center fs-4 mt-5 fw-medium'>No hay ningun pedido aun.</p> 
          : <p className='text-center fs-4 mt-5 fw-medium'>Cargando pedidos...</p> 
        }

      </section>
      <ToastContainer />
    </main>
  )
}

export default SeeOrders;









// console.log(res);
      // const res = await getordersNotView();
      // console.log(res)

















  //     const [dateToSearch, setDateToSearch] = useState('');

  // useEffect( () => {
  //   const day = new Date();
  //   const hoy = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
  //   setDateToSearch(hoy);
  // }, [] );

  // const [viewSaved, setviewSaved] = useState(false);

  // useEffect( () => {
  //   const f = async () => {
  //     const orders = await orderOfToday(dateToSearch);
  //     console.log(dateToSearch);
  //     const res = [];
  //     if(orders != null && orders != 'no-hay-pedidos' && !viewSaved){
  //       orders.forEach( (order) => {
  //         if(!order.guardar){
  //           res.push(order);
  //           console.log(order);
  //         }
  //       });
  //       setOrders(res);
  //     }else {
  //       setOrders(orders);
  //     }
      
  //   }
  //   f();
  // }, [dateToSearch, viewSaved] );