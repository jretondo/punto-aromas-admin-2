import React from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../api/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import swal from 'sweetalert'

const FilaCliente2 = ({
    id,
    item,
    setEsperar,
    primero,
    pagina,
    setPagina,
    relist
}) => {

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        swal({
            title: "Eliminar el cliente " + name + "!",
            text: "¿Está seguro de quitar este cliente del vendedor? Esta desición es permanente.",
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
                    await axios.put(`${UrlNodeServer.usuariosDir.sub.clients}/${id}`, {}, {
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
                                swal("Eliminado con éxito", "El cliente fué desvinculado del vendedor", "success")

                            } else {
                                swal("Error", "Hubo un error inesperado", "error")
                            }
                        })
                        .catch(() => {
                            swal("Error", "Hubo un error inesperado", "error")

                        }).finally(() => {
                            setEsperar(false)
                            relist()
                        })
                }
            });
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.razsoc}
            </td>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.cuit) === 0 ?
                    "CUIT " + item.ndoc :
                    "DNI " + item.ndoc
                }
            </td>
            <td style={{ textAlign: "center" }}>
                {item.telefono}
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
                            onClick={e => EliminarOff(e, item.id, item.razsoc, primero, pagina)}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Quitar
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaCliente2