// React
import React, { useContext, useEffect, useState } from 'react'

// useSize
import UseScreenSize from '../../hooks/useScreenSize';

// Context
import { AppContext } from '../../context/AppContext';

const CaruselItem = ({img, imgWidth, imgHeigth, text, content, btnText = 'Next', handleClickNextEntry}) => {

  const { heigth, width } = UseScreenSize();

  const { color1 } = useContext(AppContext);

  // console.log(heigth, width);

  const [alto, setAlto] = useState(heigth - 30);
  const [widthImg, setWidthImg] = useState(width * imgWidth);

  // useEffect( () => {

  //   setAlto(heigth - 30);
  //   setWidthImg(width * imgWidth);
  // }, [] );

  return (
    <section className='d-flex flex-column justify-content-between align-items-center px-2 py-3 pt-5 ' style={{height: heigth - 60, width:width}}>
        <img className='object-fit-contain mt-5' style={{width:widthImg, height:imgHeigth}} src={img} alt="" />
        <h2 className='fw-bold fs-3 align-self-start px-4'>{text}</h2>
        <div className='w-100'>
          <div>{content}</div>
          <button className={`form-control fs-2 btn ${color1.btnOutline}`} onClick={handleClickNextEntry}>{btnText}</button>
        </div>
    </section>
  );
}

export default CaruselItem;
