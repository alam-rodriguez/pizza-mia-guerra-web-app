import React, {useContext, useEffect} from 'react';

// Context
import { AppContext } from '../../../context/AppContext';

// Firebase
import { getInfoUser } from '../../../firebase/firebaseFirestore';

import QRCode from 'qrcode.react';

const ShowCodeUser = ({viewCodeUser, setViewCodeUser}) => {

  const { color1, email, appInfo, codeUser, setCodeUser } = useContext(AppContext);

  useEffect(()=>{
    if(codeUser == null){
      const f = async () => {
        const res = await getInfoUser(email);
        if(res) setCodeUser(res.codeRef);
      }
      f();
    }
  }, [])

  const handleClickDone = () => setViewCodeUser('close')

  return (
    <main className='' >
      <div className={`animate__animated position-fixed top-0 vh-100- bg-white z-3 ${viewCodeUser == 'open' ? 'animate__slideInRight' : viewCodeUser == 'close' ? 'animate__slideOutRight' : ''} container-fluid h-100 vw-100 bg-white top-0 start-0 z-3`}>
        <section className='mx-4 d-flex flex-column justify-content-between py-4' style={{height:'70vh'}}>

          <h1 className='fw-bold text-center display-1 text-danger'>{appInfo.nombre}</h1>
          
          <div className='border border-secondary rounded-5 d-flex flex-column justify-content-center align-items-center gap-3 p-4'>
            <QRCode value='https://falconmasters.com' className='w-75 h-auto' />
            <p className='text-center mb-0'>Muestrale este codigo en Pizza Mia al pedir</p>
            <p className='text-center fw-bold fs-4 mb-0'>{codeUser}</p>
          </div>

          <div className='position-fixed bottom-0 start-0 w-100 p-4'>
            <button className={`btn ${color1.btn} text-center form-control fs-4 p-3`} onClick={handleClickDone}>Hecho</button>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ShowCodeUser;
