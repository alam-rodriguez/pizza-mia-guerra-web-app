import React from 'react'

const CartInfoClient = ({nombre, setNombre, direccion, setDireccion, telefono, setTelefono, entrega, setEntrega, setLugarDelivery, setComentario}) => {

  const handleChangeNombre = (e) => setNombre(e.target.value);
  const handleChangeDireccion = (e) => setDireccion(e.target.value);
  const handleChangeTelefono = (e) => {
    console.log(e.target.value)
    const lS = e.target.value[e.target.value.length - 1];
    console.log(lS);
    // if(lS == '') return;
    if(e.target.value.length < telefono.length){
      setTelefono(e.target.value );
      return;
    }
    if(lS != 0 && lS != 1 &&  lS != 2 && lS != 3 && lS != 4 && lS != 5 && lS != 6 && lS != 7 && lS != 8 && lS != 9) return;
    console.log(telefono.length, e.target.value.length)
    setTelefono(e.target.value );
  }
  const handleChangeEntrega = (e) => setEntrega(e.target.value);
  const handleChangeLugarDelivey = (e) => {
    const value = e.target.value;
    const obj = {
      lugar: '',
      costo: 0,
    }
    switch(value){
      case 'guerra':
        obj.lugar = 'Guerra';
        obj.costo = 50;
        break;
      case 'reforma':
        obj.lugar = 'La Reforma';
        obj.costo = 200;
        break;
      case 'fao':
        obj.lugar = 'El fao';
        obj.costo = 100;
        break;
      case 'cruce':
        obj.lugar = 'El Cruce';
        obj.costo = 200;
        break;
      case 'berroa':
        obj.lugar = 'La Berroa';
        obj.costo = 200;
        break;
      case 'joya':
        obj.lugar = 'La Joya';
        obj.costo = 200;
        break;
      default: 
        break;
    }
    setLugarDelivery(obj);
  }
  const handleChangeComentario = (e) => setComentario(e.target.value);

  return (
    <div className='border-0 border-bottom- border-black '>

      <p className='fw-bold fs-5 mt-5'>Por favor conplete la informacion y no cierre la app en el proceso! <br /> Precios con impuestos incluidos</p>

      <div className='mb-5'>
        <p className='m-0 fs-5 fw-semibold'>Nombre:</p>
        <input className='ps-0 form-control border-0 rounded-0 border-bottom fs-5' type="text" placeholder='Tu nombre' value={nombre} required minLength={3} onChange={handleChangeNombre} />
      </div>

      <div className='mb-5'>
        <p className='m-0 fs-5 fw-semibold'>Dirrecion:</p>
        <input className='ps-0 form-control border-0 rounded-0 border-bottom fs-5' type="text" placeholder='Tu Direccion' value={direccion} required minLength={3} onChange={handleChangeDireccion} />
      </div>

      <div className='mb-5'>
        <p className='m-0 fs-5 fw-semibold'>Numero de telefono:</p>
        <input className='ps-0 form-control border-0 rounded-0 border-bottom fs-5' type="tel" placeholder='Tu numero' value={telefono} required minLength={9} onChange={handleChangeTelefono} />
      </div>

      <div className='mt-5'>
        <p className='mb-0 fs-5 fw-semibold'>Entrega:</p>
        <div className='border-0 border-bottom'>
          <select className='w-100 border-0 fs-5 rounded-3 text-black bg-transparent' required onChange={handleChangeEntrega}>
            <option value=""></option>
            <option value="ire a recogerla">Ire a recogerla</option>
            <option value="quiero delivery">Quiero Delivery</option>
          </select>
        </div>
      </div>
      
      {
        (entrega == 'quiero delivery')
        ? <div className='mt-5'>
            <p className='mb-0 fs-5 fw-semibold'>Lugar:</p>
            <div className='border-0 border-bottom'>
              <select className='w-100 border-0 fs-5 rounded-3 text-black bg-transparent' onChange={handleChangeLugarDelivey}>
                <option value='guerra'>Guerra $50</option>
                <option value='reforma'>La Reforma $200</option>
                <option value="fao">El Fao $100</option>
                <option value="cruce">El Cruce $200</option>
                <option value="berroa">La berroa $200</option>
                <option value="joya">La Joya $200</option>
              </select>
            </div>
          </div>
        : <></>
      }

      <p className='fw-bold fs-5 mt-5'>Completar el numero de telefono es obligatorio para que pueda hacer la orden.</p>        

      <div className='my-5'>
        <p className='m-0 fs-5 fw-semibold'>Comentario</p>
        <input className='ps-0 form-control border-0 rounded-0 border-bottom fs-5' type="text" placeholder='Tu comentario' onChange={handleChangeComentario} />
      </div>

    </div>
  )
}

export default CartInfoClient
