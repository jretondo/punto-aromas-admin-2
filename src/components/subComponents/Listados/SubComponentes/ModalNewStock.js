import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap'

const ModalNewStock = ({
    modal,
    setModal,
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
    call
}) => {

    const [loading, setLoading] = useState(false)
    const [nvoStock, setNvoStock] = useState(1)
    const [stockAct, setStockAct] = useState(0)
    const [stockTotal, setStockTotal] = useState(0)
    const [ptoVta, setPtoVta] = useState({ id: 0 })
    const [plantPtosVta, setPlantPtosVta] = useState(<></>)
    const [costo, setCosto] = useState(item.precio_compra)
    const [venta, setVenta] = useState(item.porc_minor)
    const [roundBool, setRoundBool] = useState(parseInt(item.round) > 0 ? true : false)
    const [round, setRound] = useState(parseInt(item.round) > 0 ? parseInt(item.round) : 100)

    useEffect(() => {
        ListaPV()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        reset()
        ListaPV()
        // eslint-disable-next-line
    }, [modal])

    useEffect(() => {
        if (modal) {
            StockActualLista()
        }
        // eslint-disable-next-line
    }, [ptoVta, modal])

    useEffect(() => {
        if (modal && !loading) {
            selectElement()
        }
    }, [modal, loading])

    useEffect(() => {
        ActualizaTotalNvo()
        // eslint-disable-next-line
    }, [nvoStock, stockAct])

    const selectElement = () => {
        setTimeout(() => {
            try {
                document.getElementById("nvoStockTxt").focus();
                document.getElementById("nvoStockTxt").select();
            } catch (error) {

            }
        }, 200);
    }


    const ListaPV = async () => {
        setLoading(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body.data

                    setPlantPtosVta(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={JSON.stringify(item)}>{item.direccion + " (PV: " + item.pv + ")"}</option>
                            )
                        })
                    )
                } else {
                    setPlantPtosVta(<></>)
                }
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const StockActualLista = async () => {
        const query = `?idProd=${item.id_prod}&idPv=${ptoVta.id}`
        await axios.get(`${UrlNodeServer.stockDir.stock}${query}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body
                    setStockAct(resultado[0].stock)
                } else {
                    setStockAct(0)
                }
            })
            .catch(() => {
            })
    }

    const ActualizaTotalNvo = () => {
        setStockTotal(parseInt(stockAct) + parseInt(nvoStock))
    }

    const NvoStockFunct = async () => {
        const data = {
            idProd: item.id_prod,
            pv_id: ptoVta.id,
            nvoStockSingle: nvoStock,
            obs: "Nuevo Stock",
            costo: costo,
            iva: item.iva,
            vta_fija: item.vta_fija,
            vta_price: item.vta_price,
            round: roundBool ? round : 0,
            porc_minor: venta,
            precio_compra: costo
        }
        setLoading(true)
        await axios.post(UrlNodeServer.stockDir.stock, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setActividadStr("El usuario ha agregado " + nvoStock + " de stock al producto de ID " + item.id_prod + " en el PV " + ptoVta.id)
                    setNvaActCall(!nvaActCall)
                    setMsgStrong("Stock actualizado con éxito! ")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setModal(false)
                    setTimeout(() => {
                        setCall(!call)
                    }, 500);
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("No se pudo eliminar el producto.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setLoading(false)
                setMsgStrong("Hubo un error! ")
                setMsgGralAlert("No se pudo eliminar el producto.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const reset = () => {
        setLoading(false)
        setNvoStock(1)
        setPtoVta({ id: 0 })
        setPlantPtosVta(<></>)
        setCosto(item.precio_compra)
        setVenta(item.porc_minor)
        setRoundBool(parseInt(item.round) > 0 ? true : false)
        setRound(parseInt(item.round) > 0 ? parseInt(item.round) : 100)
    }

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
                NvoStockFunct(e)
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                <h2>Nuevo Stock</h2>
                                <h2>{item.name} - <span style={{ color: "green" }} >Stock Actual: {stockAct}</span> </h2>
                                <Row>
                                    <Col lg="12">
                                        <FormGroup>
                                            <Input
                                                className="form-control-alternative"
                                                placeholder="Nombre del Producto..."
                                                type="select"
                                                onChange={e => setPtoVta(JSON.parse(e.target.value))}
                                            >
                                                <option value={JSON.stringify({ id: 0 })}>Deposito</option>
                                                {plantPtosVta}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col md="4" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="nvoStockTxt"
                                            >
                                                Stock a agregar
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="nvoStockTxt"
                                                placeholder="Cantidad..."
                                                type="number"
                                                min={1}
                                                step={1}
                                                value={nvoStock}
                                                onChange={e => setNvoStock(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="3" >
                                        <FormGroup >
                                            <Input type="select" id="unidadesTxt" value={item.unidad} style={{ marginTop: "30px" }} disabled >
                                                <option value={0} >Unidades</option>
                                                <option value={1} >kilogramos</option>
                                                <option value={2} >Litros</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md="2" style={{ textAlign: "center" }} >
                                        <i style={{ marginTop: "35px", fontSize: "30px" }} className="fas fa-arrow-right"></i>
                                    </Col>
                                    <Col md="3" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Nuevo Stock
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-username"
                                                placeholder="Cantidad..."
                                                type="number"
                                                value={stockTotal}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
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

export default ModalNewStock