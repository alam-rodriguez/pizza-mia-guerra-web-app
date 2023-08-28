import React from 'react';

// React-Router-Dom
import { Link } from 'react-router-dom';

const ContactDev = () => {

  return (
    <Link className='w-100 text-decoration-none d-flex flex-column bottom-0 start-0 position-absolute border-top p-3 pb-3 z-0' to='https://api.whatsapp.com/send/?phone=18293198834&text&app_absent=0' target='_blank'>
      <p className='m-0 text-center text-secondary'>829-319-8834</p>
      <p className='m-0 text-center text-secondary'>DESARROLLADO POR ALAM RODRIGUEZ</p>
    </Link>
  );
}

export default ContactDev;
