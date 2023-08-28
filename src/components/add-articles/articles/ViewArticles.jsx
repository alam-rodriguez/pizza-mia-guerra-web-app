import React, { useContext, useEffect, useState } from 'react';

// React-Icons
import { MdPlaylistAddCheckCircle } from 'react-icons/md';
import { BsCloudUploadFill } from 'react-icons/bs';

// uuid
import { v4 as uuidv4 } from 'uuid';

// Firebase
import { auth, createArticle, getAllArticles, getCategories, obtenerInfoApp } from '../../../firebase/firebaseFirestore';
import { uploadImage } from '../../../firebase/firebaseStorage';
// import { createArticle, createCategories } from '../../firebase/firebaseFirestore';
// import { uploadImage } from '../../firebase/firebaseStorage';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import CreateArticleHeader from '../sections/CreateArticleHeader';

// Context
import { AppContext } from '../../../context/AppContext';
import Header from './components/Header';
import { onAuthStateChanged } from 'firebase/auth';

const ViewArticles = () => {
  const navigate = useNavigate();

  const { articleSelected, setArticleSelected, categories, setCategories, categorySelected, setCategorySelected, setEmail, setIsAdmin, isAdmin} = useContext(AppContext);

  const [articles, setArticles] = useState(null);
  const [articlesFilted, setArticlesFilted] = useState(null);

  const [allCategories, setAllCategories] = useState(null);
  
  useEffect( () => {
    if(isAdmin == ''){
      // logear usuario automaticamente
      onAuthStateChanged(auth, (user) => {
        if(user == null) {
          navigate('/home'); 
        }else {
          getData(user.email);
          console.log(user.email);
          setEmail(user.email);
        }
      });
      // obtener info de la app y compruebo si es admin
      const getData = async (emailUser) => {
        let status = 'customer';
        const appInfo = await obtenerInfoApp();
        if(appInfo == 'no hay datos de esta app'){
          navigate('/home'); 
          return
        }
        if(appInfo.nombre == undefined){
          alert('No hay datos de la app');
          navigate('/home');
          return; 
        } 
        if(appInfo.admin == emailUser) status = 'admin';
        else {
          if(appInfo.semisAdmins != undefined){
            appInfo.semisAdmins.forEach( (semiAdmin) => {
              if(semiAdmin == emailUser) status = 'semi-admin';
              else status = 'customer';
            });
          }
        }
        setIsAdmin(status);
        if(status != 'admin') navigate('/home');
      }
    }
  }, [] );

  useEffect( () => {
    const f = async () => { 
      const res = await getAllArticles();
      setArticles(res);
    
      const categories = await getCategories();
      categories.sort((a, b) => a.position - b.position);
      setAllCategories(categories);
    }
    f();
  }, [] );
  
  useEffect( () => {  
    if(articles == null || allCategories == null) return;
    
    console.log(categorySelected);
    if(categorySelected == 'Todos los articulos' || categorySelected == null) {
      setArticlesFilted(articles);
      console.log(articles);
      return;
    }

    if(categorySelected == 'sin-categoria'){
      let articlesSinCategory = [];
      console.log(allCategories);
      articles.forEach( article => {
        let articleCategoryId = article.categoria;
        let isSinCategory = true;
        allCategories.map( (category) => {
          if(articleCategoryId == category.id) {
            isSinCategory = false;
            return;
          }
        });
        if(isSinCategory) articlesSinCategory.push(article);
      });
      console.log(articlesSinCategory);
      setArticlesFilted(articlesSinCategory);
      return;
    }

    if(articles != null){
      let articlesOfCategorySelected = [];
      articles.forEach( article => {
        if(article.categoria == categorySelected) articlesOfCategorySelected.push(article);
      });
      articlesOfCategorySelected.sort((a,b) => a.position - b.position)
      setArticlesFilted(articlesOfCategorySelected);
      return;
    }
  }, [categorySelected, articles, allCategories] );
  
  // handles
  const handleClickArticle = (article) => {
    setArticleSelected(article);
    navigate('/edit-article');
  }

  const handleClickCrearCategoria = () => navigate('/create-article');

  const handleClickAtras = () => navigate('/admin-options');

  if(articles != null){
    return (
      <main className='border-0'>
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} filter={true} allCategories={allCategories ?? []} setCategorySelected={setCategorySelected} />
  
        <section className='' style={{height:''}}>
  
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height:'80vh'}}>
            { articlesFilted != null 
              ? articlesFilted.length > 0 
                ? articlesFilted.map((article)=>(
                  <div className='border-bottom py-2' key={article.id} onClick={()=>handleClickArticle(article)}>
                      <p className='m-0 fs-1 fw-medium'>{categorySelected != 'Todos los articulos' && categorySelected != null && categorySelected != 'sin-categoria' ? `${article.position} - ${article.titulo}` : article.titulo}</p>
                    </div>
                  ))
                : <p className='m-0 fs-1 fw-medium text-center'>No hay articulos</p>
              : <></>
            }
          </div>

          {/* <div>
             <button className='btn form-control btn-success fs-3 position-fixed bottom-0 start-50 mb-4 translate-middle rounded-0' onClick={handleClickCrearCategoria}>Crear Categoria</button>
          </div> */}

          
          <div className='bg-white position-fixed w-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            {/* <button className='btn form-control btn-success fs-3 rounded-3' onClick={handleClickCrearCategoria}>Crear Categoria</button> */}
            <button className='btn form-control btn-success fs-3 rounded-3' onClick={handleClickCrearCategoria}>Crear Nuevo Articulo</button>
          </div>
  
        </section>
      </main>
    )
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


export default ViewArticles;

