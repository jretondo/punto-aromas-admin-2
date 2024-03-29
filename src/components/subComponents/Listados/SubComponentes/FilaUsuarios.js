import React, { useState } from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../api/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Button
} from "reactstrap"
import swal from 'sweetalert'
import ModalClientesVendedores from './ModalClientesVendedores'

const FilaUsuario = ({
    id,
    item,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setCall,
    call,
    setEsperar,
    setDetallesBool,
    setIdDetalle,
    primero,
    pagina,
    setPagina,
    setPermisosBool,
    setIdPermisos,
    setUsuarioPermiso,
    setVerCtaCteBool,
    setIdCtaCte,
    setNombreCtaCte,
}) => {

    const [isOpenModal1, setIsOpenModal1] = useState(false)
    const toggle1 = () => setIsOpenModal1(!isOpenModal1)

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        swal({
            title: "Eliminar al usuario " + name + "!",
            text: "¿Está seguro de eliminar a este usuario? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setEsperar(true)
                    await axios.delete(`${UrlNodeServer.usuariosDir.usuarios}/${id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    })
                        .then(res => {
                            const status = parseInt(res.data.status)
                            if (status === 200) {
                                if (primero) {
                                    if (pagina > 1) {
                                        setPagina(parseInt(pagina - 1))
                                    }
                                }
                                setActividadStr("El usuario ha eliminado el usuario '" + name + "'")
                                setNvaActCall(!nvaActCall)
                                setMsgStrong("Usuario eliminado con éxito!")
                                setMsgGralAlert("")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                                setCall(!call)
                                setEsperar(false)
                            } else {
                                setEsperar(false)
                                setMsgStrong("Hubo un error!")
                                setMsgGralAlert(" Intente nuevamente.")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                        .catch(() => {
                            setEsperar(false)
                            setMsgStrong("Hubo un error!")
                            setMsgGralAlert(" Intente nuevamente.")
                            setSuccessAlert(false)
                            setAlertar(!alertar)
                        })
                }
            });
    }

    const VerDetalles = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
    }

    const DarPermisos = (e, id, name) => {
        e.preventDefault()
        setUsuarioPermiso(name)
        setIdPermisos(id)
        setPermisosBool(true)
    }

    const VerCtaCte = (e, id, name) => {
        e.preventDefault()
        setVerCtaCteBool(true)
        setIdCtaCte(id)
        setNombreCtaCte(name)
    }

    return (
        <>
            <tr key={id}>
                <td style={{ textAlign: "center" }}>
                    {item.nombre + " " + item.apellido}
                </td>
                <td style={{ textAlign: "center" }}>
                    {item.usuario}
                </td>
                <td style={{ textAlign: "center" }}>
                    {item.email}
                </td>
                <td style={{ textAlign: "center" }}>
                    <Button color="primary" onClick={e => {
                        e.preventDefault()
                        toggle1()
                    }}>
                        Ver
                    </Button>
                </td>
                <td className="text-right">
                    <UncontrolledDropdown>
                        <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#pablo"
                            role="button"
                            size="sm"
                            color=""
                            onClick={e => e.preventDefault()}
                        >
                            <i className="fas fa-ellipsis-v" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => VerDetalles(e, item.id)}
                            >
                                <i className="fas fa-edit"></i>
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => VerCtaCte(e, item.id, item.nombre + " " + item.apellido)}
                            >
                                <i className="fas fa-list"></i>
                                Ver Cuenta Corriente
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => DarPermisos(e, item.id, item.nombre + " " + item.apellido)}
                            >
                                <i className="fas fa-id-card"></i>
                                Dar Permisos
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => EliminarOff(e, item.id, item.nombre + " " + item.apellido, primero, pagina)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Eliminar
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
            <ModalClientesVendedores
                toggle={toggle1}
                isOpen={isOpenModal1}
                vendedorName={item.nombre + " " + item.apellido}
                userId={item.id}
            />
        </>
    )
}

export default FilaUsuario