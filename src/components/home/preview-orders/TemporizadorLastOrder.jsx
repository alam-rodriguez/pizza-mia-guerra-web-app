import React, {useEffect, useContext, useState} from 'react';

// Context
import { AppContext } from '../../../context/AppContext';

// Iconos
import { AiFillInfoCircle } from 'react-icons/ai';

// Swal-Notification
import Swal from 'sweetalert2';

// Temporizador
import Temporizador from '../temporizador/Temporizador';
import { getPedidosByClient } from '../../../firebase/firebaseFirestore';

const TemporizadorLastOrder = ({viewMenu}) => {

  const {email, clientOrders, setClientOrders, color1, SeletedOrder, setSeletedOrder} = useContext(AppContext);

  const [viewTempSection, setviewTempSection] = useState(false);

  const [minutosTemp, setMinutosTemp] = useState(0);
  const [segundosTemp, setSegundosTemp] = useState(0);

  const swalNotification = (text, icon = 'info') => Swal.fire({
    icon: icon,
    title: 'Estado de pedido',
    text: text,
  });

  useEffect( () => {
    const f = async () => {
      if(clientOrders == null){
        const pedidosClient = await getPedidosByClient( email );
        setClientOrders(pedidosClient);
      }
    }
    f();
  }, [email] );

  useEffect( () => {
    console.log(clientOrders);
    if(clientOrders != null){

      const fecha = new Date();

      console.log(clientOrders);
      clientOrders.forEach( (order) => {
        if(!order.guardar){

          setSeletedOrder(order);
          setviewTempSection(true);

          const horaPedido =  fecha.setHours(fecha.getHours(), fecha.getMinutes(), fecha.getSeconds()); // Establecer la primera hora como 10:30 AM

          const horaActual = fecha.setHours(order.horaPedido.hora, order.horaPedido.minuto, order.horaPedido.segundo); // Establecer la segunda hora como 8:45 AM

          const tiempoRestante = horaPedido - horaActual;

          var horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
          var minutos = Math.floor((tiempoRestante / (1000 * 60)) % 60);
          var segundos = Math.floor((tiempoRestante / 1000) % 60);

          console.log("La diferencia es: " + horas + " horas y " + minutos + " minutos y" + segundos + " segundos");
          
          // const waitingTime = 25;
          // if(horas == 0 && minutos < waitingTime || minutos <= 0){
          //   setMinutosTemp(waitingTime - minutos);
          //   setSegundosTemp(60 - segundos);
          // }
          // else if((horas > 0 || minutos > waitingTime) && !order.isReady) swalNotification('Su pedido casi esta listo');  
          // else if((horas > 0 || minutos > waitingTime) && order.isReady) swalNotification('Su pedido ya esta listo', 'success');

          const waitingTime = 25;
          if(horas == 0 && minutos < waitingTime -2) {
            setMinutosTemp(waitingTime - minutos);
            setSegundosTemp(60 - segundos);
          }else if(order.isReady && !order.guardar) {
            swalNotification('Su pedido ya esta listo', 'success');
          }
          else if((horas < 0 || minutos > waitingTime) && !order.isReady) swalNotification('Su pedido casi esta listo');  
          else if((horas < 0 || minutos > waitingTime) && order.isReady) swalNotification('Su pedido ya esta listo', 'success');
          
        }
      });
      
    }
  }, [clientOrders] );  
  
  const [viewTmporizador, setViewTmporizador] = useState(false);

  const handleClickViewTemp = () => {

    if(minutosTemp == 0){
      if(!SeletedOrder.isReady) swalNotification('Su pedido casi esta listo');
      else if(SeletedOrder.isReady) swalNotification('Su pedido ya esta listo', 'success');
    }
    setViewTmporizador(true);
    setTimeout(() => {
      setViewTmporizador(false);
    }, 10000);
  }

  return (
    // <section className='position-fixed top-0 start-50 translate-middle-x z-3 mt-0 p-2 '>
    // <div className='position-absolute top-0 start-0 vw-100'>
      // <div className='position-absolute top-0 start-0'>
      <section className={`${!viewMenu ? 'position-fixed': 'position-absolute'} mt-5 top-0 start-0 vw-100 vh-100- z-1 px-4  pt-0 animate__animated animate__pulse bg-danger`} style={{height:0}}>
      {/* <div className='position-absolute top-0 start-100 '> */}

      { viewTempSection 
        ? <AiFillInfoCircle className={`position-absolute display-1 top-0- start-100- translate-middle-x ${color1.textColor} shadow-lg rounded-5`} onClick={handleClickViewTemp} style={{right:'-20px', top:'10px'}}/>
        : <></>
      }

      { minutosTemp > 0 ?
        <Temporizador 
          className={`m-0 fs-2 d-inline-block ${color1.bgColor} text-white rounded-5 p-3 animate__animated position-absolute start-50 mt-5 translate-middle-x border shadow-lg ${viewTmporizador ? 'animate__fadeInTopRight' : 'animate__fadeOutTopRight d-none'} `}
          segundos={segundosTemp} 
          minutos={minutosTemp} 
          horas={0}
        />
      : <></>
      }
        
      {/* </div> */}
      
    </section>
      // </div>
    // </div>
  );
}

export default TemporizadorLastOrder;


// if(minutos == 0) setMinutosTemp(25);
            // else if(minutos == 1) setMinutosTemp(24);
            // else if(minutos == 3) setMinutosTemp(23);
            // else if(minutos == 3) setMinutosTemp(22);
            // else if(minutos == 4) setMinutosTemp(21);
            // else if(minutos == 5) setMinutosTemp(20);
            // else if(minutos == 6) setMinutosTemp(19);
            // else if(minutos == 7) setMinutosTemp(18);
            // else if(minutos == 8) setMinutosTemp(17);
            // else if(minutos == 9) setMinutosTemp(16);
            // else if(minutos == 10) setMinutosTemp(15);
            // else if(minutos == 11) setMinutosTemp(14);
            // else if(minutos == 12) setMinutosTemp(13);
            // else if(minutos == 13) setMinutosTemp(12);
            // else if(minutos == 14) setMinutosTemp(11);
            // else if(minutos == 15) setMinutosTemp(10);
            // else if(minutos == 16) setMinutosTemp(9);
            // else if(minutos == 17) setMinutosTemp(8);
            // else if(minutos == 18) setMinutosTemp(7);
            // else if(minutos == 19) setMinutosTemp(6);
            // else if(minutos == 20) setMinutosTemp(5);
            // else if(minutos == 21) setMinutosTemp(4);
            // else if(minutos == 22) setMinutosTemp(3);
            // else if(minutos == 23) setMinutosTemp(2);
            // else if(minutos == 24) setMinutosTemp(1);
            // else if(minutos == 25) setMinutosTemp(0);
