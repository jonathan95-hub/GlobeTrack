import React, { useEffect, useState } from 'react'
import { allUser } from '../../core/services/ControlPanel/AllUser'
import { allGroup } from '../../core/services/ControlPanel/allGroup'
import { getAllLog } from '../../core/services/ControlPanel/allLog'
import ViewAllUser from '../../components/ControlPanel/ViewAllUser'
import ViewAllLog from '../../components/ControlPanel/ViewAllLog'
import ViewAllGroup from '../../components/ControlPanel/viewAllGroup'

const ControlPanel = () => {

    const [dataUser, setDataUser] = useState([])
    const [dataGroup, setDataGroup] = useState([])
    const [dataAllLog, setDataLog] = useState([])
    const [isViewUser, setIsViewUser] = useState(false)
    const [isViewGroup, setIsViewGroup] = useState(false)
    const [isViewLog, setIsViewLog] = useState(false)

    const getAllUser = async () => {
        try {
            const res = await allUser()
            if (res && Array.isArray(res.users)) {
                setDataUser(res.users)
            }
            setIsViewUser(true)
            setIsViewGroup(false)
            setIsViewLog(false)
        } catch (error) {
            console.error(error.message)
        }
    }

    const getAllGroup = async () => {
        try {
            const res = await allGroup()
            if (res && Array.isArray(res.allGroup)) {
                setDataGroup(res.allGroup)
            }
            setIsViewGroup(true)
            setIsViewUser(false)
            setIsViewLog(false)
        } catch (error) {
            console.error(error.message)
        }
    }
    const allLog = async() => {
      try {
        const res = await getAllLog()
        if(res && Array.isArray(res.log)){
          setDataLog(res.log)
        }
      } catch (error) {
         console.error(error.message)
      }
    }

    const viewLog = () => {
        setIsViewLog(true)
        setIsViewUser(false)
        setIsViewGroup(false)
    }

    useEffect(() => {
        getAllUser()
        getAllGroup()
        allLog()
    }, [])

    return (
        <div className="container mt-4 d-flex flex-column align-items-center">

            {/* TITULO */}
            <h2 className="fw-bold mb-4 text-center">Panel de Control</h2>

            {/* CARDS DE INFORMACIÓN */}
            <div className="d-flex flex-column flex-md-row gap-3 w-100 mb-4">

                <div className="card shadow-sm text-center p-3 flex-fill">
                    <h5 className="m-0">Usuarios Registrados</h5>
                    <span className="display-6 fw-bold">{dataUser.length}</span>
                </div>

                <div className="card shadow-sm text-center p-3 flex-fill">
                    <h5 className="m-0">Grupos Activos</h5>
                    <span className="display-6 fw-bold">{dataGroup.length}</span>
                </div>

                  <div className="card shadow-sm text-center p-3 flex-fill">
                    <h5 className="m-0">Registros</h5>
                    <span className="display-6 fw-bold">{dataAllLog.length}</span>
                </div>

            </div>

            {/* BOTONES DE NAVEGACIÓN */}
            <div className="d-flex gap-3 mb-4 flex-wrap justify-content-center">

                {!isViewUser && (
                    <button className="btn btn-primary px-4" onClick={getAllUser}>
                        Ver Usuarios
                    </button>
                )}

                {!isViewGroup && (
                    <button className="btn btn-success px-4" onClick={getAllGroup}>
                        Ver Grupos
                    </button>
                )}

                {!isViewLog && (
                    <button className="btn btn-warning px-4" onClick={viewLog}>
                        Registros
                    </button>
                )}
            </div>

            {/* CONTENIDO RENDERIZADO */}
            <div className="w-100">

                {isViewUser && (
                    <div className="card shadow-sm p-4 mb-4">
                        <h3 className="fw-bold mb-3 text-center">Listado de Usuarios</h3>
                        <ViewAllUser />
                    </div>
                )}

                {isViewGroup && (
                    <div className="card shadow-sm p-4 mb-4">
                        <h3 className="fw-bold mb-3 text-center">Listado de Grupos</h3>
                        <ViewAllGroup/>
                    </div>
                )}

                {isViewLog && (
                    <div className="card shadow-sm p-4 mb-4">
                        <h3 className="fw-bold mb-3 text-center">Registros del Sistema</h3>
                        <ViewAllLog/>
                    </div>
                )}

            </div>

        </div>
    )
}

export default ControlPanel
