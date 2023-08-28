import React, { useContext, useEffect, useState, memo } from 'react';

// React Icons
import { FiMenu } from 'react-icons/fi';
import { FaPizzaSlice } from 'react-icons/fa';

// Context
import { AppContext } from '../../context/AppContext';

// Firebase
import { getEstadisticas, savePuntosGeneradosForOrder } from '../../firebase/firebaseFirestore';
import { getPointsUser } from '../../firebase/firebaseFirestore';

const Header = () => {

	const {  infoPoints, setInfoPoints, clientOrders, setClientOrders, email, infoPointsUser, setInfoPointsUser, amountPoints, setAmountPoints } = useContext(AppContext);

	const [points, setPoints] = useState(0);

	useEffect( () => {
		// Obtener puntos del usuario
		if(email != null && infoPointsUser == null){
			const f = async () => {
				// const infoUser = await getPointsUser(email);
				const pointsUser = await getEstadisticas(email);
				if(pointsUser != 'no estadisticas' && pointsUser != false) {
					setAmountPoints( Math.round(pointsUser.puntosRestantes) );
					setInfoPointsUser(pointsUser);
				}
				console.log(pointsUser);
			}
			f();
		}
	}, [] );

	useEffect( () => {
		// Guardar puntos de usuario en compra
		if(infoPoints != null && clientOrders != null){
			if(infoPoints.wantPoints == true){
				clientOrders.forEach( (order) => {
					let total = 0
					if(order.recibioPuntos == false){
						order.pedido.forEach( (pedido) => {
							total += pedido.precioVariosArticles;
						});
					}
					const puntos = total / Number(infoPoints.eachMoneyGenerateOnePoint);
					const f = async () => {
						const res = await savePuntosGeneradosForOrder(order.email, order.id, puntos);
						if(res){
							console.log(`${puntos} puntos generados`);
						}
					}
					f();
					console.log( puntos );
				});
				// console.log(infoPoints);
			}
			console.log(infoPoints)
		}
	}, [infoPoints, clientOrders] );
	
	const { color1, viewMenu, setViewMenu, appInfo } = useContext(AppContext);

	const [appName, setAppName] = useState();
	useEffect(()=>{
		if(appInfo != null)setAppName(appInfo.nombre);
	});

	const handleClickMenu = () => setViewMenu(!viewMenu);

  return (
    <header className='d-flex justify-content-between align-items-center py-4 bg-white position-sticky top-0 start-0 w-100 z-1 m-0' onClick={handleClickMenu}>
			<FiMenu className={`fs-3 ${color1.textColor}`} />
			<h2 className='position-absolute start-50 translate-middle-x display-3 fw-bold text-danger'>{appName}</h2>
			<div className='d-flex align-items-center gap-2'>
				<p className={`m-0 fs-4 ${color1.textColor}`}>{amountPoints}</p>
				<FaPizzaSlice className={`fs-5 ${color1.textColor}`} />
			</div>
    </header>
  );
};

export default Header;









// // Guardar estadisticas de usuario
	// useEffect( () => {
	// 	let data = {
	// 		dineroGastado: 0,
	// 		idsVisitas: [],
  //     visitas: [],
  //     puntosGenerados: 0,
  //     puntosGastados: 0,
	// 	};
	// 	// const ids = [];
	// 	let visitas = [];
	// 	const f = async () => {
	// 		clientOrders.forEach( (order) => {
	// 			if(order.paid){
	// 				const visita = {
	// 					id: order.id,
	// 					fecha: `${order.dia} ${order.hora}`,
	// 					puntosGenerado: order.puntosGenerados,
	// 					gastado: 0,
	// 				}
	// 				let gastado = 0;
	// 				// order.pedido.forEach( (item) => {
	// 				// 	gastado += Number(item.precioVariosArticles);
	// 				// });
	// 				visitas.push(visita);
	// 				// visita.gastado = gastado;
	// 				// data.visitas = visita;
	// 			}
	// 		});
	// 		// data.visitas.forEach( (visita) => {
	// 		// 	ids.push(visita.id);
	// 		// });
	// 		let dineroGastado = 0;
	// 		let puntosGenerados = 0;
	// 		puntosGastados
	// 		visitas.forEach( (visita) => {
	// 			if(data.visitas.includes())
	// 			dineroGastado += Number(visita.precioVariosArticles);
	// 		});
	// 		// const res = await getEstadisticasUser(email);
	// 		// if(res == 'no estadisticas')
	// 		// console.log(res);

	// 		if(data.length > 0){

	// 		}
	// 	}
	// 	f();
	// }, []);