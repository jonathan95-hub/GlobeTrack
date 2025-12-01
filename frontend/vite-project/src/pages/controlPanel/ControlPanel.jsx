import React, { useEffect, useState } from 'react'
// Servicios que llaman a la API para obtener usuarios, grupos y logs
import { allUser } from '../../core/services/ControlPanel/AllUser'
import { allGroup } from '../../core/services/ControlPanel/allGroup'
import { getAllLog } from '../../core/services/ControlPanel/allLog'
// Componentes que renderizan listas de usuarios, grupos y logs
import ViewAllUser from '../../components/ControlPanel/ViewAllUser'
import ViewAllLog from '../../components/ControlPanel/ViewAllLog'
import ViewAllGroup from '../../components/ControlPanel/viewAllGroup'

const ControlPanel = () => {

    // Estados para almacenar los datos obtenidos de la API
    const [dataUser, setDataUser] = useState([])       // Usuarios
    const [dataGroup, setDataGroup] = useState([])     // Grupos
    const [dataAllLog, setDataLog] = useState([])      // Logs del sistema

    // Estados para controlar qué vista se está mostrando
    const [isViewUser, setIsViewUser] = useState(false)
    const [isViewGroup, setIsViewGroup] = useState(false)
    const [isViewLog, setIsViewLog] = useState(false)

    // Función para obtener todos los usuarios desde la API
    const getAllUser = async () => {
        try {
            const res = await allUser()
            // Validamos que la respuesta tenga un array de usuarios
            if (res && Array.isArray(res.users)) {
                setDataUser(res.users)
            }
            // Activamos la vista de usuarios y desactivamos las demás
            setIsViewUser(true)
            setIsViewGroup(false)
            setIsViewLog(false)
        } catch (error) {
            console.error(error.message) // Mostramos el error si falla la petición
        }
    }

    // Función para obtener todos los grupos desde la API
    const getAllGroup = async () => {
        try {
            const res = await allGroup()
            if (res && Array.isArray(res.allGroup)) {
                setDataGroup(res.allGroup)
            }
            // Activamos la vista de grupos y desactivamos las demás
            setIsViewGroup(true)
            setIsViewUser(false)
            setIsViewLog(false)
        } catch (error) {
            console.error(error.message)
        }
    }

    // Función para obtener todos los logs desde la API
    const allLog = async() => {
      try {
        const res = await getAllLog()
        if(res && Array.isArray(res.log)){
          setDataLog(res.log) // Guardamos los logs en el estado
        }
      } catch (error) {
         console.error(error.message)
      }
    }

    // Función para mostrar solo los logs
    const viewLog = () => {
        setIsViewLog(true)
        setIsViewUser(false)
        setIsViewGroup(false)
    }

    // useEffect que se ejecuta al montar el componente
    // Llama a las funciones para obtener usuarios, grupos y logs
    useEffect(() => {
        getAllUser()
        getAllGroup()
        allLog()
    }, [])

    return (
        <div className="container mt-4 d-flex flex-column align-items-center">

            {/* TITULO DEL PANEL */}
            <h2 className="fw-bold mb-4 text-center">Panel de Control</h2>

            {/*  muestran cantidad de usuarios, grupos y logs */}
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

            {/*  permiten cambiar entre vistas */}
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

            {/* CONTENIDO RENDERIZADO SEGÚN LA VISTA SELECCIONADA */}
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
