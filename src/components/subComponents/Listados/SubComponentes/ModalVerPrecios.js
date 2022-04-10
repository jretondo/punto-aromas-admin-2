import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap';
import swal from 'sweetalert';
import ListadoTable from '../ListadoTable';
import FilaPrecio from './FilaPrecio';

const titulos = ["Tipo de precio", "(%) Ganancia", "($) Venta", "Cant. Min."]

const ModalVerPrecios = ({
    modal,
    setModal,
    item
}) => {
    const [loading, setLoading] = useState(false)
    const [precios, setPrecios] = useState(<tr><td>No hay precios agregados</td></tr>)

    const getPrices = async () => {
        setLoading(true)
        await axios.get(UrlNodeServer.productsDir.sub.prices + "/?globalName=" + item.global_name, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const status = res.data.status
            if (status === 200) {
                const body = res.data.body
                if (body.length > 0) {
                    setPrecios(body.map((item, key) => {
                        return (
                            <FilaPrecio
                                key={key}
                                id={key}
                                item={item}
                                muestra={true}
                            />
                        )
                    }))
                } else {
                    setPrecios(<tr><td>No hay precios agregados</td></tr>)
                }
            } else {
                setPrecios(<tr><td>No hay precios agregados</td></tr>)
                swal("Error!", "Hubo un error inesperado!", "error");
            }
        }).catch(() => {
            setPrecios(<tr><td>No hay precios agregados</td></tr>)
            swal("Error!", "Hubo un error inesperado!", "error");
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        if (modal) {
            getPrices()
        }
        // eslint-disable-next-line 
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                Precios
                            </ModalHeader>
                            <ModalBody>
                                <Row style={{ marginTop: "20px" }}>
                                    <Col md="12">
                                        <ListadoTable
                                            titulos={titulos}
                                            listado={precios}
                                        />
                                    </Col>
                                </Row>
                            </ModalBody>
                        </>
                }
            </Form>
        </Modal>
    )
}

export default ModalVerPrecios