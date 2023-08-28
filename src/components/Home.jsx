// Reatc
import React, { useContext, useEffect, useState } from 'react';

// Context
import { AppContext } from '../context/AppContext';

// React Router
import { useNavigate } from 'react-router-dom';

// Components 
import Header from './home/Header';
import OrderSection from './home/order-section/OrderSection';
import LoNuevoItem from './home/section-lo-nuevo/LoNuevoItem';
import ContactUs from './home/contact-us/ContactUs';
import Menu from './home/menu/Menu';
import AddSection from './home/add-section/AddSection';
import UseCode from './home/use-code-section/UseCode';
import CategoryMenu from './home/categories-menu/CategoryMenu';
import Article from './Article';
import ContactDev from './contact-dev/ContactDev';
import PrevieCodeUser from './home/show-code-user/PrevieCodeUser';
import TemporizadorLastOrder from './home/preview-orders/TemporizadorLastOrder';

// Firebase 
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getAllCategories, getArticlesByCategory, getCategories, getCategoriesFilted, getPedidosByClient, obtenerInfoApp, orderOfToday } from '../firebase/firebaseFirestore';
import { onMessage} from 'firebase/messaging';
import { messaging } from '../firebase/firebaseConfig';
import 'firebase/messaging';

// Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';

import { getImagesFromFolder, getImagesFromFolderForHome } from '../firebase/firebaseStorage';
import HomeViewMenu from './HomeViewMenu';

// Temporizador
// import Temporizador from './home/temporizador/Temporizador';


