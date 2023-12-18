import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import swal from 'sweetalert';
import ListadoTable from '../ListadoTable';
import FilaCliente2 from './FilaCliente2';
import Paginacion from 'components/subComponents/Paginacion/Paginacion';

const ModalClientesVendedores = ({ vendedorName, isOpen, toggle, userId }) => {
    const [clientslist, setClientsList] = useState(<></>)
    const [page, setPage] = useState(1)
    const [esperar, setEsperar] = useState(false)
    const [call, setCall] = useState(false)
    const [ultimaPag, setUltimaPag] = useState(1)
    const [plantPaginas, setPlantPaginas] = useState(<></>)
    const [dataState, setDataState] = useState([])

    const getClientsList = async () => {
        setEsperar(true)
        await axios.get(UrlNodeServer.usuariosDir.sub.clients + "/" + userId + "?page=" + page, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            if (res.data.status === 200) {
                if (res.data.body.data.length > 0) {
                    setDataState(res.data.body.pagesObj)
                    setUltimaPag(res.data.body.pagesObj.totalPag)
                    setClientsList(
                        res.data.body.data.map((item, key) => {
                            let primero
                            if (key === 0) {
                                primero = true
                            } else {
                                primero = false
                            }
                            return (
                                <FilaCliente2
                                    id={key}
                                    key={key}
                                    item={item}
                                    setEsperar={setEsperar}
                                    primero={primero}
                                    pagina={page}
                                    relist={() => setCall(!call)}
                                />
                            )
                        })
                    )
                } else {
                    setClientsList(<tr><td>No tiene clienets asignados.</td></tr>)
                    setUltimaPag(1)
                }
            } else {
                swal("Error", "Hubo un error inesperado!", "error")
            }
            console.log('res.data :>> ', res.data);
        }).catch(() => {
            swal("Error", "Hubo un error inesperado!", "error")
        }).finally(() => {
            setEsperar(false)
        })
    }

    useEffect(() => {
        isOpen && getClientsList()
        // eslint-disable-next-line
    }, [isOpen, page, call])

    return (<>
        <Modal toggle={toggle} isOpen={isOpen} size="lg">
            <ModalHeader>
                Clientes de {vendedorName}
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="12">
                        {!esperar ?
                            <ListadoTable
                                listado={clientslist}
                                titulos={["Razón Social", "CUIT", "Telefóno", ""]}
                            /> : <div style={{ textAlign: "center", marginTop: "0" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
                            </div>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Paginacion
                            setPagina={setPage}
                            setCall={setCall}
                            pagina={page}
                            call={call}
                            plantPaginas={plantPaginas}
                            ultimaPag={ultimaPag}
                            data={dataState}
                            setPlantPaginas={setPlantPaginas}
                            setUltimaPag={setUltimaPag}
                        />
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={e => {
                    e.preventDefault()
                    toggle()
                }}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    </>)
}

export default ModalClientesVendedores