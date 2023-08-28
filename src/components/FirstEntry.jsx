import React, { useEffect, useState } from 'react';

// Components
import CaruselItem from './FirstEntry/CaruselItem';
import CheckBoxView from './FirstEntry/CheckBoxView';

// Images
import image1 from '../images/welcome1.png';
import image2 from '../images/welcome2.png';
import image3 from '../images/welcome3.png';
import image4 from '../images/welcome4.png';
import image5 from '../images/welcome5.png';

// useScreenSize
import UseScreenSize from '../hooks/useScreenSize';

// React Router
import { useNavigate } from 'react-router-dom';

const FirstEntry = () => {
  const navigate = useNavigate();

	const [firstEntryView, setFirstEntryView] = useState(1);
  const handleClickNextEntry = () => {
    if(firstEntryView < 5) setFirstEntryView(firstEntryView + 1);
    else navigate('/home');
  }

  return (
    <main className='container p-0 m-0'>
			<div className='d-flex'>
        {(firstEntryView == 1) ? 
          <CaruselItem 
            img={image1}
            imgWidth={0.8}
            imgHeigth={280}
            text='DISFRUTA DE PROMCIONES Y ARTICULOS QUE SOLO ESTAN DISPONIBLES EN LA APP' 
            content={
              <p>Vienvenido a Pizza Mia, en esta app podra ordenar todo lo que desee.</p>
            }
            handleClickNextEntry={handleClickNextEntry}
          />
        :(firstEntryView == 2) ?
          <CaruselItem 
            img={image2}
            imgWidth={1}
            imgHeigth={280}
            text='GANA PUNTOS AL HACER COMPRAS Y PODRAS OBTENER TU COMIDA FAVORITA TOTALMENTE GRATIS' 
            content={''}
            handleClickNextEntry={handleClickNextEntry}
          /> 
        :(firstEntryView == 3) ?
          <CaruselItem 
            img={image3}
            imgWidth={0.8}
            imgHeigth={280}
            text='CUANDO ESTES EN LA PIZZERIA, MUESTRANOS TU CODIGO PARA GANAR PUNTOS' 
            content={''}
            handleClickNextEntry={handleClickNextEntry}
          /> 
        :(firstEntryView == 4) ?
          <CaruselItem 
            img={image4}
            imgWidth={0.8}
            imgHeigth={280}
            text='ORDENA TU PEDIDO Y TE LO LLEVAMOS A CASA ' 
            content={''}
            handleClickNextEntry={handleClickNextEntry}
          /> 
        :(firstEntryView == 5) ?
          <CaruselItem 
            img={image5}
            imgWidth={0.8}
            imgHeigth={280}
            text='EVITE LAS FILAS Y LA FILA AL USAR NUESTRA APP' 
            content={
              <p>Le recordamos que esta app es nuestra y las reglas las ponemos nosotros.</p>
            }
            btnText='Go to the app'
            handleClickNextEntry={handleClickNextEntry}
          /> 
        : <></>
        }
			</div>

			<div className='d-flex justify-content-center gap-1 mt-3'>
        <CheckBoxView id={1} firstEntryView={firstEntryView}/>
        <CheckBoxView id={2} firstEntryView={firstEntryView}/>
        <CheckBoxView id={3} firstEntryView={firstEntryView}/>
        <CheckBoxView id={4} firstEntryView={firstEntryView}/>
        <CheckBoxView id={5} firstEntryView={firstEntryView}/>
			</div>
  	</main>
  )
}

export default FirstEntry
