import React, { useContext, useEffect, useState } from 'react';

// React-Icons
import { BsCloudUploadFill, BsPlusCircle } from 'react-icons/bs';

// uuid
import { v4 as uuidv4 } from 'uuid';

// Firebase
import { createArticleOfPoints, deleteArticle, deleteArticleOfPoints, updateArticleOfPoints } from '../../../../firebase/firebaseFirestore';
import { deleteImage, uploadImage, uploadImageArticle } from '../../../../firebase/firebaseStorage';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import Header from '../ajustes-puntos-componentes/Header';

// Context
import { AppContext } from '../../../../context/AppContext';
import { getUrlImage } from '../../../../firebase/firebaseStorage';
import { MdDeleteForever } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

// Notificaciones Swal
import Swal from 'sweetalert2';
import { GrSubtractCircle } from 'react-icons/gr';

const CreateOrEditArticlePuntos = () => {
  
  const navigate = useNavigate();

  const { isAdmin, categorySelected, articleSelected, setArticleSelected } = useContext(AppContext);

  useEffect( () => {

    if(isAdmin != 'admin') navigate('/admin-options/ajustes-puntos/view-articles');

  }, [] );

  useEffect( () => {
    if(articleSelected != null){
      console.log(articleSelected);
      setTitulo(articleSelected.titulo);
      setSubtitulo(articleSelected.subtitulo);
      setPuntos(articleSelected.puntos);
      setPosition(articleSelected.position);
      
      const f = async () => {
        const imgLink = await getUrlImage(articleSelected.imgpath);
        if(imgLink != false) setImgLink(imgLink);
      }
      f();
    }
  }, [] );

  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [precio, setPrecio] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [img, setImg] = useState(null);

  const [imgLink, setImgLink] = useState(null);

  const handleChangeTitulo = (e) => setTitulo(e.target.value);
  const handleChangeSubtitulo = (e) => setSubtitulo(e.target.value);
  const handleChangePuntos = (e) => setPuntos(e.target.value);

  const handleClickImg = () => document.querySelector('#select-img').click();
  const handleChangeSelectImg = (e) => setImg(e.target.files[0]);

  const [position, setPosition] = useState(1);
  const handleClickSubtractPosition = () => {
    if(position == 1) return;
    setPosition(position - 1);
  }
  const handleClickAddPosition = () => setPosition(position + 1);

  const [showBottonToBack, setShowBottonToBack] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleClickCrearArticulo = async () => {

    if(titulo.length < 3) Swal.fire({
      title: 'Advertencia',
      text:'El titulo debe de tener por lo menos 3 caracteres', 
    });
    else if(subtitulo.length < 3) Swal.fire({
      title: 'Advertencia',
      text:'El subtitulo debe de tener por lo menos 3 caracteres', 
    });  
    else if(img == null) Swal.fire({
      title: 'Advertencia',
      text:'Debe de ingresar una imagen para el articulo', 
    });   
    else {
      const id = uuidv4();
      const info = {
        titulo: titulo,
        subtitulo: subtitulo,
        categoria: categorySelected.id,
        img: `imagenes/${id}`,
        disponible: true,
        complex: false,
        puntos: puntos,
        position: position,
      }

      const createArticlePromise = new Promise( async (resolve, reject) => {
        
        console.log(info)
        const res = await createArticleOfPoints(id, info);      
        const resImg = await uploadImageArticle(id, img);
        if(res && resImg) {
          resolve();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/admin-options/ajustes-puntos/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }else {
          reject();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/admin-options/ajustes-puntos/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }
        
        console.log(res);

      });

      toast.promise( createArticlePromise, {
        pending: 'Promise is pending',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      });

    }
    // else if(titulo.length < 2) {
    //   alert('El titulo debe de tener por lo menos 3 caracteres');
    // }else if(img == null){
    //   alert('Debe de ingresar una imagen para el articulo');
    // }

  }

  const handleClickAptualizarArticulo = async () => {

    if(titulo.length < 3) Swal.fire({
      title: 'Advertencia',
      text:'El titulo debe de tener por lo menos 3 caracteres', 
    });
    else if(subtitulo.length < 3) Swal.fire({
      title: 'Advertencia',
      text:'El subtitulo debe de tener por lo menos 3 caracteres', 
    });
    else {
      const info = {
        id: articleSelected.id,
        titulo: titulo,
        subtitulo: subtitulo,        
        disponible: true,
        puntos: puntos,
        position: position,
      }
      console.log(info)
      const res = await updateArticleOfPoints(info);
      if(img != null){
        const resImg = await uploadImageArticle(info.id, img);
        if(res == true && resImg == true) navigate('/admin-options/ajustes-puntos/view-articles');
      }
      if(res == true) navigate('/admin-options/ajustes-puntos/view-articles');
      console.log(res);

    }
    
    // else if(titulo.length < 2) {
    //   alert('El titulo debe de tener por lo menos 3 caracteres');
    // }else if(img == null){
    //   alert('Debe de ingresar una imagen para el articulo');
    // }
  }

  const handleClickDeleteArticle = async () => {

    const res = await Swal.fire({
      title: 'Estas seguro?',
      text: "Quieres eliminar este articulo, si lo eliminas no podras recuperarlo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    });
    console.log(res.isConfirmed);
    if(res.isConfirmed){

      const deleteArticlePromise = new Promise( async (resolve, reject) => {
      
        const resArticle = await deleteArticleOfPoints(articleSelected.id);
        const resImg = await deleteImage(articleSelected.id);
        if(resArticle && resImg){
          resolve();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/admin-options/ajustes-puntos/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }else{
          reject();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/admin-options/ajustes-puntos/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }
  
      });

      toast.promise( deleteArticlePromise, {
        pending: 'Borrando Articulo',
        success: 'Articulo borrado',
        error: 'Error al borrar articulo'
      });

    }
  }

  const handleClickAtras = () => {
    setArticleSelected(null);
    clearTimeout(timeoutId);
    navigate('/admin-options/ajustes-puntos/view-articles');
  };

  if(articleSelected == null){
    return (
      <main className='border-0 border-bottom border-top mx-3 col-11 col-sm-8 col-md-6 col-lg-6 mx-auto' style={{}} >
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} />
  
        <section>
  
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height:'80vh'}}>

            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Titulo:</p>
              <input className='form-control rounded border-secondary' type="text" style={{height:35}} value={titulo} onChange={handleChangeTitulo}/>
            </div>
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Subtitulo:</p>
              <textarea className='form-control border-secondary' name="" id="" style={{minHeight:35, maxHeight:200}} value={subtitulo} onChange={handleChangeSubtitulo}></textarea>
            </div>
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Puntos:</p>
              <input className='form-control rounded border-secondary' type="number" style={{height:35}} placeholder='Precio del producto' value={puntos} onChange={handleChangePuntos}/>
            </div>
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Imagen:</p>
              <div className='d-flex justify-content-center align-items-center' style={{width:'100%', height:200, border: 'dashed green 2px'}} onClick={handleClickImg}>
                <BsCloudUploadFill className='text-success' style={{fontSize:100}} />
              </div>
              <input id='select-img' accept='image/*' type="file" hidden onChange={handleChangeSelectImg} />
            </div>

            <div className='d-flex align-items-center my-2'>
              <p className='fs-3 fw-bold m-0 w-50'>Posicion:</p>
              <div className='w-50 d-flex gap-3 align-items-center justify-content-center'>
                <GrSubtractCircle className='display-6' onClick={handleClickSubtractPosition} />
                <p className='mb-2 display-4 fw-medium text-center'>{position}</p>
                <BsPlusCircle className='display-6' onClick={handleClickAddPosition} />
              </div>
            </div>
    
            {/* <input className='btn btn-success fs-3 rounded-0' type="button" value='Crear Articulo' onClick={handleClickCrearArticulo}/> */}
            {/* { !showBottonToBack
              ? <input className='btn btn-success fs-3 rounded-0' type="button" value='Crear Articulo' onClick={handleClickCrearArticulo}/>
              : <button className='btn btn-success fs-3 rounded-0' onClick={handleClickAtras}>Salir</button>
            } */}

          </div>

          <div className='bg-white position-fixed vw-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            { !showBottonToBack
              ? <input className='btn btn-success form-control fs-3 rounded-3' type="button" value='Crear Articulo' onClick={handleClickCrearArticulo}/>
              : <button className='btn btn-success form-control fs-3 rounded-3' onClick={handleClickAtras}>Salir</button>
            }
          </div>
  
        </section>
        <ToastContainer />
      </main>
    );
  }else {
    return (
      <main className='border-0 border-bottom- border-top mx-3- col-11- col-sm-8 col-md-6 col-lg-6 mx-auto-' style={{}} >
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} />
  
        <section>
  
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height:'80vh'}}>

            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Titulo:</p>
              <input className='form-control rounded border-secondary' type="text" style={{height:35}} value={titulo} onChange={handleChangeTitulo}/>
            </div>
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Subtitulo:</p>
              <textarea className='form-control border-secondary' name="" id="" style={{minHeight:35, maxHeight:200}} value={subtitulo} onChange={handleChangeSubtitulo}></textarea>
            </div>
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Puntos:</p>
              <input className='form-control rounded border-secondary' type="number" style={{height:35}} placeholder='Precio del producto' value={puntos} onChange={handleChangePuntos}/>
            </div>
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Imagen:</p>
              <div className='d-flex justify-content-center align-items-center p-2 rounded-5' style={{width:'100%', height:200, border: 'dashed green 2px'}} onClick={handleClickImg}>
                { imgLink == null ?
                  <div className="spinner-border text-success fs-2" role="status" style={{height:50, width:50}}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                : <img src={imgLink} className='w-100 h-100 object-fit-cover rounded-5' />  
                }
              </div>
              <input id='select-img' accept='image/*' type="file" hidden onChange={handleChangeSelectImg} />
            </div>

            <div className='d-flex'>
              <p className='fs-3 fw-bold m-0 w-50'>Posicion:</p>
              <div className='w-50 d-flex gap-3 align-items-center justify-content-center'>
                <GrSubtractCircle className='display-6' onClick={handleClickSubtractPosition} />
                <p className='mb-2 display-4 fw-medium text-center'>{position}</p>
                <BsPlusCircle className='display-6' onClick={handleClickAddPosition} />
              </div>
            </div>

            <div className='d-flex justify-content-center'>
              <MdDeleteForever className='text-danger' style={{fontSize: 80}} onClick={handleClickDeleteArticle} />
            </div>

            {/* <MdDeleteForever className='text-danger mt-0' style={{fontSize: 80}} onClick={handleClickDeleteArticle} /> */}
    
            {/* <input className='btn btn-success fs-3 rounded-0' type="button" value='Aptualizar Articulo' onClick={handleClickAptualizarArticulo}/> */}
            {/* { !showBottonToBack
              ? <input className='btn btn-success fs-3 rounded-0' type="button" value='Aptualizar Articulo' onClick={handleClickAptualizarArticulo}/>
              : <button className='btn btn-success fs-3 rounded-0' onClick={handleClickAtras}>Salir</button>
            } */}

          </div>

          <div className='bg-white position-fixed vw-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            { !showBottonToBack
              ? <input className='btn btn-success form-control fs-3 rounded-3' type="button" value='Aptualizar Articulo' onClick={handleClickAptualizarArticulo}/>
              : <button className='btn btn-success form-control fs-3 rounded-3' onClick={handleClickAtras}>Salir</button>
            }
          </div>
  
        </section>
        <ToastContainer />
      </main>
    );
  }
}


export default CreateOrEditArticlePuntos;