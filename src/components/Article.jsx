// React
import React, { useContext, useEffect, useState } from 'react';

// Context
import { AppContext } from '../context/AppContext';

// react Icons
import { ImCancelCircle } from 'react-icons/im';
import { getUrlImage } from '../firebase/firebaseStorage';

const Article = ({viewArticleSelected, setViewArticleSelected}) => { 
  
  const { color1, articleSeleted, setArticleSeleted, imagenesArticulos, setImagenesArticulos } = useContext(AppContext);

  const [imgUrl, setImgUrl] = useState(null);

  useEffect( () => {
    if(articleSeleted == null) return;
    const imgId = articleSeleted.imgPath.split('/')[1];
    if(imagenesArticulos[imgId]){
      setImgUrl(imagenesArticulos[imgId]);
      return;
    }
    const f = async () => {
      console.warn('-----------------------------------------')
      const res = await getUrlImage(articleSeleted.imgPath);
      setImgUrl(res);
      setImagenesArticulos(state => ({...state, [imgId]: res}));
    }
    f();
  }, [articleSeleted] );

  const handleClickBack = () => {
    setViewArticleSelected('cerrar');
    setTimeout(() => {
      setArticleSeleted(null);
    }, 950);
  }  

  if(articleSeleted != null){
    return (
      <main className='overflow-hidden-'>
        <div className={`animate__animated ${viewArticleSelected=='abrir' ? 'animate__slideInRight' : viewArticleSelected=='cerrar' ? 'animate__slideOutRight' : ''}  container-fluid- p-0- position-fixed start-0 top-0 h-100 w-100 bg-light z-3`} >
          <div style={{height:'78vh'}}>
            <ImCancelCircle className='position-absolute text-white display-3' style={{top:20, left:20}} onClick={handleClickBack} /> 
            { imgUrl != null
              ? <img className='w-100 h-100 object-fit-cover ' src={imgUrl}  />
              : <></>
            }
          </div>
          <div className='d-flex flex-column position-fixed bottom-0 start-0 justify-content-between h-25- bg-white rounded-top-5 bottom-0 w-100 p-4 pt-0 shadow-lg' style={{height:'32vh'}}>
              <div className='align-self-center mt-2 bg-secondary rounded-5' style={{height:4, width:40}}></div>
              <h3 className='fw-bold fs-2 mt-3'>{articleSeleted.title}</h3>
              <p className='fs-6 fw-medium overflow-y-scroll over'>{articleSeleted.subTitle}</p>
              <button className={`btn form-control text-white fs-4 p-2 ${color1.bgColor}`}>Ordenar Ahora</button>
          </div>
        </div>
      </main>
    );
  }
}

export default Article
