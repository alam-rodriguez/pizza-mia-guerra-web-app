import React, { useEffect } from 'react';

import { useNavigate, Link } from 'react-router-dom';

const CartInfoDeal = ({setMetodoPago, setHoraQuierePedido}) => {

  const navigate = useNavigate();

  useEffect( () => {
    // const fecha = new Date();
    // const hora = fecha.getHours() + ':' + fecha.getMinutes();
    // setHoraActual( hora );
  }, [] );

  const handleChangeHoraPedido = (e) => setHoraQuierePedido(e.target.value);

  const handleChangeMetodoPago = (e) => setMetodoPago(e.target.value);

  return (
    <div className='my-0'>

      <div className='mt-5'>
        <p className='mb-1 fs-5 fw-bold'>Direccion</p>
        <Link className='text-black text-decoration-none' target='_blank' to='https://www.google.com/maps/place/Pizza+mia.+Suc,+guerra./@18.5672077,-69.7116289,14.92z/data=!4m6!3m5!1s0x8eaf8244725a6e4d:0x758a34e58d802ccd!8m2!3d18.558281!4d-69.6995147!16s%2Fg%2F11cns76ywy?entry=ttu'>
          <div className='border-0 border-bottom'>
            <p className='mb-2 fs-5 fw-normal'>Guerra, frente al parque.</p>
          </div>
        </Link>
      </div>

      <div className='mt-5'>
        <p className='mb-1 fs-5 fw-bold'>Hora de pedido</p>
        <div className='border-0 border-bottom'>
          <select className='w-100 border-0 fs-5 rounded-3 text-black bg-transparent' onChange={handleChangeHoraPedido}>
            <option value='ahora mismo'>Ahora mismo</option>
            <option value="4:30">4:30</option>
            <option value="4:30">4:45</option>
            <option value="5:00">5:00</option>
            <option value="5:15">5:15</option>
            <option value="5:30">5:30</option>
            <option value="5:45">5:45</option>
            <option value="6:00">6:00</option>
            <option value="6:15">6:15</option>
            <option value="6:30">6:30</option>
            <option value="6:45">6:45</option>
            <option value="7:00">7:00</option>
            <option value="7:15">7:15</option>
            <option value="7:30">7:30</option>
            <option value="7:45">7:45</option>
            <option value="8:00">8:00</option>
            <option value="8:15">8:15</option>
            <option value="8:30">8:30</option>
            <option value="8:45">8:45</option>
            <option value="9:00">9:00</option>
            <option value="9:15">9:15</option>
            <option value="9:30">9:30</option>
            <option value="9:45">9:45</option>
            <option value="10:00">10:00</option>
            <option value="10:15">10:15</option>
            <option value="10:30">10:30</option>
          </select>
        </div>
      </div>

      <div className='mt-5'>
        <p className='mb-1 fs-5 fw-bold'>Metodos de pago</p>
        <div className='border-0 border-bottom'>
          <select className='w-100 border-0 fs-5 rounded-3 text-black bg-transparent' onChange={handleChangeMetodoPago}>
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
      </div>

    </div>
  );
}

export default CartInfoDeal
