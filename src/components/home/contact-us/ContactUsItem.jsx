import React from 'react';

// React-Router-Dom
import { Link } from 'react-router-dom';

const ContactUsItem = ({icon, title, appName, link}) => {

  return (
    <Link className='text-black text-decoration-none' to={link} target='_blank'>
      <div className='d-flex align-items-center'>
        {icon}
        <div>
          <p className='m-0' style={{fontSize:10}}>{title}</p>
          <p className='m-0 fw-bold' style={{fontSize:12}}>{appName}</p>
        </div>
      </div>
    </Link>
  );
}

export default ContactUsItem;
