// Reatc
import React, { useContext } from 'react';

// context
import { AppContext } from '../../context/AppContext';

const CheckBoxView = ({id, firstEntryView}) => {

  const { color1 } = useContext(AppContext);

  return (
    <div className={`${id == firstEntryView ? color1.bgColor : 'bg-secondary-subtle'} rounded-circle`} style={{height:10, width:10}}></div>
  )
}

export default CheckBoxView
