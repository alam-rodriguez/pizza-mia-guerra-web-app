import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../../context/AppContext';

const Temporizador = ({segundos = 5, minutos = 0, horas = 0, className}) => {

  const {color1} = useContext(AppContext);

  const [segundosTemp, setSegundosTemp] = useState(segundos == 0 && minutos == 0 && horas == 0 ? 59 : segundos < 59 ? segundos : 59);
  const [minutosTemp, setMinutosTemp] = useState(minutos < 59 ? minutos : 59);
  const [horasTemp, setHorasTemp] = useState(horas < 23 ? horas : 23);
  
  useEffect( () => {

    let segundoss = segundosTemp;
    let minutoss = minutosTemp;
    let horass = horasTemp;

    const interval = setInterval( () => {

      console.log(horasTemp.length)
      
      if(segundoss > 0) {
        segundoss -= 1;
        setSegundosTemp(prevSeconds => prevSeconds - 1);
      }else {
        if(minutoss > 0){
          setSegundosTemp(59);
          segundoss = 59;
          setMinutosTemp(prevMinutos => prevMinutos - 1);
          minutoss -= 1;
        }else{
          if(horass > 0){
            setMinutosTemp(59);
            minutoss = 59;
            setHorasTemp(prevHoras => prevHoras - 1);
            horass -= 1;
          }else {
            return;
          }
        }
      }
        
      if(horass == 0 && minutoss == 0 && segundoss == 0) clearInterval(interval);
        
    }, 1000);

    return () => clearInterval(interval);

  }, [] );

  return (
    <p className={`${className}`}>
      {horasTemp.toString().length == 1 ? `0${horasTemp}` : horasTemp}
      :
      {minutosTemp.toString().length == 1 ? `0${minutosTemp}` : minutosTemp}
      :
      {segundosTemp.toString().length == 1 ? `0${segundosTemp}` : segundosTemp}
    </p>
  );
}

export default Temporizador;
