// Importamos useEffect y useState de react
import React, { useEffect, useState } from 'react'
// Importamos la funcion que hace la llamada al backend para traer todos los log
import { getAllLog } from '../../core/services/ControlPanel/allLog'
// Importamos dropdown desde react-bootstrap
import Dropdown from 'react-bootstrap/Dropdown'
// Importamos las funciones delete para todos los logs y para cada tipo en especifico
import { deleteAllLog, deletedInfo, deletedWarning, deletedError } from '../../core/services/ControlPanel/deleteLog'

const ViewAllLog = () => {

  // Estado y modal para manejo de errores
     const [messageInfo, setMessageInfo] = useState("")
     const [modalMessageInfo, setModalMessageInfo] = useState(false)
  // Estado donde se guardan todos los logs que vienen del backend
  const [logData, setLogData] = useState([])

  // Filtro para ver los logs por tipo
  const [filter, setFilter] = useState("all")

  // Filtro por fecha 
  const [dateFilter, setDateFilter] = useState("")

  // Función que trae todos los logs 
  const allLogs = async () => {
    try {
      const res = await getAllLog()

      // Si la respuesta trae un array de logs se setean en el estado setLogData
      if (res && Array.isArray(res.log)) {
        setLogData(res.log)
      }

    } catch (error) {
      console.error(error.message)
      setLogData([]) // si falla, el estado trae un array vacio
       setMessageInfo(error.message)
      setModalMessageInfo(true)
    }
  }

  // useEffect para cargar todos los logs al cargar el componente
  useEffect(() => {
    allLogs()
  }, [])

 
  // Funcion para eliminar los logs


  const handleDeleteAll = async () => {
    try {
      await deleteAllLog()
      await allLogs() // llamada para traer de nuevo los logs
    } catch (error) {
      console.error(error.message)
       setMessageInfo(error.message)
      setModalMessageInfo(true)
    }
  }
// Elimina los logs tipo Info
  const handleDeleteInfo = async () => {
    try {
      await deletedInfo()
      await allLogs()
    } catch (error) {
      console.error(error.message)
       setMessageInfo(error.message)
      setModalMessageInfo(true)
    }
  }
// Elimina los logs tipo warn
  const handleDeleteWarning = async () => {
    try {
      await deletedWarning()
      await allLogs()
    } catch (error) {
      console.error(error.message)
       setMessageInfo(error.message)
      setModalMessageInfo(true)
    }
  }
// Elimina los logs tipo error
  const handleDeleteError = async () => {
    try {
      await deletedError()
      await allLogs()
    } catch (error) {
      console.error(error.message)
       setMessageInfo(error.message)
      setModalMessageInfo(true)
    }
  }


  // Funcion para poner cada log de un color
  const getLogBgColor = (level) => {
    // según el tipo de log devuelvo una clase de Bootstrap
    switch (level?.toLowerCase()) {
      case 'info': return 'bg-primary text-white'
      case 'warn':
      case 'warning': return 'bg-warning text-dark'
      case 'error': return 'bg-danger text-white'
      case 'debug': return 'bg-secondary text-white'
      default: return 'bg-light text-dark'
    }
  }

  // Formateo de la fecha para comparar
  const getFormattedDate = (date) =>
    new Date(date).toISOString().split("T")[0]

  
  // Filtro de logs por nivel y fecha
  

  const filteredLogs = logData.filter(l => {
    const levelMatch = filter === "all" || l.level.toLowerCase() === filter
    const dateMatch = !dateFilter || getFormattedDate(l.createdAt) === dateFilter

    return levelMatch && dateMatch
  })

  return (
    <div className="container mt-3">

      {/* Dropdown con opciones para eliminar */}
      <Dropdown className='mb-5'>
        <Dropdown.Toggle variant="outline-danger">
          Opciones de Eliminación
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item className="text-success" onClick={handleDeleteAll}>
            Eliminar Todos los Logs
          </Dropdown.Item>

          <Dropdown.Item className="text-primary" onClick={handleDeleteInfo}>
            Eliminar Logs Info
          </Dropdown.Item>

          <Dropdown.Item className="text-warning" onClick={handleDeleteWarning}>
            Eliminar Logs Warning
          </Dropdown.Item>

          <Dropdown.Item className="text-danger" onClick={handleDeleteError}>
            Eliminar Logs Error
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Botones para filtrar */}
      <div className='d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-4'>
        <button className='btn btn-primary' onClick={() => setFilter("info")}>
          Ver logs Info
        </button>

        <button className='btn btn-warning' onClick={() => setFilter("warn")}>
          Ver logs Warning
        </button>

        <button className='btn btn-danger' onClick={() => setFilter("error")}>
          Ver logs Error
        </button>

        <button className='btn btn-success' onClick={() => setFilter("all")}>
          Ver Todos los Logs
        </button>

        {/* Filtro por fecha */}
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* Cantidad de logs encontrados */}
      <h5 className="mb-3">Registros encontrados: {filteredLogs.length}</h5>

      {/* Lista de logs */}
      {filteredLogs.length > 0 ? (
        filteredLogs.map((l, idx) => (
          <div
            key={l._id || idx}
            className={`card p-2 mb-2 shadow-sm ${getLogBgColor(l.level)}`}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              {/*Nivel del log */}
              <span className="fw-bold text-uppercase">{l.level}</span>
              {/*Mensaje del log */}
              <span>{l.message}</span>
              {/*Usuario que realizo la accion y se refleja en el log */}
              <span>{l.meta?.user}</span>

              {/* Fecha del log */}
              {l.createdAt && (
                <span className="text-muted">
                  {new Date(l.createdAt).toLocaleString('es-ES')}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No hay registros disponibles para el filtro seleccionado.</p>
      )}
             {modalMessageInfo && (
  <div 
    className="position-absolute top-50 start-50 translate-middle-x mt-4 p-3"
    style={{ 
      zIndex: 1100, 
      width: '90%', 
      maxWidth: '400px', 
      backgroundColor:  '#ff4d4f', 
      color: '#fff',
      borderRadius: '12px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      textAlign: 'center'
    }}
  >
    <div className="d-flex justify-content-between align-items-start">
      <div style={{ flex: 1 }}>{messageInfo}</div>
      <button 
        className="btn-close btn-close-white"
        onClick={() => setModalMessageInfo(false)}
      />
    </div>
  </div>
)}
    </div>
  )
}

export default ViewAllLog
