import React, { useContext } from 'react';

// React Router
import { Link } from 'react-router-dom';

// Reatc Icon
import { HiFaceSmile } from 'react-icons/hi2';

// Component
import MenuItem from './MenuItem';

// Context
import { AppContext } from '../../../context/AppContext';

// Swal-Notification
import Swal from 'sweetalert2';
// React-Toaster
// import { toast } from 'react-toastify';

const Menu = () => {

	const { email } = useContext(AppContext);

	const notification = () => Swal.fire({
    icon: 'info',
    title: 'No puedes',
    text: 'Para acceder a esta seccion debes de iniciar sesion y hacer por lo menos un pedido',
  });

  return (
    <section className='w-75 mt-5 mx-4 position-absolute'>
      
			<Link className='text-decoration-none text-secondary d-flex align-items-center' to='/registro'>
				<HiFaceSmile className='' style={{fontSize:80}} />
         <p className='m-0 ms-3 fs-5 fw-medium'>Iniciar sesion</p>
      </Link>

			<nav>

				<MenuItem
					link='#' 
					text='SOBRE NOSOTROS'
				/>
				<MenuItem
					link='/invite-friends' 
					text='INVITAR AMIGOS'
					type={email == null ? 'no-email' : null}
					notification={notification}
				/>
				<MenuItem
					link='/order-history' 
					text='HISTORIAL DE ORDENES'
					type={email == null ? 'no-email' : null}
					notification={notification}
				/>
				<MenuItem
					link='/ajustes' 
					text='AJUSTES'
				/>
				<MenuItem
					link='#' 
					text='AYUDA' 
				/>
					
			</nav>

    </section>
  );
}

export default Menu;
