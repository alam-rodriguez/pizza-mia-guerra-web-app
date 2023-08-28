// React
import React from 'react';

// React Icons
import { MdOutlineNavigateNext } from 'react-icons/md';

// React Router
import { Link } from 'react-router-dom';

const SettingsItem = ({text, link, other}) => {
  return (
    <Link className='text-black text-decoration-none border-0 border-bottom border-secondary col-12 d-flex justify-content-between my-4 py-2' to={link}>
      <p className='m-0 fs-4'>{text}</p>
      <div className='d-flex justify-content-center'>
        {other}
        <MdOutlineNavigateNext className='display-4 text-secondary'/>    
      </div>  
    </Link>
  )
}

export default SettingsItem
