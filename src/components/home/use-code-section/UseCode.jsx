import React from 'react';

// React Icons
import { MdOutlineNavigateNext } from 'react-icons/md';

// Components
import SearchCodeRef from '../code-ref-section/SearchCodeRef';

const UseCode = ({viewSearchCode, setViewSearchCode}) => {

  const handleClickUseCode = () => setViewSearchCode('abrir');
    
  return (
    <>
      <section className='w-100 my-4 me-4 rounded-4 d-flex justify-content-center align-items-center' style={{height:70, minWidth:'100%', background:'#831700'}} onClick={handleClickUseCode}>
        <p className='text-white m-0 fs-5 fw-bold'>USAR CODIGO PROMOCIONAL</p>
        <MdOutlineNavigateNext className='display-4 text-white'/>    
      </section>
      { (viewSearchCode == 'abrir' || viewSearchCode == 'cerrar')
        ? <SearchCodeRef viewSearchCode={viewSearchCode} setViewSearchCode={setViewSearchCode} />
        : <></>
      }
    </>
  );
}

export default UseCode;