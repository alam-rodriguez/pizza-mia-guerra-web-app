import React, { useContext, useEffect, useState } from 'react';

// Firebase
import { UpdateOrderClient, addReferidoPor, createEstadisticas, deleteEstadistica, editEstadistica, editPoints, getEachStatitics, getEstadisticas, getInfoUser, getPointsUser, getordersNotView, givePointForRefFriend, givePointForRefGoodFriend, obtenerInfoApp, saveEstadistica, savePointsUser, savePuntosGeneradosForOrder } from '../../firebase/firebaseFirestore';

// Components
import Header from './see-orders-clients-components/Header';
import ItemList from './see-orders-clients-components/ItemList';

// Context
import { AppContext } from '../../context/AppContext';

// React-Rounter-Dom
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const SeeOrder = () => {

  const navigate = useNavigate();

  const [estadisticasUser, setEstadisticasUser] = useState(null);

  const { SeletedOrder: seletedOrder, setSeletedOrder } = useContext(AppContext);

  const [total, setTotal] = useState(0);

  const [puntos, setPuntos] = useState(0);

  const [puntosGastados, setPuntosGastados] = useState(0);

  const [infoUserRef, setInfoUserRef] = useState(null);

  const [infoPoints, setInfoPoints] = useState(null);

  const swalAlert = (text, icon = 'success') => Swal.fire({
    icon: icon,
    title: 'Estado del pedido',
    text: text,
  });
  
  // Crea y obtiene estadisticas de usuarios
  useEffect( () => {
    const f = async () => {
      if(seletedOrder == null) {
        navigate('/see-orders');
        return;
      }
      const estadisticas = await getEstadisticas(seletedOrder.email);
      console.log(estadisticas);
      if(estadisticas.dineroGastado != undefined){
        console.log(estadisticas);
        setEstadisticasUser(estadisticas);
      }else if(estadisticas == 'no estadisticas'){
        const firstEstadisticas = {
          nombre: seletedOrder.user,
          pointsForInviteFriend: 0,
          dineroGastado: 0,
          puntosGanados: 0,
          puntosGastados: 0,
          puntosRestantes: 0,
        }
        const res = await createEstadisticas(seletedOrder.email, firstEstadisticas);
        if( res ) setEstadisticasUser(firstEstadisticas);
        else console.log( res );
      }
      const infoPointsApp = await obtenerInfoApp();
      console.log( infoPointsApp );
      setInfoPoints( infoPointsApp.infoPoints );
      const infoUser = await getInfoUser(seletedOrder.email);
      console.log(infoUser);
      setInfoUserRef(infoUser.referidoPor);
    }
    f();
    console.log( seletedOrder );
  }, [] );


  useEffect( () => {
    if(seletedOrder == null) {
      navigate('/see-orders');
      return;
    }
    let total = 0;
    seletedOrder.pedido.map( (item) => {
      total += Number(item.precioVariosArticles);
    });
    if(seletedOrder.deliveryInfo != null)total += Number(seletedOrder.deliveryInfo.costo);
    setTotal(total);
    let puntos = 0;
    console.log( seletedOrder );
    seletedOrder.pedido.forEach( (item) => {
      puntos = puntos + Number(item.precioVariosArticles);
    });
    console.log( puntos );
    console.log(Number(puntos) )
    puntos = Number(puntos) / Number(seletedOrder.pointsInfo.eachPointValue);
    setPuntos(puntos);

    if(seletedOrder.pedidoOfPoints.length > 0){
      let puntosGastadosPedido = 0;
      seletedOrder.pedidoOfPoints.forEach( (item) => {
        puntosGastadosPedido += Number(item.PuntosVariosArticles);
      });
      setPuntosGastados(puntosGastadosPedido);
    }
  }, [] );
  
  const [isReady, setIsReady] = useState(seletedOrder != null ? seletedOrder.isReady : false);
  const [guardar, setGuardar] = useState(seletedOrder != null ? seletedOrder.guardar : false);
  const [paid, setPaid] = useState(seletedOrder != null ? seletedOrder.paid : false);
  const [givePoints, setgivePoints] = useState(seletedOrder != null ? seletedOrder.recibioPuntos : false);
  
  // change wasView t0 true
  useEffect( () => {
    if(seletedOrder != null){
      const f = async () => {
        if(seletedOrder.wasView == false){
          const res = await UpdateOrderClient(seletedOrder.email, seletedOrder.id, isReady, paid, guardar);
          if(res) swalAlert('Pedido Actualizado');
          else swalAlert('Error al actualizar pedido', 'error');
        }
      }
      f();
    }
  }, [] );


  
  // useEffect( () => {
  //   // if(infoPoints != null && clientOrders != null){
  //     if(seletedOrder.pointsInfo.wantPoints == true && givePoints != seletedOrder.recibioPuntos){
  //       // clientOrders.forEach( (order) => {
  //         console.log('first')
  //         let total = 0
  //         // if(seletedOrder.recibioPuntos == false){
	// 					seletedOrder.pedido.forEach( (pedido) => {
	// 						total += pedido.precioVariosArticles;
	// 					});
	// 				// }
	// 				const puntosOrden = (total / Number(seletedOrder.pointsInfo.eachMoneyGenerateOnePoint));
  //         console.log( seletedOrder.pedido );
	// 				const f = async () => {
  //           const res = await savePuntosGeneradosForOrder(seletedOrder.email, seletedOrder.id, puntosOrden, givePoints);
  //           const oldPoints = await getPointsUser(seletedOrder.email);
  //           console.log(puntosOrden);
  //           let newPoints = Number(oldPoints.puntos);
  //           if(givePoints == true){
  //             newPoints = Number(newPoints) + Number(puntosOrden);
  //           }else {
  //             newPoints = Number(newPoints) - Number(puntosOrden);
  //           }
  //           console.log(newPoints);
  //           const res3 = await savePointsUser(seletedOrder.email, newPoints);
	// 					if(res){
  //             console.log(`${puntosOrden} puntos generados`);
	// 					}
	// 				}
	// 				f();
	// 				console.log( puntosOrden );
  //         // });
  //         // console.log(infoPoints);
  //       }
  //       // console.log(infoPoints)
  //       // }
  //     }, [givePoints] );

  const handleChangeGuardar = (e) => {
    setGuardar(e.target.checked);
  }
      
  const handleChangeIsReady = (e) => {
    setIsReady(e.target.checked);
    console.log(e.target.checked)
  };
  const handleChangePaid = (e) => {
    if(!e.target.checked) setgivePoints(false);
    setPaid(e.target.checked);
    console.log(e.target.checked)
  };

  const handleChangeGivePoints = (e) => {
    if(!paid) alert('No puedes darles los puntos al usuario si no ha pagado');  
    else setgivePoints(e.target.checked);
    console.log('kk')
  }


  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

const handleClickGuardar = async () => {

  if(!(seletedOrder.guardar != guardar || seletedOrder.isReady != isReady || seletedOrder.paid != paid || seletedOrder.recibioPuntos != givePoints)){
    swalAlert('No es necesario actualizar el pedido', 'info');
    return;
  }

  const resSwal = await Swal.fire({
    title: 'Estas seguro?',
    text: "Quieres realmente hacer este pedido ?",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ordenar'
  });
  if(!resSwal.isConfirmed) return;

  const saveOrderPromise = new Promise( async (resolve, reject) => {

  setIsSaving(true);
    
  let workChangeIsReady = true;
  let workAddPuntos = true;

  if(isReady != seletedOrder.isReady || paid != seletedOrder.paid || guardar != seletedOrder.guardar || seletedOrder.recibioPuntos == givePoints){
    workChangeIsReady = await UpdateOrderClient(seletedOrder.email, seletedOrder.id, isReady, paid, guardar);
  }

  if(seletedOrder.pointsInfo.activatePoints){
    let total = 0
    seletedOrder.pedido.forEach( (pedido) => {
      total += pedido.precioVariosArticles;
    });
    // const puntos = (total / Number(seletedOrder.pointsInfo.eachMoneyGenerateOnePoint));
  
    const res = await savePuntosGeneradosForOrder(seletedOrder.email, seletedOrder.id, puntos, givePoints);
    const oldPoints = await getPointsUser(seletedOrder.email);
      
    let newPoints = Number(oldPoints.puntos);
    if(givePoints == true){
      newPoints = Number(newPoints) + Number(puntos);
    }else {
      newPoints = Number(newPoints) - Number(puntos);
    }

    // const res3 = await editPoints(seletedOrder.email);
      
    // const res3 = await savePointsUser(seletedOrder.email, newPoints);

    if(res || oldPoints){
      workAddPuntos = true;
    }else{
      workAddPuntos = false;
    } 
  }

  if( workChangeIsReady && workAddPuntos ){
    setIsSaved(true);
    resolve('Pedido actualizado con exito');
  }else {
    reject('Ha ocurrido un error al actualizar el pedido');
  }

  



  // let data = {
  //   dineroGastado: 0,
  //   idsVisitas: [],
  //   visitas: [],
  //   puntosGenerados: 0,
  //   puntosGastados: 0,
  // };
  // const ids = [];


  // EDITAR ETADISTICAS

  // let estadistacasUser = await getEstadisticasUser(seletedOrder.email); 
  // console.log(puntos)
    if(paid){
      console.log(estadisticasUser);
      console.log(givePoints);
      const visita = {
        id: seletedOrder.id,
        fecha: `${seletedOrder.dia}`,
        gastado: seletedOrder.total,
        puntosGastados: seletedOrder.puntosGastados,
        puntosGenerados: givePoints ? puntos : 0,
      }
      console.log(visita);
      const guardarEstadisca = await saveEstadistica(seletedOrder.email, visita);
      if(guardarEstadisca){
        console.log('Estadistica guardada');
      }
    }else if(!paid){
      if(seletedOrder.puntosGenerados > estadisticasUser.puntosRestantes) {
        console.log(estadisticasUser);
        alert('No puedes quitarles estos puntos porque el usuario ya los uso');
        return;
      }
      const res = await deleteEstadistica(seletedOrder.email, seletedOrder.id);
      if(res){
        console.log('Estadistica borrada')
      }
      
    }

    const statistics = await getEachStatitics(seletedOrder.email);
    // if(statistics.length > 0){
      let dineroGastado = 0;
      let puntosGanados = 0;
      let puntosGastados = 0;
      statistics.forEach((statistic)=>{
        dineroGastado += statistic.gastado;
        puntosGanados += statistic.puntosGenerados;
        puntosGastados += statistic.puntosGastados;
      })
      console.log(estadisticasUser)
      const newStatistics = {
        nombre: seletedOrder.user,
        dineroGastado: dineroGastado,
        puntosGanados: puntosGanados,
        pointsForInviteFriend: estadisticasUser.pointsForInviteFriend,
        puntosGastados: puntosGastados,
        // puntosGastados: paid ? estadisticasUser.puntosGastados + puntos : estadisticasUser.puntosGastados - puntos,

        // puntosRestantes: puntosGanados - estadisticasUser.puntosGastados,
        // puntosGastados: estadisticasUser.puntosGastados + puntos,
      }

      // if( !infoUserRef.givePointsForSpendMoney && newStatistics.dineroGastado > seletedOrder.pointsInfo.minForSpend ) {
      //   newStatistics.givePointsForSpendMoney = true;
      // }

      // if( !infoUser.givePointsForSpendMoney && dineroGastado > seletedOrder.pointsInfo.minForSpend ) {
        // TODO:
        // }
        
        // //! Aqui
        // if(seletedOrder.puntosGastados > 0){
      //   if(paid){
      //     const newStatistics = {
      //       dineroGastado: dineroGastado,
      //       puntosGanados: puntosGanados,
      //       puntosGastados: estadisticasUser.puntosGastados + puntos,
      //       // puntosRestantes: puntosGanados - estadisticasUser.puntosGastados,
      //     }
      //     const resEstadisticas = await editEstadistica(seletedOrder.email, newStatistics);
      //     if(resEstadisticas){
      //       console.log('Estadisticas actualizadas')
      //     }
      //   }else {
        //     const newStatistics = {
          //       dineroGastado: dineroGastado,
          //       puntosGanados: puntosGanados,
          //       puntosGastados: estadisticasUser.puntosGastados - puntos,
          //       // puntosRestantes: puntosGanados - estadisticasUser.puntosGastados,
          //     }
          //     const resEstadisticas = await editEstadistica(seletedOrder.email, newStatistics);
          //     if(resEstadisticas){
            //       console.log('Estadisticas actualizadas')
            //     }
            //   }
            // }
            // //!
            
            const res = await editEstadistica(seletedOrder.email, newStatistics);
            givePointsToFriend(newStatistics);
      if(res){
        console.log('Estadisticas actualizadas')
      }
    // }

    // actualizar estadisticas
    
    // if(givePoints){
    //   const newEstadisticas = {
    //     dineroGastado: estadisticasUser.dineroGastado + seletedOrder.total,
    //     puntosGanados: estadisticasUser.puntosGanados + seletedOrder.puntosGenerados,
    //     puntosGastados: estadisticasUser.puntosGastados,
    //     puntosRestantes: estadisticasUser.puntosRestantes,
    //   }
    //   const res = await editEstadistica(seletedOrder.email, newEstadisticas);
    //   console.log(res);
    // }else if(!givePoints){
    //   const newEstadisticas = {
    //     dineroGastado: estadisticasUser.dineroGastado - seletedOrder.total,
    //     puntosGanados: estadisticasUser.puntosGanados - seletedOrder.puntosGenerados,
    //     puntosGastados: estadisticasUser.puntosGastados,
    //     puntosRestantes: estadisticasUser.puntosRestantes,
    //   }
    //   const res = await editEstadistica(seletedOrder.email, newEstadisticas);
    //   console.log(res);
    // }


  
    // data.visitas.forEach( (visita) => {
    // 	ids.push(visita.id);
    // });
    // let dineroGastado = 0;
    // let puntosGenerados = 0;
    // puntosGastados
    // visitas.forEach( (visita) => {
    //   if(data.visitas.includes())
    //   dineroGastado += Number(visita.precioVariosArticles);
    // });
    // const res = await getEstadisticasUser(email);
    // if(res == 'no estadisticas')
    // console.log(res);
  });

  toast.promise(
    saveOrderPromise,
    {
      pending: 'Promise is pending',
      success: 'Promise resolved 👌',
      error: 'Promise rejected 🤯'
    }
)

}

const givePointsToFriend = async (statistics) => {
  // const givePointsToFriendWhoInviteMe = async () => {
    
    const infoUser1 = await getInfoUser(seletedOrder.email);
    const referidoInfo1 = infoUser1.referidoPor;
    if(referidoInfo1 != undefined){

      console.log(infoUser1);

      console.log(infoPoints);

      // console.log(referidoInfo);

      // console.log(pointsInfo);
      
      if(!referidoInfo1.givePointsForInviteFriend){
        const estadisticas = await getEstadisticas(seletedOrder.email);
        const estadisticasAmigo = await getEstadisticas(referidoInfo1.email);
        console.log(estadisticas.dineroGastado > 500);
        if(estadisticas.dineroGastado > 500){
          console.log('-----------------------------');
          const newStatistics = {
            nombre: estadisticasAmigo.nombre,
            dineroGastado: estadisticasAmigo.dineroGastado,
            puntosGanados: estadisticasAmigo.puntosGanados,
            pointsForInviteFriend: estadisticasAmigo.pointsForInviteFriend + infoPoints.refFriendGenerate,
            puntosGastados: estadisticasAmigo.puntosGastados,
          }
          const resEstadisticas = await editEstadistica(referidoInfo1.email, newStatistics);
          const info = {
            codeRef: referidoInfo1.codeRef,
            email: referidoInfo1.email,
            givePointsForInviteFriend: true,
            givePointsForSpendMoney: referidoInfo1.givePointsForSpendMoney,
            nombre: referidoInfo1.nombre,
          }
          const res = await givePointForRefFriend(seletedOrder.email, info);
          // TODO: editar info de user
        }
      }else if(statistics.dineroGastado < 500){
        const estadisticas = await getEstadisticas(seletedOrder.email);
        const estadisticasAmigo = await getEstadisticas(referidoInfo1.email);
        
        console.log(estadisticasAmigo);
        // if(estadisticas.dineroGastado > 500){
          // console.log('-----------------------------');
          const newStatistics = {
            nombre: estadisticasAmigo.nombre,
            dineroGastado: estadisticasAmigo.dineroGastado,
            puntosGanados: estadisticasAmigo.puntosGanados,
            pointsForInviteFriend: estadisticasAmigo.pointsForInviteFriend - infoPoints.refFriendGenerate,
            puntosGastados: estadisticasAmigo.puntosGastados,
          }
          const resEstadisticas = await editEstadistica(referidoInfo1.email, newStatistics);
          const info = {
            codeRef: referidoInfo1.codeRef,
            email: referidoInfo1.email,
            givePointsForInviteFriend: false,
            givePointsForSpendMoney: referidoInfo1.givePointsForSpendMoney,
            nombre: referidoInfo1.nombre,
          }
          const res = await givePointForRefFriend(seletedOrder.email, info);
          // TODO: editar info de user
      }
      const infoUser2 = await getInfoUser(seletedOrder.email);
      const referidoInfo2 = infoUser2.referidoPor;
      if(!referidoInfo2.givePointsForSpendMoney){
        const estadisticas = await getEstadisticas(seletedOrder.email);
        const estadisticasAmigo = await getEstadisticas(referidoInfo2.email);
        if(estadisticas.dineroGastado > infoPoints.minForSpend){
          const newStatistics = {
            nombre: estadisticasAmigo.nombre,
            dineroGastado: estadisticasAmigo.dineroGastado,
            puntosGanados: estadisticasAmigo.puntosGanados,
            pointsForInviteFriend: estadisticasAmigo.pointsForInviteFriend + infoPoints.pointsForMinSpend,
            puntosGastados: estadisticasAmigo.puntosGastados,
          }
          const resEstadisticas = await editEstadistica(referidoInfo2.email, newStatistics);
          const info = {
            codeRef: referidoInfo2.codeRef,
            email: referidoInfo2.email,
            givePointsForInviteFriend: referidoInfo2.givePointsForInviteFriend,
            givePointsForSpendMoney: true,
            nombre: referidoInfo2.nombre,
          }
          const res = await givePointForRefGoodFriend(seletedOrder.email, info);
          // TODO: editar info de user
        }
      }else if(statistics.dineroGastado < infoPoints.minForSpend) {
        console.log('----------------------')
        const estadisticas = await getEstadisticas(seletedOrder.email);
        const estadisticasAmigo = await getEstadisticas(referidoInfo2.email);
        console.log(estadisticasAmigo);
        // if(estadisticas.dineroGastado > infoPoints.minForSpend){
          const newStatistics = {
            nombre: estadisticasAmigo.nombre,
            dineroGastado: estadisticasAmigo.dineroGastado,
            puntosGanados: estadisticasAmigo.puntosGanados,
            pointsForInviteFriend: estadisticasAmigo.pointsForInviteFriend - infoPoints.pointsForMinSpend,
            puntosGastados: estadisticasAmigo.puntosGastados,
          }
          const resEstadisticas = await editEstadistica(referidoInfo2.email, newStatistics);
          const info = {
            codeRef: referidoInfo2.codeRef,
            email: referidoInfo2.email,
            givePointsForInviteFriend: referidoInfo2.givePointsForInviteFriend,
            givePointsForSpendMoney: false,
            nombre: referidoInfo2.nombre,
          }
          const res = await givePointForRefGoodFriend(seletedOrder.email, info);
          // TODO: editar info de user
        // }
      }
    // }

  }
  // if(infoUserRef != null && infoUserRef != undefined){
  //   console.log( infoUserRef );
  //   // console.log( infoUserRef );
  //   // console.log( statistics.dineroGastado );
  //   // console.log( seletedOrder.pointsInfo.minForSpend );
  
  //   // console.log(infoPoints.pointsForMinSpend);
  
    
    
  //   if( !infoUserRef.givePointsForSpendMoney && statistics.dineroGastado > seletedOrder.pointsInfo.minForSpend ) {
  //     console.log('si');
  //     // Edito el referido por
  //     const NewinfoUserRef = {...infoUserRef};
  //     NewinfoUserRef.givePointsForSpendMoney = true;
  //     const updateReferidoPor = await addReferidoPor(seletedOrder.email, NewinfoUserRef);
  
  //     // Edito estadisticas de amigo
  //     const estadisticasAmigo = await getEstadisticas(infoUserRef.email);
  //     const newEstadistcas = {
  //       dineroGastado: estadisticasAmigo.dineroGastado, 
  //       puntosGanados: estadisticasAmigo.puntosGanados + Number(infoPoints.pointsForMinSpend),
  //       puntosGastados: estadisticasAmigo.puntosGastados,
  //       puntosRestantes: estadisticasAmigo.puntosRestantes + Number(infoPoints.pointsForMinSpend),
  //     }
  //     const res3 = await editEstadistica(infoUserRef.email, newEstadistcas);
  //     console.log(res3);
  
  
  
  //     console.log( infoUserRef.givePointsForSpendMoney );
  //   }
  // }
}

  const handleClickVolver = () => {
    navigate('/see-orders');
  }

  if(seletedOrder != null){
    return (
      <main className='overflow-hidden'>
        <Header link='/see-orders' title='Pedido' />
  
        <section className=''>
         
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height:'80vh'}}>

          <div key={seletedOrder.id} className='border my-4 shadow-lg rounded-5 border border-success'>
  
            <p className='m-0 fw-bold fs-3 text-center py-2 border-bottom border-success'>{seletedOrder.user}</p>
            <div className='p-3'>

              <ItemList 
                clave='Pedido id:' 
                valor={seletedOrder.id}
              />

              <ItemList 
                clave='Fecha:' 
                valor={`${seletedOrder.dia} | ${seletedOrder.horaPedido.hora}:${seletedOrder.horaPedido.minuto}`}
              />

              <ItemList 
                clave='Numero:' 
                valor={seletedOrder.telefono}
              />  

              { seletedOrder.deliveryInfo != null ?
              (seletedOrder.deliveryInfo.costo > 0) ? 
                <ItemList 
                  clave='Ubicacion:' 
                  valor={`${seletedOrder.deliveryInfo.lugar}: ${seletedOrder.direccion}`}
                />     
                : <></> 
                : <></>
              }        

              <div className='py-2'>
                { seletedOrder.pedido.length > 0 ? 
                  <>
                    <p className='m-0 fw-bold fs-4 text-center'>Articulos:</p>
                    { seletedOrder.pedido.map( (article, i) => (
                      <div key={i} className='border-bottom py-2'>
                        <p className='m-0 fw-medium fs-5 text-center text-secondary'>Categoria: <span className='fw-bold text-black fst-italic'>{article.categoria.nombre}</span></p>
                        <p className='m-0 fw-medium fs-5 text-center text-secondary'>Cantidad: <span className='fw-bold text-black fst-italic'>{article.cantidad}</span></p>
                        <p className='m-0 fw-medium fs-5 text-center text-secondary'>Articulo: <span className='fw-bold text-black fst-italic'>{(article.size != '') ? `${article.size}-${article.ingredientePrincipal}` : article.ingredientePrincipal}</span></p>
                          
                        { 
                          (article.ingredientesAdicionales.length > 0)
                          ? <p className='m-0 fw-medium fs-5 text-center text-secondary'>Adicional: {article.ingredientesAdicionales.map((adicional, i)=>(
                              <span key={i} className='fw-bold text-black fst-italic'>{adicional.adicional},</span>
                            ))}</p>
                          : <></>
                        }
                          
                        { 
                          (article.mitad != null)
                          ? <p className='m-0 fw-medium fs-5 text-center text-secondary'>Mitad: <span className='fw-bold text-black fst-italic'>{article.mitad.ingredienteNombre}</span></p>
                          : <></>
                        }

                        <p className='m-0 fw-medium fs-5 text-center text-secondary'>Precio: <span className='fw-bold text-black fst-italic'>{article.precioVariosArticles}</span></p>
                        <br />
                      </div>
                    ))}
                  </>
                  : <></>
                }

                { (seletedOrder.pedidoOfPoints.length > 0) ?
                  <>
                    <p className='m-0 fw-bold fs-4 text-center'>Articulos de Puntos:</p>

                    { seletedOrder.pedidoOfPoints.map( (article, i) => (
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
                }

                { puntos > 0 ?
                  <>
                    <p className='m-0 fw-bold fs-4 text-center'>Articulos de puntos:</p>
                    { seletedOrder.pedidoOfPoints.map( (article, i) => (
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

                        <p className='m-0 fw-medium fs-5 text-center text-secondary'>Puntos: <span className='fw-bold text-black fst-italic'>{article.PuntosVariosArticles}</span></p>
                      </div>
                    ))}
                  </>
                  : <></>
                }
              </div>

              { seletedOrder.deliveryInfo != null ?
                (seletedOrder.deliveryInfo.costo > 0) ? 
                  <ItemList 
                    clave='Delivery:' 
                    valor={seletedOrder.deliveryInfo.costo}
                  />        
                : <div className='d-flex justify-content-center align-items-center border-bottom py-2'>
                    <p className='m-0 fw-medium fs-5 fw-bold'>La viene a buscar</p>
                  </div>
                : <div className='d-flex justify-content-center align-items-center border-bottom py-2'>
                    <p className='m-0 fw-medium fs-5 fw-bold'>La viene a buscar</p>
                  </div>
              }

              { puntosGastados > 0 ?
                <ItemList 
                  clave='Puntos Gastados:' 
                  valor={puntosGastados}
                />
              : <></> 
              }

              { seletedOrder.pointsInfo.activatePoints && seletedOrder.total > 0 ?
                <ItemList 
                  clave='Puntos generados:' 
                  valor={seletedOrder.recibioPuntos ? seletedOrder.puntosGenerados : 0}
                />
              : <></>
              }

              {/* { seletedOrder.pointsInfo.activatePoints ?
                <div className='d-flex justify-content-between align-items-center border-bottom py-2'>
                  <p className='m-0 fw-bold fs-5 w-25'>Puntos generados:</p>
                  <p className='m-0 fw-medium fs-5 w-75 text-end'>{seletedOrder.recibioPuntos ? seletedOrder.puntosGenerados : 0}</p>
                </div>
              : <></>
              } */}

              {
                (seletedOrder.comentario.length > 0) ? 
                  <ItemList 
                    clave='comentario:' 
                    valor={seletedOrder.comentario}
                  />
                : <></>
              }

              </div>

              

            <div className='d-flex justify-content-between border-top border-success p-3'>
              <p className='m-0 fw-bold fs-5 w-25'>Total:</p>
              <p className='m-0 fw-bold fs-5 w-75 text-end'>{total}</p>
            </div>
              
          </div>    

          <div>
            {/* <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">ya hemos visto el pedido</label>
            </div> */}
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={guardar} onChange={handleChangeGuardar} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Deseas guardar el pedido ?</label>
            </div>

            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isReady} onChange={handleChangeIsReady} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Ya esta listo el pedido ?</label>
            </div>

            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={paid} onChange={handleChangePaid} />
              <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Pago y ya recibio correctamente el pedido ?</label>
            </div>

            { seletedOrder.pointsInfo.activatePoints ?
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={givePoints} onChange={handleChangeGivePoints} />
                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Otorgar {puntos} puntos del pedido ?</label>
              </div>
            : <></>
            }

            {/* { (!isSaving && !isSaved )
                ? <button className='btn btn-success form-control fs-3 mt-5 p-2' onClick={handleClickGuardar}>Guardar</button>
                : (isSaving && !isSaved) 
                  ? <button className='btn btn-success form-control fs-3 mt-5 p-2'>Guardando...</button>
                  : <button className='btn btn-success form-control fs-3 mt-5 p-2' onClick={handleClickVolver}>Volver</button>
            } */}



</div>

          </div>
          
          <div className='bg-white position-fixed w-100 bottom-0 start-0 rounded-0 p-4 border-top shadow' style={{height: '10vh'}}>
            { (!isSaving && !isSaved )
                ? <button className='btn form-control btn-success fs-3 rounded-3' onClick={handleClickGuardar}>Guardar</button>
                : (isSaving && !isSaved) 
                  ? <button className='btn form-control btn-success fs-3 rounded-3'>Guardando...</button>
                  : <button className='btn form-control btn-success fs-3 rounded-3' onClick={handleClickVolver}>Volver</button>
            }
          </div>
  
        </section>
        <ToastContainer />
      </main>
    );
  }
}

export default SeeOrder;