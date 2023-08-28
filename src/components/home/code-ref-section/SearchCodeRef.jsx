import React, {useContext, useEffect, useState} from 'react';

// Componente
import Header from '../components/Header'

// Context
import { AppContext } from '../../../context/AppContext';

// Firebase
import { addReferidoPor, editEstadistica, getEstadisticas, getInfoUser, obtenerInfoApp, searchCodeRef } from '../../../firebase/firebaseFirestore';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// React-Toaster
import { toast } from 'react-toastify';
import { registrarUsuario } from '../../../firebase/firebaseAuthGoogle';

const SearchCodeRef = ({viewSearchCode, setViewSearchCode}) => {

  const navigate = useNavigate();

  const { color1, email, setEmail } = useContext(AppContext);

  const [infoReferido, setInfoReferido] = useState(null);

  const [infoPointsApp, setInfoPointsApp] = useState(null);

  
  useEffect( () => {
    if(email == null) navigate('/home');
    const f = async () => {
      
      const infoApp = await obtenerInfoApp();
      console.log(infoApp.infoPoints);
      setInfoPointsApp(infoApp.infoPoints);
      
      const res = await getInfoUser(email);
      if(res.referidoPor != undefined) {
        const obj = {
          codeRef: res.referidoPor.codeRef,
          nombre: res.referidoPor.nombre,
          email: res.referidoPor.email,
        }
        
        const infoUser = await getInfoUser(res.referidoPor.email);
        obj.nombre = infoUser.nombre;
        setInfoReferido( obj );
      }
    }
    f();
  }, [] );

  const [inputValue, setInputValue] = useState('');

  const handleChangeInputValue = (e) => setInputValue(e.target.value); 

  const handleClick = async () => {

    const searchCodePromise = new Promise( async (resolve, reject) => {

      let emailUser = email;

      const resBusqueda = await searchCodeRef( Number(inputValue) );

      console.log(resBusqueda.email);

      if(resBusqueda.email != undefined){
        const res = await getInfoUser(emailUser);

        if(emailUser == null || res == 'no-exist'){
          const resRegistro = await registrarUsuario();
          if(resRegistro != false) emailUser = resRegistro;
        }

        // console.log(emailUser);
        // if(res != 'no-exist' && res != false) {
          
          
          
          const estadisticas = await getEstadisticas(emailUser);
          
          const referidoInfo = {
            codeRef: resBusqueda.codeRef,
            email: resBusqueda.email,
            nombre: resBusqueda.nombre,
            givePointsForInviteFriend: false,
            givePointsForSpendMoney: false,
          }

          if(estadisticas != 'no estadisticas' && estadisticas != false){
            
            if(estadisticas.dineroGastado > 500){
              
              referidoInfo.givePointsForInviteFriend = true;
              const estadisticasAmigo = await getEstadisticas(resBusqueda.email);
              const newEstadistcas = {
                dineroGastado: estadisticasAmigo.dineroGastado, 
                puntosGanados: estadisticasAmigo.puntosGanados + Number(infoPointsApp.refFriendGenerate),
                puntosGastados: estadisticasAmigo.puntosGastados,
                puntosRestantes: estadisticasAmigo.puntosRestantes + Number(infoPointsApp.refFriendGenerate),
              }
              const res3 = await editEstadistica(resBusqueda.email, newEstadistcas);
              console.log(res3);
              
            } else {
        
      
            }
            
          }

          setInfoReferido( resBusqueda );
          console.log( resBusqueda );
          // setInfoReferido(res);
          const resRef = await addReferidoPor(emailUser, referidoInfo);

        // }

        resolve();
      }else {
        reject();
      }
    });

    toast.promise( searchCodePromise, {
      pending: 'Buscando codigo',
      success: 'Codigo encontrado',
      error: 'no se ha escontrado este codigo'
    });

  }

  return (
    <div className={`animate__animated ${viewSearchCode == 'abrir' ? 'animate__slideInRight' : viewSearchCode == 'cerrar' ? 'animate__slideOutRight' : ''} container-fluid vh-100 vw-100 position-fixed bg-white top-0 start-0 z-3`}>
      <Header title='Entra el codigo de promo' setViewSearchCode={setViewSearchCode} />

      <section className='mx-4 d-flex flex-column justify-content-evenly' style={{height:'90vh'}}>
        <div>
          <p className='m-0 fs-5 text-center fw-normal'>Si fuiste invita por un amigo introduce su codigo de promocion aqui</p>
          { (infoReferido != null) ? 
            <>
              <input className='form-control border-0 border-bottom text-center fs-2 fw-bold'  type="text" value={infoReferido.codeRef} readOnly />  
              <div className='d-flex justify-content-between mt-5'>
                <p className='m-0 fs-4 fw-medium'>Nombre:</p>
                <p className='m-0 fs-4 fw-bold'>{infoReferido.nombre}</p>
              </div>
              <div className='d-flex justify-content-between mt-5'>
                <p className='m-0 fs-4 fw-medium'>email:</p>
                <p className='m-0 fs-4 fw-bold'>{infoReferido.email}</p>
              </div>
            </>
            : <input className='form-control border-0 border-bottom text-center fs-2 fw-bold'  type="text" onChange={handleChangeInputValue} />
          }
        </div>
        { (infoReferido != null)
          ? <button className={`btn ${color1.btn} text-center form-control fs-4 p-3`} value={inputValue} onClick={handleClick} disabled>Continuar</button>
          : <button className={`btn ${color1.btn} text-center form-control fs-4 p-3`} value={inputValue} onClick={handleClick}>Continuar</button>
        }
      </section>
      
    </div>
  )
}

export default SearchCodeRef;
