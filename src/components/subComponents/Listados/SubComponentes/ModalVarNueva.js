import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap';
import swal from 'sweetalert';


const ModalVarNueva = ({
    modal,
    setModal,
    item,
    setCall,
    call
}) => {
    const [loading, setLoading] = useState(false)
    const [variedad, setVariedad] = useState("")
    const [codBarra, setCodBarra] = useState("")

    const newVar = async () => {
        const data = {
            varName: variedad,
            codBarra: codBarra,
            globalName: item.global_name
        }
        setLoading(true)
        await axios.post(UrlNodeServer.productsDir.sub.var, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                swal(`Nueva Variedad`, "HCargado con éxito!", "success");
            } else {
                swal(`Nueva Variedad`, "Hubo un error inesperado. Intente nuevamente", "error");
            }
        }).catch(() => {
            swal(`Nueva Variedad`, "Hubo un error inesperado. Intente nuevamente", "error");
        }).finally(() => {
            setModal(false)
            setTimeout(() => {
                setCall(!call)
            }, 2000);
        })
    }

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
                                Nueva Variedad - {item.global_name}
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col md="6" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="precioVtaTxt"
                                            >
                                                Variedad
                                            </label>
                                            <Input placeholder="Variedad..." style={{ fontSize: "25px" }} type="text" id="precioVarTxt" value={variedad} onChange={e => setVariedad(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                    <Col md="6">
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Cód. Barra
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-username"
                                                placeholder="Córdigo de Barras..."
                                                type="text"
                                                style={{ fontSize: "25px" }}
                                                value={codBarra}
                                                onChange={e => setCodBarra(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="12" style={{ textAlign: "center" }}>
                                        <Button color="primary" onClick={e => {
                                            e.preventDefault()
                                            newVar()
                                        }}>
                                            Agregar Variedad
                                        </Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </>
                }
            </Form>
        </Modal>
    )
}

export default ModalVarNueva