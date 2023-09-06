import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const HomeViewMenu = ({children, Menu, ContactDev}) => {

  const {viewMenu, articleSeleted} = useContext(AppContext);
  return (
    <div className='d-flex h-100- w-100-'>
         
      <Menu className='' />

      <div className={`main-normal container-sm w-100- container- bg-white z-2 ${viewMenu ? 'main-container-view-menu': ''} ${articleSeleted != null ? 'overflow-hidden':''}`}  >
        {children} 
      </div>
      
      <ContactDev className='' />

    </div>
  )
}

export default HomeViewMenu
