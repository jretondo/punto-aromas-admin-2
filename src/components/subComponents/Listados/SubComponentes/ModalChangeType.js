import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner
} from 'reactstrap';
import swal from 'sweetalert';
import CompleteCerosLeft from 'Function/CompleteCeroLeft';

const ModalChangeType = ({
    setModal,
    modal,
    item,
    pagina,
    setPagina
}) => {
    const [loading, setLoading] = useState(false)
    const [payType, setPayType] = useState(parseInt(item.forma_pago))

    const changePayType = async (id, typeId) => {
        const data = {
            idType: typeId
        }
        setLoading(true)
        await axios.put(UrlNodeServer.invoicesDir.sub.paytype + "/" + item.id, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const affectedRows = respuesta.body.affectedRows
                if (affectedRows > 0) {
                    swal(`Cambios en la factura`, "Forma de pago cambiada con éxito!", "success");
                } else {
                    swal(`Cambios en factura`, "Hubo un error inesperado", "error");
                }
            } else {
                swal(`Cambios en factura`, "Hubo un error inesperado", "error");
            }
        }).catch((error) => {
            swal(`Cambios en factura`, "Hubo un error inesperado", "error");
            console.log('error :>> ', error);
        }).finally(() => {
            setModal(false)
            setTimeout(() => {
                const paginaConst = pagina
                setPagina(parseInt(pagina) + 1)
                setPagina(paginaConst)
            }, 1500);
            setLoading(false)
        })
    }

    useEffect(() => {
        if (modal) {
            try {
                setTimeout(() => {
                    document.getElementById("typelist").focus()
                }, 500);
            } catch (error) {
                console.log('error :>> ', error);
            }
        }
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
                changePayType(item.id_prod, payType)
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                <h3>Cambiar forma de pago</h3>
                                <h2 style={{ color: "#0081c9" }}>{item.letra} {CompleteCerosLeft(item.pv, 5)} - {CompleteCerosLeft(item.cbte, 8)}</h2>
                            </ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="factFiscTxt">Forma de Pago</Label>
                                    <Input type="select" value={payType} id="typelist" onChange={e => setPayType(e.target.value)} >
                                        {
                                            parseInt(item.forma_pago) !== 0 ?
                                                <option value={0}>Efectivo</option> : null
                                        }
                                        {
                                            parseInt(item.forma_pago) !== 1 ?
                                                <option value={1}>Mercado Pago</option> : null
                                        }
                                        {
                                            parseInt(item.forma_pago) !== 2 ?
                                                <option value={2}>Débito</option> : null
                                        }
                                        {
                                            parseInt(item.forma_pago) !== 3 ?
                                                <option value={3}>Crédito</option> : null
                                        }
                                        {
                                            parseInt(item.forma_pago) !== 6 ?
                                                <option value={6}>Cheque</option> : null
                                        }
                                        {
                                            parseInt(item.forma_pago) !== 7 ?
                                                <option value={7}>Transferencia</option> : null
                                        }

                                        {
                                            parseInt(item.t_fact) >= 0 ?
                                                parseInt(item.forma_pago) !== 4 ?
                                                    item.n_doc_cliente.length > 5 ?
                                                        <option value={4}>Cuenta Corriente</option>
                                                        : null : null : null
                                        }
                                    </Input>
                                </FormGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Row>
                                    <Col md="6">
                                        <button style={{ width: "130px", margin: "15px" }} className="btn btn-primary">
                                            Actualizar
                                        </button>
                                    </Col>
                                    <Col md="6">
                                        <button
                                            style={{ width: "130px", margin: "15px" }}
                                            className="btn btn-danger"
                                            onClick={e => {
                                                e.preventDefault()
                                                setModal(false)
                                            }}
                                            disabled={parseFloat(item.monto_pago_cta_cte) === 0 ? false : true}
                                        >
                                            Cancelar
                                        </button>
                                    </Col>
                                </Row>
                            </ModalFooter>
                        </>
                }
            </Form>
        </Modal>
    )
}

export default ModalChangeType