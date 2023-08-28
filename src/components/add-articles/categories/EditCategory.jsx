import React, { useContext, useEffect, useState } from 'react';

// React-Icons
import { BsCloudUploadFill, BsPlusCircle } from 'react-icons/bs';
import { MdDeleteForever } from 'react-icons/md';

// Alerts
import Swal from 'sweetalert2';


// Firebase
import { ACtualizarCategory, deleteCategory } from '../../../firebase/firebaseFirestore';
import { deleteImage, deleteImageCategory, getUrlImage, uploadImage, uploadImageCategory } from '../../../firebase/firebaseStorage';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import Header from './components/Header';

// Context
import { AppContext } from '../../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import { GrSubtractCircle } from 'react-icons/gr';

const EditCategory = () => {
  const navigate = useNavigate();

  const { categorySelected, setCategorySelected} = useContext(AppContext);

  const [imgPath, setImgPath] = useState(null);

  useEffect( () => {
    if(categorySelected == null){
      navigate('/view-categories');
      return;
    }else getImagePath();
  
    // setNombreCategoria(categorySelected.nombre);
    // setImgCategory(categorySelected.imgpath);
    // setViewInHome(categorySelected.viewInHome);
    // setViewInMenu(categorySelected.viewInMenu);
  }, [] );

  // Para obtener path de la imagen
  const getImagePath = async () => {
    const imgpath = await getUrlImage(categorySelected.imgpath);
    setImgPath(imgpath);
  }

  const [nombreCategoria, setNombreCategoria] = useState(categorySelected != null ? categorySelected.nombre : '');
  const [sizeView, setSizeView] = useState(categorySelected != null ? categorySelected.sizeView : '');
  const [imgCategory, setImgCategory] = useState(categorySelected != null ? categorySelected.imgpath : '');
  const [viewInHome, setViewInHome] = useState(categorySelected != null ? categorySelected.viewInHome : '');
  const [viewInMenu, setViewInMenu] = useState(categorySelected != null ? categorySelected.viewInMenu : '');

  const handleChangeNombre = (e) => setNombreCategoria(e.target.value);
  const handleChangeSizeView = (e) => setSizeView(e.target.value);
  const handleChangeCheckedViewInHome = (e) => setViewInHome(e.target.checked);
  const handleChangeCheckedViewInMenu = (e) => setViewInMenu(e.target.checked);

  const handleClickImg = () => document.querySelector('#select-img').click();
  const handleChangeSelectImg = (e) => setImgCategory(e.target.files[0]);

  const [position, setPosition] = useState(categorySelected != null ? categorySelected.position : 1);
  const handleClickSubtractPosition = () => {
    if(position == 1) return;
    setPosition(position - 1);
  }
  const handleClickAddPosition = () => setPosition(position + 1);
  
  const [showBottonToBack, setShowBottonToBack] = useState(false);

  const [timeoutId, setTimeoutId] = useState(null);

  const handleClickDeleteCategory = async () => {
    const res = await Swal.fire({
      title: 'Estas seguro?',
      text: "Quieres eliminar esta categoria, si la eliminas no podras recuperarla.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    });
    if(res.isConfirmed){
      const DeleteCategoryPromise = new Promise( async (resolve, reject) => {

        const res1 = await deleteCategory(categorySelected.id);
        const res2 = await deleteImageCategory(categorySelected.id);
        if(res1 && res2){
          resolve();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/view-categories')
          }, 5000);
          setTimeoutId(timeout);
        }else {
          reject();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/view-categories')
          }, 5000);
          setTimeoutId(timeout);
        }
        
      });

      toast.promise( DeleteCategoryPromise, {
        pending: 'Eliminando Categoria',
        success: 'Categoria Eliminada',
        error: 'Error al eliminar categoria'
      });    

    }
  }


  const handleClickActualizarCategory = async () => {
    if(nombreCategoria.length < 3){
      Swal.fire({
        title: 'Advertencia',
        text:'El nombre de la categoria debe de tener por lo menos 3 caracteres', 
      });
      return;
    }
    
    const newInfo = {
      nombreCategoria: nombreCategoria, 
      sizeView: sizeView,
      viewInHome: viewInHome, 
      viewInMenu:viewInMenu,
      position: position,
    }

    const editCategoryPromise = new Promise( async (resolve, reject) => {
      const res = await ACtualizarCategory(categorySelected.id, newInfo);
      let resImg = true;
      if(imgCategory != categorySelected.imgpath) resImg = await uploadImageCategory(categorySelected.id, imgCategory);  
      if(res && resImg) {
        resolve();
        setShowBottonToBack(true);
        const timeout = setTimeout(() => {
          navigate('/view-categories')
        }, 5000);
        setTimeoutId(timeout);
      }else {
        reject();
        setShowBottonToBack(true);
        const timeout = setTimeout(() => {
          navigate('/view-categories')
        }, 5000);
        setTimeoutId(timeout);
      }
    });

    toast.promise( editCategoryPromise, {
      pending: 'Actualizando Categoria',
      success: 'Categoria Actualizada',
      error: 'Error al actualizar categoria'
    });

  }

  const handleClickAtras = () => {
    setCategorySelected(null);
    navigate('/view-categories');
    clearTimeout(timeoutId);
  };

  if(categorySelected != null){
    return (
      <section className='border-0 border-bottom border-top' >
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} />
        {/* <Header path='/view-categories' whatReset='categorySelect' /> */}
  
        <div className='mt-3 mb-5 mx-3-'>
          <div className='row mx-auto gap-4 overflow-scroll px-3' style={{height:'80vh'}}>

            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Titulo:</p>
              <input className='form-control rounded border-secondary' type="text" style={{height:35}} value={nombreCategoria} onChange={handleChangeNombre}/>
            </div>

            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Tamaño al visualizar:</p>
              <select className='form-control border-secondary' style={{height:35}} onChange={handleChangeSizeView}>
                <option defaultValue={sizeView} value={sizeView}>{sizeView}</option>
                <option value="small">Pequeño</option>
                <option value="normal">Normal</option>
                <option value="big">Gande</option>
              </select>
            </div>

            {/* <input type="text" className='col-12 border-1 fs-3 p-3 border rounded-4' placeholder='Nombre de la nueva Categoria' value={nombreCategoria} onChange={handleChangeNombre} /> */}
            {/* <MdPlaylistAddCheckCircle className='col-3 display-1 text-success' onClick={handleClickAddArticle} /> */}
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Imagen:</p>

              
              <div className='d-flex justify-content-center align-items-center p-2 rounded-5' style={{width:'100%', height:200, border: 'dashed green 2px'}} onClick={handleClickImg}>
                { imgPath == null ?
                    <div className="spinner-border text-success" style={{height:70, width:70}} role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  : <img className='object-fit-cover rounded-5' style={{width:'100%', height:'100%'}} src={imgPath} onClick={handleClickImg} />
                }
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
  
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="handleChangeCheckedViewInHome" checked={viewInHome} onChange={handleChangeCheckedViewInHome} />
              <label className="form-check-label" htmlFor="handleChangeCheckedViewInHome">Deseas que esta categoria se muestre en el inicio de la app ?</label>
            </div>
  
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="handleChangeCheckedViewInMenu" checked={viewInMenu} onChange={handleChangeCheckedViewInMenu} />
              <label className="form-check-label" htmlFor="handleChangeCheckedViewInMenu">Deseas que esta categoria se muestre en el menu de la app ?</label>
            </div>

            <MdDeleteForever className='text-danger' style={{fontSize: 80}} onClick={handleClickDeleteCategory} />
  
          </div>

          {/* { !showBottonToBack 
            ? <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickActualizarCategory}>Actualizar Categoria</button>
            : <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickAtras}>Salir</button>
          } */}

          <div className='bg-white position-fixed w-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            { !showBottonToBack 
              ? <button className='btn form-control btn-success fs-3' onClick={handleClickActualizarCategory}>Actualizar Categoria</button>
              : <button className='btn form-control btn-success fs-3' onClick={handleClickAtras}>Salir</button>
            }
          </div>
          
        </div>
        <ToastContainer />
      </section>
    );
  }else {
    return <></>;
  }
}


export default EditCategory;
