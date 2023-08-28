import React, { useContext, useEffect, useState } from 'react';

// React Icon
import { ImCancelCircle } from 'react-icons/im';
import { GrSubtractCircle } from 'react-icons/gr';
import { BsPlusCircle } from 'react-icons/bs';

// Context
import { AppContext } from '../../../context/AppContext';

// Firebase
import { getUrlImage } from '../../../firebase/firebaseStorage';

// Toaster
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const OrderSelectArticle = ({className, setViewMenu, setViewOrderSelectArticle, articlesOfCategorySelected}) => {

  const {color1, articleSelected, categorySelected,  setArticleSelected, precioArticleSelected, setPrecioArticleSelected, setCart,  cartOfCategoryPoints, setCartOfCategoryPoints, infoPointsUser, imagenesArticulos, setImagenesArticulos} = useContext(AppContext);

  // const [img, setImg] = useState(null);

  const [imgUrl, setImgUrl] = useState(null);

  useEffect( () => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: 'instant'
    // });
    console.log(articleSelected);
    const imgId = articleSelected.imgpath.split('/')[1];
    if(imagenesArticulos[imgId]){
      setImgUrl(imagenesArticulos[imgId]);
      return;
    }
    console.warn('--------------------');
    const f = async () => {
      const imgRes = await getUrlImage(articleSelected.imgPath);
      setImgUrl(imgRes);
      setImagenesArticulos(state => ({...state, [imgId]:imgRes}))
    }
    f();
  }, [] );
  
  // pedido
  const [valorArticulo, setValorArticulo] = useState(0);
  const [valorVariosArticulos, setValorVariosArticulos] = useState(0);
  const [valorPuntosArticulo, setValorPuntosArticulo] = useState(0);
  const [valorPuntosVariosArticulos, setValorPuntosVariosArticulos] = useState(0);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredienteMitad, setIngredienteMitad] = useState(null);
  const [cantidadArticulo, setCantidadArticulo] = useState(1);

  // Establecer mitades de articulo
  const [mitades, setMitades] = useState(null);
  useEffect( () => {
    // console.log(isMiddle);
    let articles = [];
    articlesOfCategorySelected.forEach( (article) => {
      
      console.log(article);
      console.log(article.id);
      console.log(articleSelected.id);
      if(article.id == articleSelected.id || !article.isMiddle){
        return;
      }
      
      article.precios.forEach( (articleSize) => {
        if(articleSize.sizeArticle == precioArticleSelected.sizeArticle){
          const articleMitad = {
            id: article.id,
            ingredienteNombre: article.titulo,
            sizeArticlePrice: articleSize.sizeArticlePrice,
          }
          articles.push(articleMitad);
          console.log(articleMitad);
        }
      })
    });
    if(articles.length > 0){
      console.log(articles);
      setMitades(articles);
    }
    // console.log(precioArticleSelected);
  }, [] );

  useEffect( () => {

    console.log(categorySelected);

    // Obtiene img del articulo
    const f = async () => {
      // const res = await getUrlImage(articleSelected.imgpath);
      // setImg(res);
      // console.log(precioArticleSelected);
      // console.log(articleSelected);
      
      if( articleSelected.complex ) setValorArticulo(precioArticleSelected.sizeArticlePrice);
      else setValorArticulo(articleSelected.precios);;
    }
    f();
  }, [] );

  // Para establecer precio o puntos
  useEffect( () => {  
    if(articleSelected.complex){
      console.log('-----------')
      let valor = 0;

      valor += Number(precioArticleSelected.sizeArticlePrice);
      if(ingredienteMitad != null && Number(ingredienteMitad.sizeArticlePrice > Number(precioArticleSelected.sizeArticlePrice))) valor = Number(ingredienteMitad.sizeArticlePrice);
      ingredientes.map((ingrediente) => {
        console.log(ingrediente.precio.precio);
        valor += Number(ingrediente.precio.precio); 
      });
      setValorArticulo(valor);
      valor *= cantidadArticulo;
      setValorVariosArticulos(valor);
    }else if(categorySelected.isCategoryOfPoints == false) {
      console.log(articleSelected.precios);
      let valor = articleSelected.precios;
      setValorArticulo(valor);
      valor *= cantidadArticulo;
      setValorVariosArticulos(valor);
    }else if(categorySelected.isCategoryOfPoints == true) {
      // console.log(categorySelected.isCategoryOfPoints);
      let valor = articleSelected.puntos;
      setValorPuntosArticulo(valor);
      valor *= cantidadArticulo;
      setValorPuntosVariosArticulos(valor);
    }
  }, [ingredienteMitad, ingredientes, cantidadArticulo] );

  const handleClickAdicional = (e, adicional, precio) => {
    const checked = e.target.checked;
    if( checked ){
      setIngredientes(state => ([...state, {adicional, precio}]));
    }else {
      const arrayModificado = ingredientes.filter(ingrediente => ingrediente.adicional != adicional);
      setIngredientes(arrayModificado);
    }
  }
  const handleClickMitad = (mitad) => {
    setIngredienteMitad(mitad);
    // setValorArticulo(mitad.sizeArticlePrice);
  }

  const handleClickAddCantidadArticulo = () => setCantidadArticulo(cantidadArticulo + 1);
  const handleClickReduceCantidadArticulo = () => {
    if(cantidadArticulo == 1) return;
    setCantidadArticulo(cantidadArticulo - 1);
  };

  const goToBack = () => {
    Swal.fire({
      icon: 'warning',
      title: 'No puedes',
      text: 'No puedes seleccionar este articulo porque no tienes sufientes puntos',
    });
    setTimeout(() => {
      setViewMenu(0);
      setClose(true);
      setArticleSelected(null);
      setPrecioArticleSelected(null);
      setViewOrderSelectArticle(false);
    }, 5000);

  }

  const handleClickAgregar = () => {

    if(!categorySelected.isCategoryOfPoints){
      const pedido = {
        ingredientePrincipal: articleSelected.titulo,
        ingredientesAdicionales: ingredientes,
        cantidad: cantidadArticulo,
        mitad: articleSelected.complex ? ingredienteMitad : '',
        precio: valorArticulo,
        precioVariosArticles: valorVariosArticulos,
        size: articleSelected.complex ? precioArticleSelected.sizeArticle : '',
        // imgArticlePath: imagenesArticulos[articleSelected.imgpath.split('/')[1]],
        imgPath: articleSelected.imgpath,
        id: articleSelected.id,
        categoria: categorySelected,
        complex: articleSelected.complex,
      }
      setCart(state => ([...state, pedido]));
      handleClickBack();
      console.log(pedido);
    }else if(categorySelected.isCategoryOfPoints){
      if(infoPointsUser == null){
        goToBack();
        return;
      }
      console.log(infoPointsUser)
      const pointsUser = infoPointsUser.puntosRestantes;
      let pointsMakeOrder = Number(valorPuntosVariosArticulos);
      cartOfCategoryPoints.forEach((element) => {
        pointsMakeOrder += element.PuntosVariosArticles;
      });
      if(pointsUser < pointsMakeOrder){
        goToBack();
        return;
        // toast.warn('No puedes seleccionar este articulo porque no tienes sufientes puntos', {
        //   position: "bottom-center",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      }
      const pedido = {
        ingredientePrincipal: articleSelected.titulo,
        ingredientesAdicionales: ingredientes,
        cantidad: cantidadArticulo,
        mitad: articleSelected.complex ? ingredienteMitad : '',
        puntos: valorPuntosArticulo,
        PuntosVariosArticles: valorPuntosVariosArticulos,
        size: articleSelected.complex ? precioArticleSelected.sizeArticle : '',
        imgArticlePath: imagenesArticulos[articleSelected.imgpath.split('/')[1]],
        id: articleSelected.id,
        categoria: categorySelected,
        complex: articleSelected.complex,
      }
      setCartOfCategoryPoints(state => ([...state, pedido]));
      handleClickBack();
      console.log(pedido);
    }

  }

  const handleClickBack = () => {
    setClose(true);
    setTimeout(() => {
      setArticleSelected(null);
      setPrecioArticleSelected(null);
      setViewOrderSelectArticle(false);
    }, 500);
  }

  const [close, setClose] = useState(false);

  // const handleScroll2 = () => {
  //   console.log(window.scrollY)
  //   const scrollTop = window.scrollY;
  // };
  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll2);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll2);
  //   };
  // }, []);
  
  return (
    <main className='h-100 bg-danger'>
      <div className={`${className} overflow-auto- animate__animated ${!close ? 'animate__fadeIn': 'animate__fadeOut'} position-absolute top-0 start-0 bg-white z-3 w-100 h-100`} style={{minHeight:'100vh'}}>
        <section className=' w-100 z-0 d-flex justify-content-center align-items-center h-25' style={{}}>
          <div className='position-absolute start-0 top-0 d-flex' style={{width: '100px', height:'100px', clipPath: 'polygon(0 0, 0% 100%, 100% 0)', background:'linear-gradient(140deg, rgba(0, 0, 0, 0.46) 10%, rgba(0, 0, 0, 0) 55%)'}}>
            <ImCancelCircle className='position-absolute text-white display-3' style={{top:10, left:10}} onClick={handleClickBack} />
          </div>
          { imgUrl != null
            ? <img src={imgUrl} className='w-100 object-fit-cover ' style={{height:'100%'}} />
            : <div className="spinner-border text-success fs-2" role="status" style={{height:50, width:50}}>
                <span className="visually-hidden">Loading...</span>
              </div> 
          }
        </section>
        <section className='bg-white rounded-top-5 shadow-lg h-75 position-relative p-4 d-flex flex-column justify-content-between pb-0' style={{bottom:30}}>

          <div className='mb-5' style={{marginBottom:0}}>
            { articleSelected.complex 
              ? <h2 className='fs-1 fw-bold'>{articleSelected.titulo} - {precioArticleSelected.sizeArticle}"</h2>
              : <h2 className='fs-1 fw-bold'>{articleSelected.titulo}</h2>
            }

            <p className='m-0 fs-4 fw-normal overflow-scroll' style={{maxHeight: articleSelected.complex ? '150px': ''}}>{articleSelected.subtitulo}</p>
            

            { articleSelected.complex ?
              <div className="accordion my-4" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="btn form-control d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <p className='fs-5 m-0 fw-bold'>Ingredientes adicionales</p>
                      <p className='fs-6 m-0 text-secondary'>Requerido</p>
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">

                      { Object.keys(precioArticleSelected.adicionales).map((adicional, i)=>( 
                          <div key={i} className="form-check d-flex justify-content-between">
                            <div>
                              <input className="form-check-input" type="checkbox" value="" id={`flexCheck${i}`} onClick={(e)=>handleClickAdicional(e, adicional, precioArticleSelected.adicionales[adicional])}/>
                              <label className="form-check-label" htmlFor={`flexCheck${i}`}>
                                {adicional}
                              </label>
                            </div>
                            <p className='m-0 text-secondary'>
                              {precioArticleSelected.adicionales[adicional].precio}
                            </p>
                          </div>
                        ))
                      }

                    </div>
                  </div>
                </div>
              </div>
              : <></>
            }

            { articleSelected.complex && mitades != null? 
              // SI ES MITAD Y MITAD
              <div className="accordion my-4" id="accordionExample">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button className="btn form-control d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      <p className='fs-5 m-0 fw-bold'>Mitad</p>
                      <p className='fs-6 m-0 text-secondary'>Obcional</p>
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                      
                    {/* { Object.keys(precioArticleSelected.adicionales).map((adicional, i)=>( 
                      <AdicionalesList key={i} adicional={adicional} isMiddle={precioArticleSelected.adicionales[adicional].isMiddle} i={i} handleClickMitad={handleClickMitad} />
                    ))
                    } */}
                    { (mitades != null)
                      ? (mitades.length > 0) 
                        ? mitades.map( (mitad, i) => ( 
                          <AdicionalesList mitad={mitad} articlesOfCategorySelected={articlesOfCategorySelected} key={mitad.id} i={i} handleClickMitad={handleClickMitad} />
                          // <AdicionalesList mitad={mitad} articlesOfCategorySelected={articlesOfCategorySelected} key={i} adicional={adicional} isMiddle={precioArticleSelected.adicionales[adicional].isMiddle} i={i} handleClickMitad={handleClickMitad} />
                        ))
                        : <></>
                      : <></>
                    }

                    </div>
                  </div>
                </div>
              </div>
            : <></>
            }

          </div>
          

        </section>

        {/* <footer className='row h-auto mb-5' style={{}}> */}
        <footer className='row mb-5- position-fixed bottom-0 start-0 w-100 mx-auto bg-white p-3 border-top- shadow-lg-' style={{}}>
          <div className='d-flex ps-0 gap-3 align-items-center col-5'>
            <GrSubtractCircle className='display-6' onClick={handleClickReduceCantidadArticulo} />
            <p className='mb-2 display-4 fw-medium text-center'>{cantidadArticulo}</p>
            <BsPlusCircle className='display-6' onClick={handleClickAddCantidadArticulo} />
          </div>
          <button className={`${!categorySelected.isCategoryOfPoints ? 'py-3' : 'py-3'}  btn ${color1.btn} d-flex justify-content-between align-items-center col-7`} onClick={handleClickAgregar}>
            <p className={`m-0 ${!categorySelected.isCategoryOfPoints ? 'fs-3' : 'fs-4'}`}>Agregar</p>
            <p className={`m-0 ${!categorySelected.isCategoryOfPoints ? 'fs-3' : 'fs-4'}`}>{!categorySelected.isCategoryOfPoints ? `${valorVariosArticulos} RD$` : `${valorPuntosVariosArticulos} puntos` } </p>
          </button>
        </footer>
    </div>
    </main>
  )
}

