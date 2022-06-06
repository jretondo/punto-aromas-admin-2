import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import swal from 'sweetalert';
import FilaSeller from './FilaClienteSeller';
import ListadoTable from 'components/subComponents/Listados/ListadoTable';

const ModalSellers = ({
    modal,
    toggle,
    clienteItem,
    reload
}) => {
    const [listaVendedores, setListaVendedores] = useState(<tr><td>No hay vendedores para asignar</td></tr>)
    const [loading, setLoading] = useState(false)

    const selectSeller = async (infoSeller) => {
        swal({
            title: "Asignación de vendedores a clientes",
            text: `¿Está seguro de asignar al vendedor ${infoSeller.nombre} ${infoSeller.apellido} al cliente ${clienteItem.razsoc}?`,
            icon: "warning",
            buttons: ["Cancelar", "Asignar"],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setLoading(true)
                    const data = {
                        seller: infoSeller,
                        client: clienteItem,
                        type: true
                    }
                    await axios.put(UrlNodeServer.clientesDir.sub.sellers, data, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    }).then(res => {
                        if (res.data.status === 200) {
                            swal("Asignado con éxito!", "", "success")
                        } else {
                            swal("Error en la asignaciñon", "Es muy probable que usted no tenga los permisos para realizar esta operación!", "error")
                        }
                    }).catch(error => {
                        console.log('error :>> ', error);
                        swal("Error en la asignaciñon", "Es muy probable que usted no tenga los permisos para realizar esta operación!", "error")
                    }).finally(() => setLoading(false))
                    setTimeout(() => {
                        toggle()
                    }, 2000);
                    setTimeout(() => {
                        reload()
                    }, 2500);
                }
            });
    }

    const unSelectSeller = async (infoSeller) => {
        swal({
            title: "Quitar vendedor a cliente",
            text: `¿Está seguro de quitar al vendedor ${infoSeller.nombre} ${infoSeller.apellido} al cliente ${clienteItem.razsoc}? una vez echo este vendedor no podrá cobrar comisiones de este cliente.`,
            icon: "warning",
            buttons: ["Cancelar", "Quitar"],
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setLoading(true)
                    const data = {
                        seller: infoSeller,
                        client: clienteItem
                    }
                    await axios.put(UrlNodeServer.clientesDir.sub.sellers, data, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    }).then(res => {
                        if (res.data.status === 200) {
                            swal("Quitado con éxito!", "", "success")
                        } else {
                            swal("Error en la asignaciñon", "Es muy probable que usted no tenga los permisos para realizar esta operación!", "error")
                        }
                    }).catch(error => {
                        console.log('error :>> ', error);
                        swal("Error en la asignaciñon", "Es muy probable que usted no tenga los permisos para realizar esta operación!", "error")
                    }).finally(() => setLoading(false))
                    setTimeout(() => {
                        toggle()
                    }, 2000);
                    setTimeout(() => {
                        reload()
                    }, 2500);
                }
            });
    }

    const getVendedores = async () => {
        setLoading(true)
        await axios.get(UrlNodeServer.usuariosDir.sub.sellers, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const sellerList = respuesta.body.data
                if (sellerList.length > 0) {
                    setListaVendedores(
                        // eslint-disable-next-line
                        sellerList.map((item, key) => {
                            return (
                                <FilaSeller
                                    key={key}
                                    id={key}
                                    item={item}
                                    selectSeller={selectSeller}
                                    asignado={clienteItem.vendedor_id}
                                    unSelectSeller={unSelectSeller}
                                />
                            )
                        })
                    )
                } else {
                    setListaVendedores(<tr><td>No hay vendedores para asignar</td></tr>)
                }
            } else {
                swal("Error en el listado de vendedores", "Es muy probable que usted no tenga los permisos para obtenet esta información!", "error")
            }
        }).catch(error => {
            swal("Error en el listado de vendedores", "Es muy probable que usted no tenga los permisos para obtenet esta información!", "error")
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (modal) {
            getVendedores()
        }
        // eslint-disable-next-line
    }, [clienteItem, modal])

    return (
        <Modal size="lg" isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Asignar un vendedor al cliente: {clienteItem.razsoc}
            </ModalHeader>
            <ModalBody>
                {
                    loading ?
                        <Row>
                            <Col style={{ textAlign: "center", width: "150px", height: "150px" }}>
                                <Spinner />
                            </Col>
                        </Row> :
                        <ListadoTable
                            titulos={["Nombre Completo", "Email", "Punto de Venta", ""]}
                            listado={listaVendedores}
                        />
                }
            </ModalBody>
            <ModalFooter>
                <Button onClick={toggle} color="danger">
                    Cancelar
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalSellers