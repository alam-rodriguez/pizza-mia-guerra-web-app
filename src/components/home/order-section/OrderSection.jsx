import React, { useContext } from 'react';

// imagen
import pizzaOrdenar from "../../../images/pizzaOrdenar.png";

// React Icons
import { TfiReload } from 'react-icons/tfi';

// Componentes
import OrderButton from './OrderButton';

// Context
import { AppContext } from '../../../context/AppContext';

const OrderSection = () => {
  const { color1 } = useContext(AppContext);
  return (
    <section className='d-flex gap-3 mb-4' style={{}}>
      <OrderButton 
        text='ORDENAR AHORA'
        textColor='text-white'
        bgColor={color1.bgColor}
        type='imagen'
        link='/menu-articles'
        seletionLetf={pizzaOrdenar}
      />
      <OrderButton 
        text='REPETIR ORDEN'
        textColor='text-success'
        bgColor='bg-secondary-subtle'
        type='icono'
        link='#'
        seletionLetf={<TfiReload className={`${color1.textColor} display-2`} />}
      />
    </section>
  )
}

export default OrderSection
