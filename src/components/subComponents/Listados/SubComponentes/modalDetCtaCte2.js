import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import CompleteCerosLeft from 'Function/CompleteCeroLeft';
import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import FilaDetCtacte from './FilaDetCtaCte2';
import ListadoTable from '../ListadoTable';
import formatMoney from 'Function/NumberFormat';
import ModalCobroCtaCte from 'views/admin/clientes/ctacte/modalCobro';

const ModalDetCtaCte = ({
    modal,
    toggle,
    item,
    actualizarOriginal
}) => {
    const [listDetFact, setListDetFact] = useState(<></>)
    const [suma, setSuma] = useState(0)
    const [pagoBool, setPagoBool] = useState(false)
    const [actualizar, setActualizar] = useState(false)

    const getListDet = async () => {
        await axios.get(`${UrlNodeServer.usuariosDir.sub.factDet}?idFact=${item.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data.body
            const status = res.data.status
            if (status === 200) {
                setSuma(respuesta.suma[0].SUMA)
                if (respuesta.data.length > 0) {
                    setListDetFact(
                        respuesta.data.map((item, key) => {
                            return (
                                <FilaDetCtacte
                                    key={key}
                                    item={item}
                                    id={key}
                                />
                            )
                        })
                    )
                }
            } else {

            }
        }).catch(error => {

        })
    }

    useEffect(() => {
        getListDet()
        // eslint-disable-next-line 
    }, [modal, actualizar])

    return (
        <>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Detalles factura ({item.letra} {CompleteCerosLeft(item.pv, 5)} - {CompleteCerosLeft(item.cbte, 8)})
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col>
                            <ListadoTable
                                listado={listDetFact}
                                titulos={["Fecha", "Detalle", "Importe"]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>
                                    Total Deuda Factura
                                </Label>
                                <Input type="text" style={{ color: "green", fontWeight: "bold", fontSize: "16px" }} value={"$ " + formatMoney(suma)} disabled />
                            </FormGroup>
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
            <ModalCobroCtaCte
                modal={pagoBool}
                toggle={() => setPagoBool(!pagoBool)}
                factuId={item.id}
                actualizar={() => setActualizar(!actualizar)}
                suma={suma}
                actualizarOriginal={actualizarOriginal}
            />
        </>
    )
}

export default ModalDetCtaCte