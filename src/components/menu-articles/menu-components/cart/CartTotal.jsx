import React, { useContext, useEffect, useState } from 'react'

// Context
import { AppContext } from '../../../../context/AppContext';

import FinCart from '../../../../images/cart/finCart.jpg'

const CartTotal = ({isDelivery,precioDelivey, lugarDelivery, setPrecioTotal, total, setTotal, puntos, setPuntos}) => {

  const { cart, setCart, cartOfCategoryPoints } = useContext(AppContext);

  // const [total, setTotal] = useState(0);

  // const [puntos, setPuntos] = useState(0);

  useEffect( () => {
    let total = 0;
    cart.map( (article) => {
      total += Number(article.precioVariosArticles);
    });
    if(isDelivery == 'quiero delivery') total += Number(precioDelivey);
    setPrecioTotal(total);
    setTotal(total);
    let puntos = 0;
    cartOfCategoryPoints.map((article)=>{
      puntos += article.PuntosVariosArticles;
    });
    setPuntos(puntos);
    // setCart(state => ({...state, total: total}));
  }, [cart, lugarDelivery, isDelivery, cartOfCategoryPoints] );

  return (
    <div className='my-5'>

      <img className='w-100' src={FinCart} alt="" />

      <div className='px-4'>

        <CartTotalItem
          keyItem='Subtotal'
          value={`RD$ ${total}`}
        />

        { puntos > 0
          ? <CartTotalItem
              keyItem='Total de puntos'
              value={`${puntos} Puntos`}
            />
          : <CartTotalItem
              keyItem='Tarifa de servicio'
              value='RD$ 00.00'
            />
        }
    
        <CartTotalItem
          keyItem='Total'
          value={`RD$ ${total}`}
        />

      </div>

    </div>
  );
}

export default CartTotal;

const CartTotalItem = ({keyItem, value}) => {
  return (
    <div className='d-flex justify-content-between my-3'>
      <p className='m-0 fs-5 fw-bold'>{keyItem}</p>
      <p className='m-0 fs-5'>{value}</p>
    </div>
  );
}