export default OrderSelectArticle;

const AdicionalesList = ({mitad, adicional, isMiddle, i, handleClickMitad, articlesOfCategorySelected}) => {

      return (
        <div className='d-flex justify-content-between'>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="flexRadioDefault" id={`flexRadio${i}`} onClick={()=>handleClickMitad(mitad)} />
            <label className="form-check-label" htmlFor={`flexRadio${i}`}>
              {mitad.ingredienteNombre}
            </label>
          </div>
          <p className='m-0 text-secondary'>
          {mitad.sizeArticlePrice}
          </p>
        </div>
        );
      }

//   if(isMiddle){
//     return (
//       <div className='d-flex justify-content-between'>
//         <div className="form-check">
//           <input className="form-check-input" type="radio" name="flexRadioDefault" id={`flexRadio${i}`} onClick={()=>handleClickMitad(adicional)} />
//           <label className="form-check-label" htmlFor={`flexRadio${i}`}>
//             {adicional}
//           </label>
//         </div>
//         <p className='m-0 text-secondary'>
//         {/* {precioArticleSelected.adicionales[adicional]} */}
//         </p>
//       </div>
//     )
//   }
// }





          {/* <div className='d-flex align-items-center row col-5'>
            <GrSubtractCircle className='display-4 col-5' onClick={handleClickReduceCantidadArticulo} />
            <p className='mb-2 display-3 fw-bold col-2 text-center'>{cantidadArticulo}</p>
            <BsPlusCircle className='display-4 col-5' onClick={handleClickAddCantidadArticulo} />
          </div> */}

