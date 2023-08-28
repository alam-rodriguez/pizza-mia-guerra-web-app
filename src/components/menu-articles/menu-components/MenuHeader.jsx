import React, { useContext, useEffect } from 'react';

// React Icons
import { IoIosArrowBack } from 'react-icons/io'
import { FaPizzaSlice } from 'react-icons/fa';

// React Router Dom
import { useNavigate } from 'react-router-dom';

// Context
import { AppContext } from '../../../context/AppContext';

// Firebase 
import { getEstadisticas } from '../../../firebase/firebaseFirestore';

const MenuHeader = ({viewSectionInHeader, text, viewMenu, setViewMenu, setArticlesOfCategorySelected, viewPreviewInfoArticle}) => {
  const navigate = useNavigate();

  const {email, infoPointsUser, setCategorySelected, setArticleSelected, amountPoints, setAmountPoints, setInfoPointsUser} = useContext(AppContext);

  const handleClickBack = () => {
    setArticlesOfCategorySelected(null);
    if( viewMenu == 0){
      navigate('/home');
    }else if(viewMenu == 1){
      setViewMenu(0);
      setCategorySelected(null);
    }
  }

  // Obtener puntos del usuario
  useEffect( () => {
		if(email != null && infoPointsUser == null){
			const f = async () => {
				// const infoUser = await getPointsUser(email);
				const pointsUser = await getEstadisticas(email);
				if(pointsUser != 'no estadisticas' && pointsUser != false) {
					setAmountPoints( Math.round(pointsUser.puntosRestantes) );
					setInfoPointsUser(pointsUser);
				}
				console.log(pointsUser);
			}
			f();
		}
	}, [] );

  

  return (
    <header className={`d-flex justify-content-between py-4 position-sticky top-0 w-100 bg-white start-0 z-2 ${viewPreviewInfoArticle ? 'animate__animatedanimate__fadeIn z-0 bg-black bg-opacity-10 z-3' : ''}`} >
      <IoIosArrowBack className='display-4' onClick={handleClickBack} /> 
      <p className='fs-5 w-75 fw-medium position-absolute start-50 top-50 translate-middle text-center'>{viewSectionInHeader ? text : null}</p>
      <div className='d-flex me-2 align-items-center gap-2'>
        <p className='m-0 fw-medium fs-4'>{amountPoints}</p>
        <FaPizzaSlice className='fs-5' />
      </div>
    </header>
  )
  // return (
  //   <header className='d-flex justify-content-between py-4 position-absolute'>
  //     <IoIosArrowBack className='display-4 ' onClick={handleClickBack} /> 
  //     <div className='d-flex me-4 align-items-center gap-2'>
  //       <p className='m-0 fs-4'>{amountPoints}</p>
  //       <FaPizzaSlice className='fs-5' />
  //     </div>
  //   </header>
  // )
}

export default MenuHeader
