import React, { useContext, useEffect, useState } from 'react';

// Context
import { AppContext } from '../../../../context/AppContext';

// React Icon
import { IoIosArrowBack } from 'react-icons/io';

const Header = ({handleClickAtras, filter, allCategories, setCategorySelected}) => {

  const { appInfo, categorySelected } = useContext(AppContext);

  const handleClickBack = () => handleClickAtras();

  const [categoryName, setCategoryName] = useState('Todos los articulos');
  useEffect( () => {
    if(filter){
      if(categorySelected != null){
        allCategories.forEach( category => {
          if(categorySelected == category.id){
            console.log(category.nombre);
            setCategoryName(category.nombre);
            return;
          }
        });
      }
    }
  }, [allCategories] );

  const handleChangeCategorySelected = (e) => setCategorySelected(e.target.value);
  

  return (
    <header className='d-flex justify-content-between align-items-center my-4 mx-2'>
      <IoIosArrowBack className='display-4' onClick={handleClickBack} />
      { filter ? 
        <select value={categorySelected ?? ''} className="form-select w-75" aria-label="Default select example" onChange={handleChangeCategorySelected}>
        
          <option value="Todos los articulos">Todos los articulos</option>  
          <option value='sin-categoria' defaultValue>Sin categoria</option>
          { allCategories.map( (categoria) => (
              <option value={categoria.id} key={categoria.id}>{categoria.nombre}</option> 
            ))
          }
          {/* { categorySelected != 'Todos los articulos' && categorySelected != null 
            ? <option value="Todos los articulos">Todos los articulos</option>
            : <></>
          }
          <option value='sin-categoria' defaultValue>Sin categoria</option>
          <option value={categorySelected} defaultValue>{categoryName}</option>
          {allCategories.map( (categoria) => ( 
            <option value={categoria.id} key={categoria.id}>{categoria.nombre}</option> 
          ))} */}
        </select>
        : appInfo != null 
          ? <p className='m-0 fs-1 fw-bold'>{appInfo.nombre}</p>
          : <p className='m-0 fs-1 fw-bold'>Nombre de la app</p>
      }
    </header>
  );
}

export default Header;
