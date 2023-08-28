import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

// Context
import { AppContext } from '../../context/AppContext';

// Firebase
import { getAllCategories, getArticlesByCategory, getCategoriesFilted, getEstadisticas, obtenerInfoApp } from '../../firebase/firebaseFirestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Components
import MenuHeader from './menu-components/MenuHeader';
import MenuViewCategories from './menu-components/MenuViewCategories';
import MenuViewArticles from './menu-components/MenuViewArticles';
import PreviewInfoArticle from './menu-components/PreviewInfoArticle';
import OrderSelectArticle from './menu-components/OrderSelectArticle';
import CartPreview from './menu-components/cart/CartPreview';
import Cart from './menu-components/cart/Cart';

// Toaster
import { ToastContainer } from 'react-toastify';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';
import { getImagesFromFolder, getImagesFromFolderForHome } from '../../firebase/firebaseStorage';

const MenuArticles = () => {

  const navigate = useNavigate();

  const { email, categories, setCategories, categoriesOfMenu, setCategoriesOfMenu, setEmail, categorySelected, cart, setCart, cartOfCategoryPoints, setCartOfCategoryPoints, infoPointsUser, setInfoPointsUser, amountPoints, setAmountPoints, infoPoints, setInfoPoints, estadisticasUser, setEstadisticasUser, setClientOrders, imagenesCategorias, setImagenesCategorias, imagenesArticulos, setImagenesArticulos, articlesOfHome, haEstadoEnMenu, setHaEstadoEnMenu, adminsTokens, setAdminsTokens } = useContext(AppContext)

  const [articlesOfCategorySelected, setArticlesOfCategorySelected] = useState(null);

  const [viewMenu, setViewMenu] = useState(0);

  const [viewPreviewInfoArticle, setViewPreviewInfoArticle] = useState(false);

  const [viewOrderSelectArticle, setViewOrderSelectArticle] = useState(false);

  const [viewCart, setViewCart] = useState(false);

  useEffect( () => {
    const f = async () => {
      if(infoPoints == null || adminsTokens.length == 0){
        const infoApp = await obtenerInfoApp();
        console.log(infoApp);
        setInfoPoints(infoApp.infoPoints);
        setAdminsTokens(infoApp.adminsTokens);
      }
    }
    f();
  }, [] );

  // Loguea al usuario si automaticamente
  useEffect( () => { 
    if(email == null){
      const auth = getAuth();
      onAuthStateChanged(auth, (user)  => {
        if(user != null) setEmail(user.email);
      });
    }
  }, [] );

  // obtener puntos de usuario
  // useEffect( () => {
  //   if(email != null && infoPointsUser == null){
  //     console.log('----');
  //     const f = async () => {
  //       const pointsUser = await getEstadisticas(email);
  //       if(pointsUser != 'no estadisticas' && pointsUser != false) {
  //         setAmountPoints( pointsUser.puntosRestantes );
  //         setInfoPointsUser(pointsUser);
  //       }
  //       console.log(pointsUser);
  //     }
  //     f();
  //   }
  // }, [email] );

  // Crea y obtiene estadisticas de usuarios
  // useEffect( () => {
  //   if(estadisticasUser == null){
  //     const f = async () => {
  //       const estadisticas = await getEstadisticas(email);
  //       console.log(estadisticas);
  //       if(estadisticas.dineroGastado != undefined) setEstadisticasUser(estadisticas);
  //       else if(estadisticas == 'no estadisticas'){
  //         const firstEstadisticas = {
  //           dineroGastado: 0,
  //           puntosGanados: 0,
  //           puntosGastados: 0,
  //           puntosRestantes: 0,
  //         }
  //         setEstadisticasUser(firstEstadisticas);
  //       }
  //     }
  //     f();
  //   }
  // }, [] );

  // useEffect( () => {
  //   const f = async () => {
  //     if(viewMenu == 0 ){
  //       const res = await getCategoriesFilted('viewInMenu');
  //       setCategories(res);
  //       console.log(res);
  //     }else if(viewMenu == 1){
  //       const res = await getArticlesByCategory(categorySelected.id);
  //       setArticlesOfCategorySelected(res);
  //     }
  //   }
  //   f();
  // }, [viewMenu] );

  // Obtener categorias
  useEffect( () => {
    if(categories == null && categoriesOfMenu == null && articlesOfHome == null){
      const getInfo = async () => {
        let categoryiesOfHome = [];
        let categoriesOfMenu = [];
        const categories = await getAllCategories('viewInHome');
        
        categories.forEach( (categoria) => {
          if(categoria.viewInHome) categoryiesOfHome.push(categoria);
          if(categoria.viewInMenu) categoriesOfMenu.push(categoria);
        });

        categoryiesOfHome.sort((a, b) => b.position - a.position);
        categoriesOfMenu.sort((a, b) => a.position - b.position);
        setCategories(categoryiesOfHome);
        setCategoriesOfMenu(categoriesOfMenu);


        // const imagesOfCategories = await getImagesFromFolder('imagenes-categorias');
        // setImagenesCategorias(imagesOfCategories);
        // console.warn('Cargaron categorias');  


        // let articles = [];
        // await Promise.all(categoryiesOfHome.map(async (category) => {
        //   let articlesOfCategory = await getArticlesByCategory(category.id);
        //   articlesOfCategory.forEach((article) => {
        //     articles.push(article.id);
        //   });
        // }));
        // let articlesOfHome = await getImagesFromFolderForHome('imagenes-articulos', articles);
        // setImagenesArticulos(articlesOfHome);
        
        // console.log(articlesOfHome);
        // console.warn('Debe de verse');

        
      }
      getInfo();
    }
  }, [] );

  // obtener articulos de cateoria seleccionada
  useEffect( () => {
    if(viewMenu == 1){
    const f = async () => {
        const res = await getArticlesByCategory(categorySelected.id);
        res.sort((a,b) => a.position - b.position);
        setArticlesOfCategorySelected(res);
      }
      f();
    }
  }, [viewMenu] );

  const resetCart = () => {
    setViewMenu(0);
    setViewPreviewInfoArticle(false);
    setViewOrderSelectArticle(false);
    setArticlesOfCategorySelected(null);
    setCartOfCategoryPoints([]);
    setCart([]);
    setViewCart(false);
    setClientOrders(null);
    setInfoPointsUser(null);
    navigate('/home');
  }


  

  // Obtiene imagenes de articulos que no tengo
  // useEffect(() => {
  //   if(categorySelected == null || articlesOfCategorySelected == null || imagenesArticulos == null) return;
  //   const f = async () => {
  //     let articlesSinImagenes = [];
  //     articlesOfCategorySelected.forEach( (article) => {
  //       let imgPath = article.imgpath.split('/')[1];
  //       if(!imagenesArticulos.hasOwnProperty(imgPath)) articlesSinImagenes.push(imgPath);
  //     });
  //     if(articlesSinImagenes.length == 0) return;

  //     let articlesOfHome = await getImagesFromFolderForHome('imagenes-articulos', articlesSinImagenes);
  //     setImagenesArticulos(state => ({...state, ...articlesOfHome}));
  //   }
  //   f();
    
  // }, [categorySelected, articlesOfCategorySelected]);

  // const [viewSectionInHeader, setViewSectionInHeader] = useState(false);
  // const handleScroll = (e) => {
  //   const scrollTop = e.target.scrollTop;
  //   console.log(scrollTop);
  //   if(scrollTop > 30) setViewSectionInHeader(true);
  //   else setViewSectionInHeader(false);
  // };


  // const [scrollY, setScrollY] = useState(0);

  const [viewSectionInHeader, setViewSectionInHeader] = useState(false);
  const handleScroll2 = () => {
    // console.log(window.scrollY)
    const scrollTop = window.scrollY;
    if(scrollTop > 30) setViewSectionInHeader(true);
    else setViewSectionInHeader(false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll2);

    return () => {
      window.removeEventListener('scroll', handleScroll2);
    };
  }, []);

  
  
  //style={{marginBottom:/*!viewCart ? 60:''*/ , /*marginTop:!viewCart ? 90 : ''*/}}

  const [viewmenuOrArticles, setViewmenuOrArticles] = useState(true);



  // const child1Ref = useRef();
  // const child2Ref = useRef();
  // const [parentHeight, setParentHeight] = useState(0);
  // const updateParentHeight = () => {
  //   const child1Height = child1Ref.current.offsetHeight;
  //   const child2Height = child2Ref.current.offsetHeight;
  //   const maxHeight = Math.max(child1Height, child2Height);
  //   setParentHeight(maxHeight);
  // };

  // // useEffect(() => {
  // //   updateParentHeight();
  // //   window.addEventListener('resize', updateParentHeight);

  // //   return () => {
  // //     window.removeEventListener('resize', updateParentHeight);
  // //   };
  // // }, []);
  // useLayoutEffect(() => {
  //   const child1Height = child1Ref.current.clientHeight;
  //   const child2Height = child2Ref.current.clientHeight;
  //   const maxHeight = Math.max(child1Height, child2Height);
  //   setParentHeight(maxHeight);
  // }, []);

  // const child1Ref = useRef(null);
  // const child2Ref = useRef(null);
  // const [parentHeight, setParentHeight] = useState(0);

  // useEffect(() => {
  //   const updateParentHeight = () => {
  //     if (child1Ref.current && child2Ref.current) {
  //       const child1Height = child1Ref.current.clientHeight;
  //       const child2Height = child2Ref.current.clientHeight;
  //       const maxHeight = Math.max(child1Height, child2Height);
  //       setParentHeight(maxHeight);
  //     }
  //   };
  //   console.warn(child1Ref.current.clientHeight);

  //   // Call the function once on mount
  //   updateParentHeight();

  //   // Call the function again when the window is resized
  //   window.addEventListener('resize', updateParentHeight);

  //   // Cleanup: remove the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('resize', updateParentHeight);
  //   };
  // }, [viewCart]);

  // const parentRef = useRef(null);
  // const child1Ref = useRef(null);
  // const child2Ref = useRef(null);
  // const [parentHeight, setParentHeight] = useState(0);

  // useEffect(() => {
  //   const updateParentHeight = () => {
  //     if (parentRef.current && child1Ref.current && child2Ref.current) {
  //       console.warn('------')
  //       const child1Height = child1Ref.current.clientHeight;
  //       const child2Height = child2Ref.current.clientHeight;
  //       const maxHeight = Math.max(child1Height, child2Height);
  //       setParentHeight(child1Height);
  //     }
  //   };

  //   updateParentHeight();
  //   window.addEventListener('resize', updateParentHeight);

  //   return () => {
  //     window.removeEventListener('resize', updateParentHeight);
  //   };
  // }, [viewCart]);

  const [heightCart, setHeightCart] = useState(0);

  useEffect( () => {
    
    const cart = document.querySelector('.cart');
    const articleSelected = document.querySelector('.article-selected');
    if(cart != null && viewCart) {
      console.warn(cart.clientHeight)
      setHeightCart(cart.clientHeight);
      // if(cart.current != undefined)console.warn(cart.current.clientHeight);
    }
    if(articleSelected != null){
      console.warn(articleSelected.clientHeight);
      setHeightCart(articleSelected.clientHeight);
    }
  }, [viewCart, viewOrderSelectArticle] );
  

  if(categoriesOfMenu != null){
    return (
      <main className={` ${viewCart ? 'overflow-hidden ': ''}`} style={{maxHeight:viewCart ? heightCart:''}}>
        

        {/* <div className={` col-12 col-md-6 ${!haEstadoEnMenu ? 'animate__animated animate__fadeIn' : ''} z-2 px-3-  ${viewPreviewInfoArticle ? 'animate__animatedanimate__fadeIn z-0 bg-black bg-opacity-25 z-3' : ''}`} > */}
        
        { viewCart 
          ? <div  className={`cart child1 position-absolute start-0 top-0 animate__animated  z-3`} >
              <Cart  setViewCart={setViewCart} setViewMenu={setViewMenu} resetCart={resetCart} setViewmenuOrArticles={setViewmenuOrArticles} />
            </div>
          : <></>
        }

        
        <div className={`child2 px-3 z-2 position-relative start-0 top-0 ${viewPreviewInfoArticle ? 'animate__animatedanimate__fadeIn z-0 bg-black bg-opacity-25 z-3' : ''}`} style={{paddingBottom:70 , paddingTop:0}}>
        <MenuHeader viewSectionInHeader={viewSectionInHeader} text={viewMenu == 0 ? 'Menu' : categorySelected?.nombre} className='' viewMenu={viewMenu} setViewMenu={setViewMenu} setArticlesOfCategorySelected={setArticlesOfCategorySelected} viewPreviewInfoArticle={viewPreviewInfoArticle}/>

          {/* <div className={`position-absolute px-3 vh-100 vw-100 p-0 m-0 start-0 animate__animated animate__fadeIn z-0${viewPreviewInfoArticle ? 'bg-black bg-opacity-25' : ''}`}> */}
          {/* Header */}
          
          { viewMenu == 0 ? 
            <>
              <h2 className='fs-1 fw-bold'>Menu</h2>

              <div className='d-flex flex-wrap justify-content-between'>
                { categoriesOfMenu != null
                  ? categoriesOfMenu.map((category)=>{
                    // const path = category.imgpath.split('/')[1]; 
                    return <MenuViewCategories
                      key={category.id}
                      nombre={category.nombre}
                      imgPath={category.imgpath}
                      category={category}
                      setViewMenu={setViewMenu}
                    />
                  })
                  : <></>
                }
              </div>
            </>
          : viewMenu == 1 ?
            <>
              { viewPreviewInfoArticle
                ? 
                // <div className='animate__animated animate__fadeInUp vw-100 vh-100 position-absolute start-0 top-0 bg-black bg-opacity-25'>
                <PreviewInfoArticle setViewPreviewInfoArticle={setViewPreviewInfoArticle} setViewOrderSelectArticle={setViewOrderSelectArticle} />
                // {/* </div> */}
                : <></> 
              }
              { viewOrderSelectArticle
                ? <OrderSelectArticle className='article-selected' setViewMenu={setViewMenu} setViewOrderSelectArticle={setViewOrderSelectArticle} articlesOfCategorySelected={articlesOfCategorySelected} />
                : <></>
              }
              <div >
                <h2 className='fs-1 fw-bold '>{categorySelected.nombre}</h2>
                    
                    <div className='d-flex flex-wrap justify-content-between'>
                      { articlesOfCategorySelected != null
                        ? articlesOfCategorySelected.map((articulo)=>{
                          const path = articulo.imgpath.split('/')[1];
                          return <MenuViewArticles
                            key={articulo.id}
                            id={articulo.id}
                            titulo={articulo.titulo}
                            imgPath={articulo.imgpath}
                            articulo={articulo}
                            setViewPreviewInfoArticle={setViewPreviewInfoArticle}
                          />
                        })
                      : <></>
                      }
                </div>
              </div>
            </>
          : <></>
          }

          { ((cart.length > 0 || cartOfCategoryPoints.length > 0) && (!viewOrderSelectArticle)) 
            ? <CartPreview setViewMenu={setViewMenu} setViewCart={setViewCart} />
            : <></>
          }

          {/* </div> */}

          <ToastContainer />

        </div>
        {/* </div> */}

      </main>
    );
  }else {
    return(
      <main className='d-flex justify-content-center align-items-center vh-100'>
        <div className="spinner-border text-success fs-2" role="status" style={{height:50, width:50}}>
          <span className="visually-hidden">Loading...</span>
        </div> 
      </main>
    );
  }
}

export default MenuArticles

