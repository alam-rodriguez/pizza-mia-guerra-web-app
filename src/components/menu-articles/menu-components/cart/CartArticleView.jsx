import React, { useContext, useEffect, useState } from 'react';

// React Icons
import { MdOutlineCancel } from 'react-icons/md';
import { GrSubtractCircle } from 'react-icons/gr';
import { AiOutlinePlusCircle } from 'react-icons/ai';

// Context
import { AppContext } from '../../../../context/AppContext';

// Firebase
import { getUrlImage } from '../../../../firebase/firebaseStorage';

const CartArticleView = ({article, index}) => {

  const { cart, setCart, cartOfCategoryPoints, setCartOfCategoryPoints, imagenesArticulos, setImagenesArticulos } = useContext(AppContext);

  // const [pricioOriginal, setPricioOriginal] = useState(cart[index].precio);

  const [adicionales, setAdicionales] = useState(article.cantidad);

  const [isArticleOfPoints, setIsArticleOfPoints] = useState(false);

  const [imgUrl, setImgUrl] = useState(null);

  useEffect( () => {
    console.log(article);
    const imgId = article.imgPath.split('/')[1];
    if(imagenesArticulos[imgId]) {
      setImgUrl(imagenesArticulos[imgId]);
      return
    }
    console.log('--------------');
    const f = async () => {
      const imgRes = await getUrlImage(article.imgPath);
      setImgUrl(imgRes);
      setImagenesArticulos(state => ({...state, [imgId]:imgRes}));
    }
    f();

  }, [] );

  useEffect( () => {
    let adicionales = '';
    article.ingredientesAdicionales.map((adicional)=>{
      adicionales += adicional.adicional + ',';
      // console.log(adicional.adicional);
    });
    setAdicionales(adicionales);
    if(article.precioVariosArticles == undefined) setIsArticleOfPoints(true);
  }, [] );

  // const handleClickAddItem = () => {
  //   const newCart = [...cart];
  //   newCart[index].cantidad = newCart[index].cantidad + 1;

  //   newCart[index].precio = Number(newCart[index].precio) + Number(pricioOriginal);
  //   setCart(newCart);
  // };
  const handleClickAddItem = () => {
    const newCart = [...cart];
    newCart[index].cantidad = Number(newCart[index].cantidad) + 1;

    newCart[index].precioVariosArticles = Number(newCart[index].precio) * Number(newCart[index].cantidad);    
    // newCart[index].precio = Number(newCart[index].precio) + Number(pricioOriginal);
    setCart(newCart);
  };

  const handleClickSubtract = () => {
    if( cart[index].cantidad == 1) return;
    const newCart = [...cart];
    newCart[index].cantidad = Number(newCart[index].cantidad) - 1;

    newCart[index].precioVariosArticles = Number(newCart[index].precioVariosArticles) - Number(newCart[index].precio);
    setCart(newCart);
  };

  const handleClickDeleteArticle = () => {
    const newArray = [...cart];
    newArray.splice(index, 1);
    setCart(newArray);
  };

  // Handles de articulos de categoria de puntos
  const handleClickAddItemPoints = () => {
    const newCart = [...cartOfCategoryPoints];
    newCart[index].cantidad = Number(newCart[index].cantidad) + 1;

    newCart[index].PuntosVariosArticles = Number(newCart[index].puntos) * Number(newCart[index].cantidad);    
    // newCart[index].precio = Number(newCart[index].precio) + Number(pricioOriginal);
    setCartOfCategoryPoints(newCart);
  };

  const handleClickSubtractPoints = () => {
    if( cartOfCategoryPoints[index].cantidad == 1) return;
    const newCart = [...cartOfCategoryPoints];
    newCart[index].cantidad = Number(newCart[index].cantidad) - 1;

    newCart[index].PuntosVariosArticles = Number(newCart[index].PuntosVariosArticles) - Number(newCart[index].puntos);
    setCartOfCategoryPoints(newCart);
  };

  const handleClickDeleteArticlePoints = () => {
    const newArray = [...cartOfCategoryPoints];
    newArray.splice(index, 1);
    setCartOfCategoryPoints(newArray);
  };

  if(!isArticleOfPoints){
    return (
      <div className='row position-relative mt-2 pb-2 border-bottom'>
        { imgUrl != null
          ? <img src={imgUrl} className='col-3 object-fit-cover rounded-5 mt-3' style={{height:60}} />
          : <></>
        }
  
        <div className='col-7'>
          { article.complex 
            ? <p className='m-0 fw-bold fs-5 mb-1'>{article.ingredientePrincipal} - {article.size}"</p> 
            : <p className='m-0 fw-bold fs-5 mb-1'>{article.ingredientePrincipal}</p>
          }
          { article.mitad != null
            ? article.mitad != '' ? <p className='m-0 fs-6 fw-medium'>Mitad: <span className='fw-bold'>{article.mitad.ingredienteNombre}</span></p>
            : <></>
            : <></>
          }
          { article.ingredientesAdicionales.length > 0 
            ? <p className='m-0 fs-6 fw-medium'>Adicionales: <span className='fw-bold'>{adicionales}</span></p>
            : <></>
          }
          
          <div className='d-flex align-items-center gap-3 mt-4'>
            <GrSubtractCircle className='fs-1' onClick={handleClickSubtract}/>
            <p className='m-0 fs-2'>{article.cantidad}</p>
            <AiOutlinePlusCircle className='fs-1' onClick={handleClickAddItem} />
          </div>
        </div>
  
        <div className='col-2'>
          <MdOutlineCancel className='position-absolute top-0 fs-1' style={{right:20}} onClick={handleClickDeleteArticle} />
          <p className='m-0 position-absolute bottom-0 fs-3' style={{right:20}}>RD$ { article.precioVariosArticles }</p>
        </div>
  
      </div>
    );
  }else {
    return (
      <div className='row position-relative mt-5'>
        <img src={article.imgArticlePath} className='col-3 object-fit-cover rounded-5 mt-3' style={{height:60}} />
  
        <div className='col-7'>

        <p className='m-0 fw-bold fs-4 mb-1'>{article.ingredientePrincipal}</p>

          <div className='d-flex align-items-center gap-3 mt-4'>
            <GrSubtractCircle className='fs-1' onClick={handleClickSubtractPoints}/>
            <p className='m-0 fs-2'>{article.cantidad}</p>
            <AiOutlinePlusCircle className='fs-1' onClick={handleClickAddItemPoints} />
          </div>
        </div>
  
        <div className='col-2'>
          <MdOutlineCancel className='position-absolute top-0 fs-1' style={{right:20}} onClick={handleClickDeleteArticlePoints} />
          <p className='m-0 position-absolute bottom-0 fs-3' style={{right:20}}>{article.PuntosVariosArticles} Puntos</p>
        </div>
  
      </div>
    );
  }

}

export default CartArticleView
