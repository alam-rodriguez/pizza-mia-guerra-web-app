import React, { useContext, useEffect, useState } from 'react';

// React-Icons
import { BsPlusCircle } from 'react-icons/bs';
import { GrSubtractCircle } from 'react-icons/gr'
import { MdDeleteForever } from 'react-icons/md';

// Firebase
import { deleteArticle, getCategories, updateArticle } from '../../../firebase/firebaseFirestore';
import { deleteImage, deleteImageArticle, getUrlImage, uploadImage, uploadImageArticle } from '../../../firebase/firebaseStorage';

// React-Router-Dom
import { useNavigate } from 'react-router-dom';

// Header
import Header from './components/Header';

// Context
import { AppContext } from '../../../context/AppContext';
import { ToastContainer, toast } from 'react-toastify';

// Swal-Alert
import Swal from 'sweetalert2';

const EditArticle = () => {
  const navigate = useNavigate();

  const { articleSelected, setArticleSelected } = useContext(AppContext);

  const [imgPath, setImgPath] = useState(null);

  // Para indicar si sera mitad
  const [isMiddle, setIsMiddle] = useState(false);
  const handleChangeIsMiddle = (e) => {
    console.log(e.target.checked);
    setIsMiddle(e.target.checked);
  }

  useEffect( () => {
    // Si ningun articulo esta seleccionado voy atras
    if(articleSelected == null){
      navigate('/view-articles');
      return;
    }
    
    const f = async () => {
      // Obtener categorias
      const res = await getCategories();
      res.sort( (a,b) => a.position - b.position);
      setCategories(res);
      res.map( (category) => {
        if(category.id == articleSelected.categoria){
          setCategoryArticle(category);
          return;
        }
      });
      // Obtener imagen de articulo
      const img = await getUrlImage(articleSelected.imgpath);
      setImgPath(img);
    }
    f();
    
    setInfoArticle();
  }, [] );

  // Renderizar info de articulo
  const setInfoArticle = () => {
    console.log(articleSelected);
    
    setTitulo(articleSelected.titulo);
    setSubtitulo(articleSelected.subtitulo);
    setPrecio(Number(articleSelected.precios));
    // setPrecio(articleSelected);
    // console.log(articleSelected.isMiddle);
    setIsMiddle(articleSelected.isMiddle);
    setComplejo(articleSelected.complex);

    // console.log(articleSelected.precios.length);
    if( articleSelected.complex ){
      const array = [];
      articleSelected.precios.map( () => {
        array.push(array.length);
        // handleClickAddVariante();
      });
      SetVariantes(array);
    }

    // console.log(articleSelected.precios);
    // setPreciosArticle();
    // SetVariantes
  }

  // Para crear lista de inputs de ariantes
  const [variantes, SetVariantes] = useState([0]);
  // const [variantePrecio, setVariantePrecio] = useState([0]);

  const [adicionalesYPrecios, setAdicionalesYPrecios] = useState([0]);

  useEffect( () => {
    if(articleSelected != null){
      if( articleSelected.complex ){
        let array = [];
        console.log(articleSelected.precios[0]);
        Object.entries(articleSelected.precios[0].adicionales).map(()=>{
          array.push(0);
        })
        setAdicionalesYPrecios(array);
  
        articleSelected?.precios.map((item, index1)=>{
          const size = document.querySelector(`.variante-nombre-${index1}`);
          const sizePrice = document.querySelector(`.variante-precio-${index1}`);
          if(size == null || sizePrice == null) return;
          console.log(size);
          size.value = item.sizeArticle;
          sizePrice.value = item.sizeArticlePrice;
  
          let index2 = 0
          for(let[key, value] of Object.entries(item.adicionales)){
            console.log(key, value);
            console.log(index1, index2);
            const nombreAdicional = document.querySelector(`#variante-nombre-${index1} .adicional-nombre-${index2}`);
            const precioAdicional = document.querySelector(`#variante-nombre-${index1} .adicional-precio-${index2}`);
            const adicionalIsMiddle = document.querySelector(`#variante-nombre-${index1} .adicional-isMiddle-${index2}`);
            if(nombreAdicional == null || precioAdicional == null || adicionalIsMiddle == null) return;
            nombreAdicional.value = key;
            precioAdicional.value = value.precio; 
            adicionalIsMiddle.checked = value.isMiddle;
            index2++;
          }
        });
        
      }
    } 
  }, [variantes] );

  const [categoryArticle, setCategoryArticle] = useState(null);
  
  const [categories, setCategories] = useState(null);

  // Para poner si sera un articulo complejo o no
  const [complejo, setComplejo] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [articuloCategoria, setArticuloCategoria] = useState(articleSelected != null ? articleSelected.categoria : '');
  const [precio, setPrecio] = useState(0);
  const [img, setImg] = useState(articleSelected != null ? articleSelected.imgpath : '');
  const [infoArticleComplex, setInfoArticleComplex] = useState([]);

  const handleChangeTitulo = (e) => setTitulo(e.target.value);
  const handleChangeSubtitulo = (e) => setSubtitulo(e.target.value);
  const handleChangeCategoria = (e) => setArticuloCategoria(e.target.value);
  const handleChangePrecio = (e) => setPrecio(e.target.value);

  const handleClickImg = () => document.querySelector('#select-img').click();  
  const handleChangeSelectImg = (e) => setImg(e.target.files[0]);

  const [position, setPosition] = useState(articleSelected.position != undefined ? articleSelected.position : 1);
  const handleClickSubtractPosition = () => {
    if(position == 1) return;
    setPosition(position - 1);
  }
  const handleClickAddPosition = () => setPosition(position + 1);

  const [showBottonToBack, setShowBottonToBack] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Proceso de actualizar articulo
  const handleClickActualizarArticulo = async () => {

    if(titulo.length < 3){
      Swal.fire({
        title: 'Advertencia',
        text:'El nombre del articulo debe de tener por lo menos 3 caracteres', 
      });
      return;
    }
    if(subtitulo.length < 3){
      Swal.fire({
        title: 'Advertencia',
        text:'La descripcion del articulo debe de tener por lo menos 3 caracteres', 
      });
      return;
    }

    let infoArticleComplex = [];

    try {
      variantes.map( (variante) => {
        // console.log(variante);
        const size = document.querySelector(`.variante-nombre-${variante}`);
        const sizePrice = document.querySelector(`.variante-precio-${variante}`);
  
        console.log(size);
        console.log(sizePrice);
  
        if(size != null && sizePrice != null){
          // <input className={`col-12 variante-nombre variante-nombre-${i}`} type="text" placeholder='Variante...' />
          const nombresAdicionales = document.querySelectorAll(`#variante-nombre-${variante} .adicional-nombre`);
          const preciosAdicionales = document.querySelectorAll(`#variante-nombre-${variante} .adicional-precio`);
          const canBeMiddle = document.querySelectorAll(`#variante-nombre-${variante} .adicional-isMiddle`); 
          const objAdicionalesAndPrecio = {};
          // console.log(nombresAdicionales);
          nombresAdicionales.forEach((nombreAdicional, i)=>{
            
            if (nombreAdicional.value.length == 0) {
              throw new Error('Todos los campos deben de estar llenos, sino eliminalos');
            }
            objAdicionalesAndPrecio[nombreAdicional.value] = 0;
            
          });
          console.log(objAdicionalesAndPrecio);
          // console.log(objAdicionalesAndPrecio);
          let arrayOfNombresAdicionales = Object.entries(objAdicionalesAndPrecio);
          preciosAdicionales.forEach((precioAdicional, i)=>{
            // console.log(arrayOfNombresAdicionales);
            // console.log(precioAdicional);
            if(precioAdicional.value.length == 0){
              throw new Error('Todos los campos deben de estar llenos, sino eliminalos');
            }
              arrayOfNombresAdicionales[i][1] = {
                precio: precioAdicional.value,
                isMiddle: canBeMiddle[i].checked,
            }
  
          });
          const objAdicionalesAndPrecioFinal = Object.fromEntries(arrayOfNombresAdicionales);
  
          const obj = {
            sizeArticle: size.value,
            sizeArticlePrice: sizePrice.value,
            adicionales: objAdicionalesAndPrecioFinal,
          }
  
          console.log(obj);
  
          infoArticleComplex.push(obj);
        }
      });
    } catch (e) {
      alert(e.message);
    }

    // console.log(infoArticleComplex);

    if( titulo.length > 3 && subtitulo.length > 3 && img != null){
      // let isArticleComplex = false;
      // if(infoArticleComplex.length >= 0)isArticleComplex = true;
      // const id = uuidv4();
      const articleUpdated = {
        titulo: titulo,
        subtitulo: subtitulo,
        categoria: articuloCategoria,
        // img: `imageneys/${id}`,
        disponible: true,
        // complex: complejo,
        isMiddle: isMiddle,
        precios: articleSelected.complex ? infoArticleComplex : precio,
        position: position,
      }

      const updateArticlePromise = new Promise ( async (resolve, reject) => {
        
        const res = await updateArticle(articleSelected.id, articleUpdated);
        let resImg = true;
        if(img != articleSelected.imgpath){
          resImg = await uploadImageArticle(articleSelected.id, img);
        }
        if(res && resImg) {
          resolve();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        } else {
          reject();
          setShowBottonToBack(true);
          const timeout = setTimeout(() => {
            navigate('/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }
        
      });

      toast.promise( updateArticlePromise, {
        pending: 'Promise is pending',
        success: 'Promise resolved 👌',
        error: 'Promise rejected 🤯'
      });


    } else {
      console.log('no')
    }

  }

  const handleChangeChecked = (e) => {
    // console.log(e.target.checked);
    setComplejo(e.target.checked);
  }

  // Agregar nueva variante
  const handleClickAddVariante = () => SetVariantes(state => ([...state, state.length]));
  const handleClickRemoveVariante = () => {
    const nuevoArray = variantes.slice(0, variantes.length - 1);
    SetVariantes(nuevoArray);
  };

  // Agregar adicional en variante
  const handleClickAddPriceAdicional = () => setAdicionalesYPrecios(state => ([...state, 0]));
  const handleClickRemovePriceAdicional  = () => {
    const nuevoArray = adicionalesYPrecios.slice(0, adicionalesYPrecios.length - 1);
    setAdicionalesYPrecios(nuevoArray);
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
    if(res.isConfirmed){
      
      const deleteArticlePromise = new Promise( async (resolve, reject) => {
  
        const resArticle = await deleteArticle(articleSelected.id);
        const resImg = await deleteImageArticle(articleSelected.id);
        if(resArticle && resImg){
          resolve();
          setShowBottonToBack(true);
          const timeout = setTimeout( () => {
            navigate('/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }else{
          reject();
          setShowBottonToBack(true);
          const timeout = setTimeout( () => {
            navigate('/view-articles');
          }, 5000);
          setTimeoutId(timeout);
        }
      
      });
  
      toast.promise( deleteArticlePromise, {
        pending: 'Borrando Articulo',
        success: 'Articulo Borrado',
        error: 'Hubo un error al borrar articulo'
      });
    }

  }

  const handleClickAtras = () => {
    setArticleSelected(null);
    clearTimeout(timeoutId);
    navigate('/view-articles');
  };

  if( articleSelected != null ){
    return (
      <main className='border-0 border-bottom border-top mx-3 col-12 col-sm-8 col-md-6 col-lg-6 mx-auto' style={{}} >
        {/* Header */}
        <Header handleClickAtras={handleClickAtras} path='/view-articles' />
  
        <section className=''>
  
          <div className='d-flex flex-column gap-4 overflow-scroll px-3' style={{height:'80vh'}}>

            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Titulo:</p>
              <input className='form-control rounded border-secondary' placeholder='Nombre o titulo del articulo...' type="text" style={{height:35}} value={titulo} onChange={handleChangeTitulo}/>
            </div>
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Subtitulo:</p>
              <textarea className='form-control border-secondary' placeholder='Subtitulo o descripcion del articulo...' name="" id="" style={{minHeight:35, maxHeight:200}} value={subtitulo} onChange={handleChangeSubtitulo}></textarea>
            </div>
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Categoria:</p>
              <select className='form-control border-secondary' style={{height:35}} onChange={handleChangeCategoria}>
                <option value={categoryArticle?.id}>{categoryArticle?.nombre}</option>
                
                { categories != null 
                  ? categories.map((category)=>(
                    <option key={category.id} value={category.id}>{category.nombre}</option>
                  ))
                  : <option value=""></option>
                }
              </select>
            </div>
    
            { !complejo ? 
              <div>
                <p className='fs-3 fw-bold m-0 mb-2'>Precio:</p>
                <input className='form-control rounded border-secondary' type="number" style={{height:35}} placeholder='Precio del producto' value={precio} onChange={handleChangePrecio}/>
              </div>
              : <></>
            }
    
            <div>
              <p className='fs-3 fw-bold m-0 mb-2'>Imagen:</p>
              <div className='d-flex justify-content-center align-items-center p-2 rounded-5' style={{width:'100%', height:200, border: 'dashed green 2px'}} onClick={handleClickImg}>
                { imgPath == null ?
                  <div className="spinner-border text-success" style={{height:70, width:70}} role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  : <img src={imgPath} className='w-100 h-100 rounded-5 object-fit-cover' />
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
    
            { complejo ? 
              variantes.map((precio, i)=>(
                <div key={i} className="accordion" id='accordionExample'>
                  <div className="accordion-item">
                    <h2  className="accordion-header">
                      <button  className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${i}`} aria-expanded="true" aria-controls="collapseOne">
                        Accordion Item #1
                      </button>
                    </h2>
                    <div id={`collapse${i}`}  className="accordion-collapse collapse show my-2" data-bs-parent='#accordionExample'>
                      <div  className="accordion-body">
                        <p className='mb-3'>Tamaño del articulo:</p>
                        <div className='row justify-content-between mx-2'>
                          <input className={`col-8 variante-nombre variante-nombre-${i}`} type="text" placeholder='Tamaño...' />
                          <input className={`col-3 variante-nombre variante-precio-${i}`} type="number" placeholder='Precio...' />
                        </div>
                            
                        {/* Ingrediente adicional y precio segun el size */}
                        <p className='mt-5 mb-3'>Ingrediente adicional y precio:</p>
                        <div id={`variante-nombre-${i}`}>
                          {adicionalesYPrecios.map((variantePrecio, i)=>(
                            <div key={i} className='row justify-content-between m-2'>
                              <input className={`col-6 adicional-nombre adicional-nombre-${i}`}  type="text" placeholder='Nombre...' />
                              <input className={`col-3 adicional-precio adicional-precio-${i}`} type="text" placeholder='Precio...' />
                              <div className="form-check form-switch col-1 d-flex justify-content-center align-items-center">
                                <input className={`form-check-input adicional-isMiddle adicional-isMiddle-${i}`} type="checkbox" role="switch" id="flexSwitchCheckChecked"  />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className=' d-flex justify-content-end gap-3 mt-4'>
                          <GrSubtractCircle className='display-6' onClick={handleClickRemovePriceAdicional} />
                          <BsPlusCircle className='display-6' onClick={handleClickAddPriceAdicional}/>
                        </div>
                        {/* <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow. */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : <></>
            }
    
            { complejo ?
                <div className='d-flex justify-content-end gap-3' >
                  <GrSubtractCircle className='display-3' onClick={handleClickRemoveVariante} />
                  <BsPlusCircle className='display-3' onClick={handleClickAddVariante}/>
                </div> 
              : <></>
            }

            {/* Indicar si deseas que este articulo se use para una mitad de otro */}
            { complejo
              ? <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="handleChangeChecked1" checked={isMiddle} onChange={handleChangeIsMiddle} />
                  <label className="form-check-label" htmlFor="handleChangeChecked1">Deseas que este articulo se use para una mitad de otro articulo ?</label>
                </div>
            : <></>
            }
    
            {/* Cambiar complejidad */}
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" role="switch" id="handleChangeChecked" checked={complejo} readOnly />
              <label className="form-check-label" htmlFor="handleChangeChecked">No se puede cambiar la complejidad de un articulo.</label>
            </div>
    
            <div className='d-flex justify-content-center'>
              <MdDeleteForever className='text-danger' style={{fontSize: 80}} onClick={handleClickDeleteArticle} />
            </div>

          </div>
  
          
          {/* { !showBottonToBack
            ? <input className='btn btn-success fs-3 rounded-0' type="button" value='Actualizar Articulo' onClick={handleClickActualizarArticulo}/>
            : <button className='btn btn-success fs-3 rounded-0' onClick={handleClickAtras}>Salir</button>
          } */}

          <div className='bg-white position-fixed vw-100 bottom-0 start-0 rounded-0 p-4' style={{height: '10vh'}}>
            { !showBottonToBack
              ? <input className='btn btn-success form-control fs-3 rounded-3' type="button" value='Actualizar Articulo' onClick={handleClickActualizarArticulo}/>
              : <button className='btn btn-success form-control fs-3 rounded-3' onClick={handleClickAtras}>Salir</button>
            }
          </div>
  
        </section>
        <ToastContainer />
      </main>
    )
  }else {
    return <></>;
  }
}


export default EditArticle;