const Home = () => {
  const navigate = useNavigate();

  const { color1, categories, setCategories, viewMenu, setViewMenu, articleSeleted, setArticleSeleted, email, setEmail, appInfo, setAppInfo, isAdmin, setIsAdmin, goToHome, setGoToHome, appCategories, setAppCategories,  infoPoints, setInfoPoints, clientOrders, setClientOrders, categoriesOfMenu, setCategoriesOfMenu, imagenesCategorias, setImagenesCategorias, imagenesArticulos, setImagenesArticulos, articlesOfHome, setArticlesOfHome, haEstadoEnHome, sethaEstadoEnHome } = useContext(AppContext);

  // const [infoPoints, setInfoPoints] = useState(null);

  // const [clientOrders, setClientOrders] = useState(null);

  useEffect( () => {
    if(appInfo == null){
      // logear usuario automaticamente
      onAuthStateChanged(auth, (user) => {
        if(user == null && goToHome == true) {
          navigate('/welcome'); 
          setGoToHome(false);
          getData(''); 
        }else if(user == null && goToHome == false){
          getData(''); 
        }else {
          getData(user.email);
          console.warn(user);
          setEmail(user.email);

          // requestPermission();
          // user.getIdToken().then(token => {
          //   console.log('Token de autenticación:', token);
          //   // Aquí puedes usar el token para acceder a los servicios de Firebase
          // }).catch(error => {
          //   console.error('Error al generar el token:', error);
          // });
        }
      });
      // obtener info de la app y compruebo si es admin
      const getData = async (emailUser) => {
        const appInfo = await obtenerInfoApp();
        if(appInfo == 'no hay datos de esta app'){
          // navigate('/registro-like-admin');
          alert('No hay datos de la app');
        }else {
          console.log(appInfo);
          setInfoPoints(appInfo.infoPoints);
          const pedidosClient = await getPedidosByClient( emailUser );
          setClientOrders(pedidosClient);
          if(appInfo.nombre == undefined){
            // navigate('/registro-like-admin/details-app');
            alert('No hay datos de la app');
          } else {
            setAppInfo(appInfo);
            if(appInfo.admin == emailUser) setIsAdmin('admin');
            else {
              if(appInfo.semisAdmins != undefined){
                appInfo.semisAdmins.forEach( (semiAdmin) => {
                  if(semiAdmin == emailUser) {
                    setIsAdmin('semi-admin');
                  }else setIsAdmin('customer');
                });
              }
            }
            setAppCategories(await getCategories());
          }
        }
      }
    }
  }, [categories] );

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
        })

        categoryiesOfHome.sort((a, b) => b.position - a.position);
        categoriesOfMenu.sort((a, b) => a.position - b.position);
        setCategories(categoryiesOfHome);
        setCategoriesOfMenu(categoriesOfMenu);
    

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

  
        const imagesOfCategories = await getImagesFromFolder('imagenes-categorias');
        setImagenesCategorias(imagesOfCategories);
        console.warn('Cargaron categorias'); 

        sethaEstadoEnHome(true);
        
        
        
      }
      getInfo();
      
    }
  }, [] );  

  const handleClickMain = () => {
    if(viewMenu) setViewMenu(false);
  }

  const viewOders = async () => {
    if(isAdmin == 'admin' || isAdmin == 'semi-admin'){
      console.log('---------')
      const day = new Date();
      const hoy = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
      const orders = await orderOfToday(hoy);

      if(orders == 'no-hay-pedidos') return;
      orders.forEach( async (order) => {
        if(!order.wasView){
          await Swal.fire({
            icon: 'warning',
            title: 'Nuevo pedido',
            text: 'Hay un nuevo pedido, tienes que revisarlo',
          });
          return;
        }
      })
    }
  }
  

  const [viewSearchCode, setViewSearchCode] = useState('nada');

  const [viewArticleSelected, setViewArticleSelected] = useState('no');

  const [viewCodeUser, setViewCodeUser] = useState('no');

  useEffect( () => {
    onMessage(messaging, message => {
      console.log('tu mensaje:', message);
      toast(message.notification.title);
      viewOders();
    })
  }, [] );

  // function requestPermission() {
  //   console.log('Requesting permission...');
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === 'granted') {
  //       console.log('Notification permission granted.');
  //     }else {
  //       console.log('permiso denegado');
  //     }
  //   });

  //   console.log(imagenesArticulos);

  //   console.log(haEstadoEnHome);
  // }

  // useEffect( () => {
  //   requestPermission();
  // }, [] );

  
  const [seguirViendo, setSeguirViendo] = useState(true);
	useEffect(() => {
		setSeguirViendo(true);
		if(!viewMenu){
			setTimeout(() => {
				setSeguirViendo(false);
			}, 1000);
		}
	}, [viewMenu]);


  const [height, setheight] = useState(window.innerHeight);

  
  const handleScroll2 = () => {
    const scrollTop = window.scrollY;
    console.log(scrollTop);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll2);

    return () => {
      window.removeEventListener('scroll', handleScroll2);
    };
  }, []);

  if(categories != null){
    return(
      <main className={`${viewMenu || viewCodeUser == 'open' || viewSearchCode == 'abrir' ? 'overflow-hidden' : ''}`} style={{maxHeight:articleSeleted != null ? '100vh-' : ''}}>

      <HomeViewMenu Menu={Menu} ContactDev={ContactDev}>
        <main onClick={handleClickMain} >

            
          <div className={`${articleSeleted != null ? '':''}`}>

            {/* Header */}
            <Header className='' />

            {/* <button onClick={requestPermission}>aceptar notificaciones</button> */}
            
            {/* Order Section */}
            <OrderSection />            

            {/* Use Code Section */}
            <UseCode viewSearchCode={viewSearchCode} setViewSearchCode={setViewSearchCode} />

            { (categories != null)
              ? categories.map( (category) => (
                <CategoryMenu key={category.id} category={category} color1={color1} setViewArticleSelected={setViewArticleSelected} />
                ))
                : <></>
              }

            <Article viewArticleSelected={viewArticleSelected} setViewArticleSelected={setViewArticleSelected} />

            {/* Seccion para mostrar codigo de usuario */}
            <PrevieCodeUser viewCodeUser={viewCodeUser} setViewCodeUser={setViewCodeUser} />

            {/* Seccion de contacto del negocio */}
            <ContactUs />
            
            <TemporizadorLastOrder viewMenu={viewMenu} />

            {/* Seccion para agregar articulo */}
            { isAdmin == 'admin' || isAdmin == 'semi-admin'
              ? <AddSection />
              : <></>
            }

          </div>
        </main>
      </HomeViewMenu>





        
        
        <ToastContainer />
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


export default React.memo(Home);
// export default Home;































            // {/* <hr /> */}
            // {/* TODO: borrar luego */}
            // <div style={{height: 0}}></div>
    
            // <section className='w-100 my-5 '>
            //   <div className='d-flex justify-content-between w-100'>
            //     <h3 className='fw-bold'>Lo Nuevo!</h3>
            //     <p className={`p-0 fw-bold ${color1.textColor}`}>TODO</p>
            //   </div>
            //   <div className='d-flex flex-nowrap overflow-x-scroll'>
            //     {/* <img src="" alt="" /> */}
            //     <LoNuevoItem
            //       img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OQb1WegyJ_RwH_lMA6IADJ2jW5dU64YjAIKHdJStaKaSj2JOSpXd7I9mWwJl_MRqZRs&usqp=CAU'
            //       title='hola mundo 1' 
            //       subTitle='Exercitation reprehenderit deserunt Lorem exercitation incididunt cupidatat. Officia id ullamco reprehenderit cillum sint aliqua consequat proident dolor aliquip mollit fugiat anim.' 
            //       id='345678' 
            //     />
    
            //     <LoNuevoItem
            //       img='https://www.mat3am.net/assets/offers/2023/1/22/jpg/94d386f5-44f6-421f-9088-8a8df0e893f3.jpg'
            //       title='hola mundo 2' 
            //       subTitle='Lorem Ullamco aliqua sunt ut ipsum aliqua occaecat incididunt. Ut proident labore velit aliquip elit excepteur occaecat ullamco occaecat. Ullamco amet ea ad commodo laboris ex quis fugiat nostrud proident laboris ad ut et.' 
            //       id='345678' 
            //     />
    
            //     <LoNuevoItem
            //       img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OQb1WegyJ_RwH_lMA6IADJ2jW5dU64YjAIKHdJStaKaSj2JOSpXd7I9mWwJl_MRqZRs&usqp=CAU'
            //       title='hola mundo 1' 
            //       subTitle='Exercitation reprehenderit deserunt Lorem exercitation incididunt cupidatat. Officia id ullamco reprehenderit cillum sint aliqua consequat proident dolor aliquip mollit fugiat anim.' 
            //       id='345678' 
            //     />
    
            //     <LoNuevoItem
            //       img='https://www.mat3am.net/assets/offers/2023/1/22/jpg/94d386f5-44f6-421f-9088-8a8df0e893f3.jpg'
            //       title='hola mundo 2' 
            //       subTitle='Lorem Ullamco aliqua sunt ut ipsum aliqua occaecat incididunt. Ut proident labore velit aliquip elit excepteur occaecat ullamco occaecat. Ullamco amet ea ad commodo laboris ex quis fugiat nostrud proident laboris ad ut et.' 
            //       id='345678' 
            //     />
            //     <LoNuevoItem
            //       img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9OQb1WegyJ_RwH_lMA6IADJ2jW5dU64YjAIKHdJStaKaSj2JOSpXd7I9mWwJl_MRqZRs&usqp=CAU'
            //       title='hola mundo 1' 
            //       subTitle='Exercitation reprehenderit deserunt Lorem exercitation incididunt cupidatat. Officia id ullamco reprehenderit cillum sint aliqua consequat proident dolor aliquip mollit fugiat anim.' 
            //       id='345678' 
            //     />
    
            //     <LoNuevoItem
            //       img='https://www.mat3am.net/assets/offers/2023/1/22/jpg/94d386f5-44f6-421f-9088-8a8df0e893f3.jpg'
            //       title='hola mundo 2' 
            //       subTitle='Lorem Ullamco aliqua sunt ut ipsum aliqua occaecat incididunt. Ut proident labore velit aliquip elit excepteur occaecat ullamco occaecat. Ullamco amet ea ad commodo laboris ex quis fugiat nostrud proident laboris ad ut et.' 
            //       id='345678' 
            //     />
    
            //     <div className='bg-danger me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-danger me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-danger me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-danger me-4 rounded-5' style={{height:150, minWidth:230}}></div>
    
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex justify-content-between w-100'>
            //     <h3 className='fw-bold'>Combos</h3>
            //     <p className={`p-0 fw-bold ${color1.textColor}`}>Todo</p>
            //   </div>
            //   <div className='d-flex flex-nowrap overflow-x-scroll'>
            //     {/* <img src="" alt="" /> */}
            //     <div className='bg-warning me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-warning me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-warning me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-warning me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-warning me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex justify-content-between w-100'>
            //     <h3 className='fw-bold'>Mis Puntos</h3>
            //     <p className={`p-0 fw-bold ${color1.textColor}`}></p>
            //   </div>
            //   <div className='d-flex flex-nowrap overflow-x-scroll'>
            //     {/* <img src="" alt="" /> */}
            //     <div className='bg-primary me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //     <div className='bg-primary me-4 rounded-5' style={{height:150, minWidth:230}}></div>
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex justify-content-between w-100'>
            //     <h3 className='fw-bold'>Mis Ofertas</h3>
            //     <p className={`p-0 fw-bold ${color1.textColor}`}></p>
            //   </div>
            //   <div className='d-flex flex-nowrap'>
            //     {/* <img src="" alt="" /> */}
            //     <div className='bg-success me-4 rounded-5' style={{height:150, minWidth:'100%'}}></div>
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex justify-content-between w-100'>
            //     <h3 className='fw-bold'>Usa tus puntos</h3>
            //     <p className={`p-0 fw-bold ${color1.textColor}`}>todo</p>
            //   </div>
            //   <div className='d-flex flex-nowrap overflow-x-scroll'>
            //     {/* <img src="" alt="" /> */}
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //     <div className='bg-info me-4 rounded-5' style={{height:110, minWidth:155}}></div>
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex flex-nowrap'>
            //     {/* <img src="" alt="" /> */}
            //     <div className={`${color1.bgColor} me-4 rounded-5`} style={{height:110, minWidth:'100%'}}></div>
            //   </div>
            // </section>
    
            // <section className='w-100 my-5'>
            //   <div className='d-flex flex-nowrap'>
            //     {/* <img src="" alt="" /> */}
            //     <div className={`${color1.bgColor} me-4 rounded-5`} style={{height:70, minWidth:'100%'}}></div>
            //   </div>
            // </section>
            // <hr />