import React, { useEffect, useState } from 'react';

// React Icon
import { MdPlaylistAddCheckCircle } from 'react-icons/md';

// Firebase
import { createCategories } from '../../../firebase/firebaseFirestore';
// import { createCategories } from '../../firebase/firebase';



// React-Router-Dom
import { useNavigate } from 'react-router-dom';

const ArticlesCategories = ({appCategories}) => {
  const navigate = useNavigate();

  const [createCategoria, setCreateCategoria] = useState(false);

  // const handleClickAddCategoria =() => navigate('/create-categories');
  
  // const [categorias, setCategorias] = useState(false);

  // useEffect(()=>{
  //   if(appCategories.length){
  //     setCategorias(appCategories.length);
  //   }
  // }, [] );

  // if(!createCategoria){
    return (
      <section className='border-0 border-bottom border-top'>
        <div className='my-5 mx-3'>
          <div className='row d-flex align-items-center'>
            <p className='m-0 col-6 fs-3 fw-bold'>Categorias:</p>
            <select className='col-6 border-1 rounded-2 fs-3 fw-bold'>
              { appCategories.map((categoria)=>(
                <option key={categoria.id} className='' value={categoria.id}>{categoria.nombre}</option>
              ))
              }
            </select>
          </div>
          {/* <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickAddCategoria}>Crear Nueva Categoria</button> */}
          {/* <button className='btn btn-success form-control fs-2 text-white'>Crear nueva Categoria</button> */}
        </div>
      </section>
    );
  // }else {
  //   return (
  //     <section className='border-0 border-bottom border-top' >
  //       <div className='my-5 mx-3'>
  //           <div className='row mx-auto'>
  //             <input type="text" className='col-9 border-1 fs-3' placeholder='Nombre de la nueva Categoria' onChange={handleChangeNombre} />
  //             <MdPlaylistAddCheckCircle className='col-3 display-1 text-success' onClick={handleClickAddArticle} />
  //           </div>
  //           <button className='btn form-control btn-success mt-5 p-2 fs-3' onClick={handleClickAddCategoria}>Cancelar</button>
  //       </div>
  //     </section>
  //   );
  // }
}

export default ArticlesCategories;
