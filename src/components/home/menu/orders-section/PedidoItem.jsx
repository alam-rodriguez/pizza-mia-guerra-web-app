import React, { useEffect, useState } from 'react';

// Components
import ItemList from './orders-section-components/ItemList';
import Temporizador from '../../temporizador/Temporizador';

const PedidoItem = ({orden}) => {

  const [mitad, setMitad] = useState(null);

  const [total, setTotal] = useState(0);

  useEffect( () => {
    console.log( orden );
    console.log('----------------');
    let total = 0;
    orden.pedido.map( (item) => {
      if(item.mitad != '') setMitad(item.mitad);
      total += Number( item.precioVariosArticles );
      // console.log();
    });
    if( orden.deliveryInfo != null ) total += Number(orden.deliveryInfo.costo);
    setTotal( total );
    console.log('----------------');
  }, [] );

  const [segundosTemp, setSegundosTemp] = useState(0);
  const [minutosTemp, setMinutosTemp] = useState(0);
  const [horasTemp, setHorasTemp] = useState(0);

  useEffect( () => {
    // if(clientOrders != null){

      const fecha = new Date();

      // console.log(clientOrders);
      // clientOrders.forEach( (order) => {
        if(!orden.guardar){

          // setSeletedOrder(orden);
          // setviewTempSection(true);

          const horaPedido =  fecha.setHours(fecha.getHours(), fecha.getMinutes(), fecha.getSeconds()); // Establecer la primera hora como 10:30 AM

          const horaActual = fecha.setHours(orden.horaPedido.hora, orden.horaPedido.minuto, orden.horaPedido.segundo); // Establecer la segunda hora como 8:45 AM

          const tiempoRestante = horaPedido - horaActual;

          var horas = Math.floor(tiempoRestante / (1000 * 60 * 60));
          var minutos = Math.floor((tiempoRestante / (1000 * 60)) % 60);
          var segundos = Math.floor((tiempoRestante / 1000) % 60);

          console.log("La diferencia es: " + horas + " horas y " + minutos + " minutos y" + segundos + " segundos");
          
          const waitingTime = 25;
          if(horas == 0 && minutos < waitingTime){
            setHorasTemp(horas);
            setMinutosTemp(waitingTime - minutos);
            setSegundosTemp(60 - segundos);
          }
          else if((horas > 0 || minutos > waitingTime) && !orden.isReady) console.log('Su pedido casi esta listo');  
          else if((horas > 0 || minutos > waitingTime) && orden.isReady) console.log('Su pedido ya esta listo', 'success');
          
        }
      // });
      
    // }
  }, [] ); 

  return (
    <div className='animate__animated animate__slideInDown border my-4 shadow-lg rounded-5 border border-success'>

      <p className='m-0 fw-bold fs-4 text-center py-2 border-bottom border-success'>{orden.user}</p>
      <div className='p-3'>

        <ItemList 
          clave='Pedido id:' 
          valor={orden.id}
        />

        <ItemList 
          clave='Fecha:' 
          valor={orden.dia}
        />

        <ItemList 
          clave='Tiempo restante:' 
          valor={ (minutosTemp > 0 || segundosTemp > 0) 
            ? <Temporizador 
                className='m-0 fw-medium fs-6 text-end'
                segundos={segundosTemp} 
                minutos={minutosTemp} 
                horas={horasTemp}
              />
            : '00:00:00'
          }
        />

        {/* <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
          <p className='m-0 fw-bold fs-6 w-25'></p>
          { minutosTemp > 0 || segundosTemp > 0 ?
            <Temporizador 
            className='m-0 fw-medium fs-6 w-75 text-end'
            segundos={segundosTemp} 
            minutos={minutosTemp} 
            horas={0}
          />
          : <p className='m-0 fw-medium fs-6 w-75 text-end'>00:00:00</p>
          }
          {/* <p className='m-0 fw-medium fs-6 w-75 text-end'>{valor}</p> */}
        {/* </div> */} 
        {/* <ItemList  */}
        {/* //   clave='Fecha:'  */}
        {/* //   valor={ */}
        {/* className='m-0 fs-2 d-inline-block text-white rounded-5 p-3 animate__animated position-absolute start-50 mt-5 translate-middle-x border shadow-lg' */}
            
        {/* //   } */}
        {/* // /> */}

        <ItemList 
          clave='Estado del pedido:' 
          valor={
            (!orden.wasView && !orden.isReady)
              ? 'Su orden fue enviada, en los proximos minutos la vamos a empezar a trabajar.'
            : (orden.wasView && !orden.isReady)
              ? 'Ya estamos trabando en su pedido.'
            : (orden.wasView && orden.isReady)
              ? 'Ya su pedido esta listo.'
            : ''
          }
        />
        
        {/* <div className='d-flex justify-content-between border-bottom py-2'>
          <p className='m-0 fw-bold fs-5 w-25'>Estado del pedido:</p>
          { (!orden.wasView && !orden.isReady)
            ? <p className='m-0 fw-medium fs-5 w-75 text-end'>Su orden fue enviada, en los proximos minutos la vamos a empezar a trabajar.</p>
            : (orden.wasView && !orden.isReady)
            ? <p className='m-0 fw-medium fs-5 w-75 text-end'>Ya estamos trabando en su pedido.</p>
            : (orden.wasView && orden.isReady)
            ? <p className='m-0 fw-medium fs-5 w-75 text-end'>Ya su pedido esta listo.</p>
            :<></>
          }
        </div> */}
              
        <div className='py-2'>
          { orden.pedido.length > 0 ? 
            <>
              <p className='m-0 fw-bold fs-5 text-center'>Articulos:</p>
              { orden.pedido.map( (article, i) => (
                <div key={i} className='border-bottom py-2'>
                  <p className='m-0 fw-medium fs-6 text-center text-secondary'>Categoria: <span className='fw-bold text-black fst-italic'>{article.categoria.nombre}</span></p>
                  <p className='m-0 fw-medium fs-6 text-center text-secondary'>Cantidad: <span className='fw-bold text-black fst-italic'>{article.cantidad}</span></p>
                  <p className='m-0 fw-medium fs-6 text-center text-secondary'>Articulo: <span className='fw-bold text-black fst-italic'>{(article.size != '') ? `${article.size}-${article.ingredientePrincipal}` : article.ingredientePrincipal}</span></p>
                  
                  { 
                    (article.ingredientesAdicionales.length > 0)
                    ? <p className='m-0 fw-medium fs-6 text-center text-secondary'>Adicional: {article.ingredientesAdicionales.map((adicional, i)=>(
                        <span key={i} className='fw-bold text-black fst-italic'>{adicional.adicional},</span>
                      ))}</p>
                    : <></>
                  }
                  
                  { 
                    (article.mitad != null)
                    ? <p className='m-0 fw-medium fs-6 text-center text-secondary'>Mitad: <span className='fw-bold text-black fst-italic'>{article.mitad.ingredienteNombre}</span></p>
                    : <></>
                  }

                  <p className='m-0 fw-medium fs-6 text-center text-secondary'>Precio: <span className='fw-bold text-black fst-italic'>{article.precioVariosArticles}</span></p>
                </div>
              ))}
            </>
            : <></>
          }

          {/* { (orden.pedidoOfPoints.length > 0) ?
            <>
              <p className='m-0 fw-bold fs-4 text-center'>Articulos de Puntos:</p>

              { orden.pedidoOfPoints.map( (article, i) => (
                <div key={i} className='border-bottom py-2'>
                  <p className='m-0 fw-medium fs-5 text-center text-secondary'>Categoria: <span className='fw-bold text-black fst-italic'>{article.categoria.nombre}</span></p>
                  <p className='m-0 fw-medium fs-5 text-center text-secondary'>Cantidad: <span className='fw-bold text-black fst-italic'>{article.cantidad}</span></p>
                  <p className='m-0 fw-medium fs-5 text-center text-secondary'>Articulo: <span className='fw-bold text-black fst-italic'>{(article.size != '') ? `${article.size}-${article.ingredientePrincipal}` : article.ingredientePrincipal}</span></p>
                  
                  { 
                    (article.ingredientesAdicionales.length > 0)
                    ? <p className='m-0 fw-medium fs-5 text-center text-secondary'>Adicional: {article.ingredientesAdicionales.map((adicional)=>(
                        <span className='fw-bold text-black fst-italic'>{adicional.adicional},</span>
                      ))}</p>
                    : <></>
                  }
                  
                  { 
                    (article.mitad != '')
                    ? <p className='m-0 fw-medium fs-5 text-center text-secondary'>Mitad: <span className='fw-bold text-black fst-italic'>{article.mitad}</span></p>
                    : <></>
                  }

                  <p className='m-0 fw-medium fs-5 text-center text-secondary'>Precio: <span className='fw-bold text-black fst-italic'>{article.PuntosVariosArticles}</span></p>
                </div>
              ))}
            </>
          : <></>
          } */}
          
          {
            orden.deliveryInfo != null
              ? orden.deliveryInfo.costo > 0 
                ? <p className='m-0 fw-medium fs-6 text-center text-secondary'>Delivery: <span className='fw-bold text-black fst-italic'>{orden.deliveryInfo.costo}</span></p>
                : <></>
              : <></>
          }

        </div>

      </div>

      <div className='d-flex justify-content-between border-top border-success p-3'>
        <p className='m-0 fw-bold fs-5 w-25'>Total:</p>
        <p className='m-0 fw-bold fs-5 w-75 text-end'>{total}</p>
      </div>

    </div>
  );
}

export default PedidoItem;


{/* <div className='py-2'>
                <p className='m-0 fw-bold fs-4 text-center'>Articulos:</p>
                <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                  <p className='m-0 fw-medium fs-5 w-75'>5-Pizzas Pedazos con pollo, maiz y jamon</p>
                  <p className='m-0 fw-medium fs-5 w-25 text-end'>$300</p>
                </div>
                <div className='d-flex justify-content-between border-bottom align-items-center py-2' >
                  <p className='m-0 fw-medium fs-5 w-75'>5-Pizzas Pedazos con pollo</p>
                  <p className='m-0 fw-medium fs-5 w-25 text-end'>$300</p>
                </div>
              </div> */}