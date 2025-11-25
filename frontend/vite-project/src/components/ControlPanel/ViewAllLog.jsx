import React, { useEffect, useState } from 'react'
import { getAllLog } from '../../core/services/ControlPanel/allLog'
import Dropdown from 'react-bootstrap/Dropdown'
import { deleteAllLog, deletedInfo, deletedWarning, deletedError } from '../../core/services/ControlPanel/deleteLog'

const ViewAllLog = () => {
  const [logData, setLogData] = useState([])
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")

  const allLogs = async () => {
    try {
      const res = await getAllLog()
      if (res && Array.isArray(res.log)) {
        setLogData(res.log)
      }
    } catch (error) {
      console.error(error.message)
      setLogData([])
    }
  }

  useEffect(() => {
    allLogs()
  }, [])

  // 🔥 FUNCIONES DE ELIMINACIÓN EN TIEMPO REAL
  const handleDeleteAll = async () => {
    try {
      await deleteAllLog()
      await allLogs()
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteInfo = async () => {
    try {
      await deletedInfo()
      await allLogs()
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteWarning = async () => {
    try {
      await deletedWarning()
      await allLogs()
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleDeleteError = async () => {
    try {
      await deletedError()
      await allLogs()
    } catch (error) {
      console.error(error.message)
    }
  }

  // Colores
  const getLogBgColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'info': return 'bg-primary text-white'
      case 'warn':
      case 'warning': return 'bg-warning text-dark'
      case 'error': return 'bg-danger text-white'
      case 'debug': return 'bg-secondary text-white'
      default: return 'bg-light text-dark'
    }
  }

  const getFormattedDate = (date) =>
    new Date(date).toISOString().split("T")[0]

  // Filtrado combinado
  const filteredLogs = logData.filter(l => {
    const levelMatch = filter === "all" || l.level.toLowerCase() === filter
    const dateMatch = !dateFilter || getFormattedDate(l.createdAt) === dateFilter
    return levelMatch && dateMatch
  })

  return (
    <div className="container mt-3">

      {/* 🔥 DROPDOWN ELIMINACIÓN */}
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

      {/* FILTROS */}
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

        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      {/* 🔥 TOTAL DE LOGS FILTRADOS */}
      <h5 className="mb-3">Registros encontrados: {filteredLogs.length}</h5>

      {/* LISTA DE LOGS */}
      {filteredLogs.length > 0 ? (
        filteredLogs.map((l, idx) => (
          <div
            key={l._id || idx}
            className={`card p-2 mb-2 shadow-sm ${getLogBgColor(l.level)}`}
          >
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <span className="fw-bold text-uppercase">{l.level}</span>
              <span>{l.message}</span>
              <span>{l.meta?.user}</span>
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
    </div>
  )
}

export default ViewAllLog
