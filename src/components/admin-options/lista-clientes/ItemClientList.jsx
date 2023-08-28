import React, { useState, useEffect} from 'react'

const ItemClientList = ({nombre, email, valueProp, selectValue}) => {

  const [value, setValue] = useState(0);
  useEffect( () => {
    if(selectValue == 'dinero-gastado') setValue(Math.trunc(valueProp.dineroGastado));
    else if(selectValue == 'puntos-ganados') setValue(Math.trunc(valueProp.puntosGanados));
    else if(selectValue == 'puntos-por-invitar') setValue(Math.trunc(valueProp.pointsForInviteFriend));
    else if(selectValue == 'puntos-gastados') setValue(Math.trunc(valueProp.puntosGastados));
    else if(selectValue == 'puntos-restantes') setValue(Math.trunc(valueProp.puntosRestantes));
  }, [selectValue] );

  return (
    <div className='d-flex justify-content-between align-items-center border-bottom py-3'>
      <div>
        <p className='m-0 fs-3 fw-medium'>{nombre}</p>
        <p className='m-0 fs-6 fw-medium'>{email}</p>
      </div>
      <p className='m-0 fs-3 fw-medium'>{value}</p>
    </div>
  );
}

export default ItemClientList;
