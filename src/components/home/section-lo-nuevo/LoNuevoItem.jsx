import React, { useContext } from 'react'

// React Router
import { useNavigate } from 'react-router-dom';

// Context
import { AppContext } from '../../../context/AppContext';

const LoNuevoItem = ({img, title, subTitle, id}) => {
  const navigate = useNavigate();

  const { color1, articleSeleted, setArticleSeleted, viewMenu } = useContext(AppContext);

  const handleClick = () => {
    if(viewMenu) return;
    setArticleSeleted({
      img, 
      title, 
      subTitle, 
      id,
    });
    navigate('/article');
  }

  return (
    <div className='bg-danger me-4 rounded-5 overflow-hidden' style={{height:150, minWidth:230}} onClick={handleClick}>
        <img className='w-100 h-100 object-fit-cover' src={img} alt="" />
    </div>
  )
}

export default LoNuevoItem;
