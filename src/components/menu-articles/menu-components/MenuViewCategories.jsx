import React, { useContext, useEffect, useState } from 'react';


// Firebase
import { getArticlesByCategory } from '../../../firebase/firebaseFirestore';
import { getUrlImage } from '../../../firebase/firebaseStorage';

// Context
import { AppContext } from '../../../context/AppContext';

const MenuViewCategories = ({nombre, imgPath, category, setViewMenu}) => {

  const {categorySelected, setCategorySelected, cart, color1, imagenesCategorias, setImagenesCategorias, imagenesArticulos, setHaEstadoEnMenu} = useContext(AppContext);

  // const [categorySelect, setCategorySelect] = useState(null);
  // const [img, setImg] = useState('');

  const [imgUrl, setImgUrl] = useState(null);

  const [countItem, setCountItem] = useState(0);

  useEffect( () => {
    let imgId = imgPath.split('/')[1];
    if(imagenesCategorias[imgId]) {
      setImgUrl(imagenesCategorias[imgId]);
      return;
    }
    console.log('--------------');
    const f = async () => {
      const imgRes = await getUrlImage(imgPath);
      setImgUrl(imgRes);
      setImagenesCategorias(state => ({...state, [imgId]:imgRes}));
    }
    f();
  }, [] )

  const handleClick = () => {
    console.log(category);
    // console.log(imgpath.split('/')[1]);
    // console.log( imagenesCategorias[realPath] );

    setCategorySelected(category);
    setViewMenu(1);
    // console.log(categorySelect);
    // setCategoriesSelected(categorySelect);
  }

  const [realPath, setrealPath] = useState(null);

  useEffect( () => {
    setHaEstadoEnMenu(true);
    // console.log(imagenesCategorias);
    // setrealPath(imgpath.split('/')[1]);


    // console.log(imagenesCategorias[realPath]);

    // console.log( imagenesCategorias[imgpath.split('/')[1]] );

    
    // // console.log(category.position);
    // imagenesCategorias.forEach( img => {
    //   console.log(img)
    // });
    const f = async () => {
      
      // console.log(category);
      // const res = await getArticlesByCategory(id);
      // const img = await getUrlImage('');
      // setImg(img);
      // setCategorySelect(res);
    }
    f();
  }, [] );

  useEffect( () => {
    let count = 0;
    cart.map((article)=>{
      if( article.categoria == category.id) count++;
      console.log(article.categoria);
      console.log(category.id);
    });
    setCountItem(count);
  }, [cart] );

  return (
    <div className='animate__animated-animate__fadeIn d-flex flex-column border rounded-3 overflow-hidden position-relative my-2' style={{height:'190px', width:'45%'}} onClick={handleClick}>
      { countItem > 0 
        ? <div className={`${color1.bgColor} rounded-circle position-absolute top-0 end-0 m-3 shadow  d-flex justify-content-center align-content-center `} style={{height:30, width:30}}>
            <p className='fs-3 text-white' >{countItem}</p>
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

      { imgUrl != null
        ? <img className='object-fit-cover' style={{height:'65%'}} src={imgUrl} alt="" />
        : <div className='d-flex justify-content-center' style={{height:'65%'}}>
            <div className="spinner-border text-success fs-5 align-self-center" role="status" style={{height:40, width:40}}>
              <span className="visually-hidden">Loading...</span>
            </div> 
          </div>
      }

      <p className='m-0 fs-5 fw-semibold px-2' style={{height:'35%'}}>{nombre}</p>
    </div>
  );
}

export default MenuViewCategories;
