import React from 'react'

const AjustesPuntosCodigoRef = ({configCodeRef, setConfigCodeRef}) => {

  const handleChangeRefFriendGenerate = (e) => setConfigCodeRef(state => ({...state, refFriendGenerate: Number(e.target.value) }))
  const handleChangeMinForSpend = (e) => setConfigCodeRef(state => ({...state, minForSpend: Number(e.target.value)}));
  const handleChangePointsForMinSpend = (e) => setConfigCodeRef(state => ({...state, pointsForMinSpend: Number(e.target.value)})) 

  return (
    <div className='my-4'>
      <p className='m-0 fw-bold fs-2 text-center'>Reglas al user codigo de referido</p>
          
      <div className="d-flex g-3 align-items-center">
        <div className="">
          <label htmlFor="inputPassword6" className="col-form-label">Al invitar un amigo generaran {configCodeRef.refFriendGenerate} puntos</label>
        </div>
        <div className="">
          <input type="number" className="form-control" placeholder='pesos' value={configCodeRef.refFriendGenerate} onChange={handleChangeRefFriendGenerate} />
        </div>
      </div>

      <div className="row g-3 align-items-center">
        <div className="col-auto">
          <label htmlFor="inputPassword6" className="col-form-label">Si tu invitado gasta {configCodeRef.minForSpend} pesos generara {configCodeRef.pointsForMinSpend} Puntos</label>
        </div>
        <div className="col-auto">
          <input type="number" className="form-control" placeholder='el invitado debe gastar' value={configCodeRef.minForSpend} onChange={handleChangeMinForSpend} />
        </div>
        <div className="col-auto">
          <input type="number" className="form-control" placeholder='recibiran' value={configCodeRef.pointsForMinSpend} onChange={handleChangePointsForMinSpend} />
        </div>
      </div>
    </div>
  );
}

export default AjustesPuntosCodigoRef;
