import React, { useEffect } from 'react';

// Components
import PedidoItem from './PedidoItem';

const ListPedidos = ({ordenes}) => {

  return (
    <div>
      { ordenes.map((orden)=>(
          <PedidoItem key={orden.id} orden={orden} />
        ))
      }
    </div>
  );
}

export default ListPedidos
