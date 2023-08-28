import React, { useContext, useEffect, useState } from 'react';


// Firebase
import { getArticlesByCategory, getEstadisticas } from '../../../firebase/firebaseFirestore';
import { getUrlImage } from '../../../firebase/firebaseStorage';

// Context
import { AppContext } from '../../../context/AppContext';

// React Router Dom
import { useNavigate } from 'react-router-dom';

const MenuViewArticles = ({id, titulo, imgPath, articulo, setViewPreviewInfoArticle }) => {
  const navigate = useNavigate();

  const { email, color1, articleSelected, setArticleSelected, cart, infoPointsUser, setInfoPointsUser, imagenesArticulos, setImagenesArticulos} = useContext(AppContext);

  // // const [categories, setCategories] = useState(null);
  // const [img, setImg] = useState(null);

  const [imgUrl, setImgUrl] = useState(null);

  const [countItem, setCountItem] = useState(0);

  // const [realPath, setRealPath] = useState(null);

  useEffect( () => {
    const imgId = imgPath.split('/')[1];
    if(imagenesArticulos[imgId]){
      setImgUrl(imagenesArticulos[imgId]);
      return;
    }
    console.log('--------------------')
    const f = async () => {
      const imgRes = await getUrlImage(imgPath);
      setImgUrl(imgRes);
      setImagenesArticulos(state => ({...state, [imgId]:imgRes}))
    }
    f();
    // setRealPath(imgpath.split('/')[1]);
    // console.log(imagenesArticulos);
    // console.log(imgpath.split('/')[1]);
  }, [] );

  // Obtener puntos del usuario
  useEffect( () => {
		if(infoPointsUser == null){
			const f = async () => {
				const pointsUser = await getEstadisticas(email);
				if(pointsUser != 'no estadisticas' && pointsUser != false) setInfoPointsUser(pointsUser);
        else if(pointsUser != 'no estadisticas') setInfoPointsUser({
          dineroGastado: 0,
          puntosGanados: 0,
          puntosGastados: 0,
          puntosRestantes: 0,
        });
				console.log(pointsUser);
			}
			f();
		}
	}, [] );

  const handleClick = () => {
    setArticleSelected(articulo);
    setViewPreviewInfoArticle(true);
    console.log(articulo.complex);
  }

  useEffect( () => {
    // console.log(titulo)
    const f = async () => {
      // const img = await getUrlImage(imgpath);
      // setImg(img);
    }
    f();
  }, [] );

  useEffect( () => {
    let cantidad = 0;
    cart.map((article)=>{
      if( id == article.id) cantidad += 1;
    });
    setCountItem(cantidad);
  }, [cart] );

  return (
    <div className='animate__animated********animate__fadeIn d-flex flex-column justify-content-center border rounded-3 overflow-hidden position-relative z-0 m-2' style={{height:190, width:160}} onClick={handleClick}>
      { countItem > 0 
        ? <div className={`${color1.bgColor} rounded-circle position-absolute top-0 end-0 m-3 shadow  d-flex justify-content-center align-content-center `} style={{height:30, width:30}}>
            <p className='fs-5 text-white' >{countItem}</p>
          </div>
        : <></>
      }
      {/* { img != null
        ? <img className='object-fit-cover' style={{height:'65%'}} src={img} alt="" />
        : <div className='d-flex justify-content-center' style={{height:'65%'}}>
            <div className="spinner-border text-success fs-2 align-self-center" role="status" style={{height:50, width:50}}>
              <span className="visually-hidden">Loading...</span>
            </div> 
          </div>
      } */}
      {/* { img != null 
        ? <img className='object-fit-cover' style={{height:'65%'}} src={img} alt="" />
        : <></>
      } */}
      
      { imgUrl != null
        ? <img className='object-fit-cover animate__animated animate__fadeIn' style={{height:'65%'}} src={imgUrl} alt="" />
        : <div className='d-flex justify-content-center' style={{height:'65%'}}>
            <div className="spinner-border text-success fs-5 align-self-center" role="status" style={{height:40, width:40}}>
              <span className="visually-hidden">Loading...</span>
            </div> 
          </div>
      }

      <p className='m-0 fs-5 fw-semibold px-2' style={{height:'35%'}}>{titulo}</p>
    </div>
  );
}

export default MenuViewArticles;
