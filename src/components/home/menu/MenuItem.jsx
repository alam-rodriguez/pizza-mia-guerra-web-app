import React from 'react';

import { Link } from 'react-router-dom'

const MenuItem = ({link, text, type, notification}) => {

  const onClick = () => {
    if(type == 'no-email') notification()
  };

  return (
    <div className='my-5'>
      <Link onClick={onClick} to={type == 'no-email' ? '' : link} className='text-decoration-none text-secondary'>
        <p className='m-0 fs-3 fw-medium'>{text}</p>
      </Link>
    </div>
  );
}

export default MenuItem;