import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const HomeViewMenu = ({children, Menu, ContactDev}) => {

  const {viewMenu, articleSeleted} = useContext(AppContext);
  return (
    <div className='d-flex h-100- w-100-'>
         
      <Menu />

      <div className={`main-normal w-100 container bg-white z-2 ${viewMenu ? 'main-container-view-menu': ''} ${articleSeleted != null ? 'overflow-hidden':''}`}  >
        {children} 
      </div>
      
      <ContactDev className='' />

    </div>
  )
}

export default HomeViewMenu
