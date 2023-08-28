import React, { useContext, useEffect, useState } from 'react';

// Context
import { AppContext } from '../../../context/AppContext';

const PreviewInfoArticle = ({setViewPreviewInfoArticle, setViewOrderSelectArticle}) => {
  const {color1, articleSelected, setArticleSelected, precioArticleSelected, setPrecioArticleSelected} = useContext(AppContext);

  useEffect( () => {
    if(articleSelected.precios != undefined){
      if(articleSelected.precios.length == 1) handleClickPrecio(articleSelected.precios[0]);
    }
    console.log(articleSelected.complex);
    if(!articleSelected.complex){
      // console.log(precio);
      // setPrecioArticleSelected(precio);
      setViewPreviewInfoArticle(false);
      setViewOrderSelectArticle(true);
    }
  }, [] );

  const handleClickPrecio = (precio) => {
    console.log(precio);
    setPrecioArticleSelected(precio);
    setViewPreviewInfoArticle(false);
    setViewOrderSelectArticle(true);
  }

  const [close, setClose] = useState(false);
  const handleClickCancelar = () => {
    // if(precioArticleSelected == false) return;
    console.log('aqui');
    setClose(true);
    setTimeout(() => {
      console.log(precioArticleSelected);
      // setArticleSelected(null);
      setViewPreviewInfoArticle(false);
    }, 400);
  }

  if( articleSelected.complex ){
    return (
      <div className={`d-flex justify-content-center align-items-end z-2 animate__animated ${!close ? 'animate__fadeInUp' : 'animate__fadeOutDown'} vw-100 h-100 position-fixed position-sticky- start-0 top-0`} onClick={handleClickCancelar}>
        
        <div className='animate__animated animate__fadeInUp z-3 bg-white overflow-y-scroll border mb-3 rounded-3 shadow p-4 d-flex flex-column justify-content-between' style={{width:'95%', height:'auto'}}>
            <div className=''>
              <h3 className='fw-bold fs-2 mb-0'>{articleSelected.titulo}</h3>
              <div className='my-4'>
                { articleSelected.precios.map( (precio, i) => (
                    <div key={i} className='border-bottom d-flex justify-content-between py-3' onClick={()=>handleClickPrecio(precio)}>
                      <p className='fs-4 m-0'>- {precio.sizeArticle}"</p>
                      <p className='fs-5 m-0 text-secondary'>RD$ {precio.sizeArticlePrice}</p>
                    </div>
                  ))
                }
              </div>
            </div>
            <button className={`btn form-control fs-3 ${color1.textColor}`} onClick={handleClickCancelar}>Cancelar</button>
          </div>
          
      </div>
    );
    // return (
    //   <div className={`z-2 animate__animated ${!close ? 'animate__fadeInUp' : 'animate__fadeOutDown'} vw-100 vh-100 position-fixed position-sticky- start-0 top-0`}>
        
    //     <div className=' animate__animated animate__fadeInUp z-3 bg-white overflow-y-scroll position-fixed bottom-0 start-50 border translate-middle-x mb-3 rounded-3 shadow p-4 d-flex flex-column justify-content-between' style={{width:'95%', height:'52%'}}>
    //         <div className=''>
    //           <h3 className='fw-bold fs-2 mb-0'>{articleSelected.titulo}</h3>
    //           <div className='my-4'>
    //             { articleSelected.precios.map( (precio, i) => (
    //                 <div key={i} className='border-bottom d-flex justify-content-between py-3' onClick={()=>handleClickPrecio(precio)}>
    //                   <p className='fs-4 m-0'>- {precio.sizeArticle}"</p>
    //                   <p className='fs-5 m-0 text-secondary'>RD$ {precio.sizeArticlePrice}</p>
    //                 </div>
    //               ))
    //             }
    //           </div>
    //         </div>
    //         <button className={`btn form-control fs-3 ${color1.textColor}`} onClick={handleClickCancelar}>Cancelar</button>
    //       </div>
          
    //   </div>
    // );
  }else {
    return <></>;
  }
}

export default PreviewInfoArticle
