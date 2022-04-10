import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, ModalHeader, FormGroup, Input, Label, ModalBody, Form } from 'reactstrap';
import ListadoTable from '../Listados/ListadoTable';
import FilaPrecio from '../Listados/SubComponentes/FilaPrecio';

const titulos = ["Tipo de precio", "(%) Ganancia", "($) Venta", "Cant. Min.", ""]

const PreciosProducto = ({
    costo,
    listaPrecios,
    setListaPrecios
}) => {
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [venta, setVenta] = useState(0)
    const [porcVta, setPorcVta] = useState(0)
    const [roundBool, setRoundBool] = useState(false)
    const [round, setRound] = useState(0)
    const [cantMin, setCantMin] = useState(0)
    const [tipoPrecio, setTipoPrecio] = useState("")
    const [listado, setListado] = useState(<tr><td>No hay precios agregados</td></tr>)
    const toggleModal1 = () => {
        setModal1(!modal1)
    }
    const toggleModal2 = () => {
        setModal2(!modal2)
    }

    const calculoVta = () => {
        if (costo > 0 && porcVta > 0) {
            if (roundBool) {
                let ventaFinal = (costo * ((porcVta / 100) + 1))
                ventaFinal = ventaFinal * 100
                ventaFinal = parseInt(Math.round(ventaFinal / round))
                ventaFinal = ventaFinal / 100
                ventaFinal = (ventaFinal * round)
                setVenta(ventaFinal)
            } else {
                let ventaFinal = (costo * ((porcVta / 100) + 1))
                ventaFinal = Math.round(ventaFinal * 100)
                ventaFinal = ventaFinal / 100
                setVenta(ventaFinal)
            }
        } else {
            setVenta(0)
        }
    }

    const newItem = () => {
        setListaPrecios(listaPrecios => [...listaPrecios, {
            type_price_name: tipoPrecio,
            percentage_sell: porcVta,
            sell_price: venta,
            min: cantMin,
            round: round,
            roundBool: roundBool,
            buy_price: costo
        }])
        document.getElementById("precioVtaTxt").focus()
        document.getElementById("precioVtaTxt").select()
    }

    useEffect(() => {
        calculoVta()
        // eslint-disable-next-line
    }, [roundBool, round, costo, porcVta])

    useEffect(() => {
        if (roundBool) {
            setRound(100)
        } else {
            setRound(0)
        }
        // eslint-disable-next-line
    }, [roundBool])

    useEffect(() => {
        if (listaPrecios.length > 0) {
            setListado(
                listaPrecios.map((item, key) => {
                    return (
                        <FilaPrecio
                            key={key}
                            id={key}
                            item={item}
                            listaPrecios={listaPrecios}
                            setListaPrecios={setListaPrecios}
                        />
                    )
                })
            )
        } else {
            setListado(
                <tr><td>No hay precios agregados</td></tr>
            )
        }
        // eslint-disable-next-line 
    }, [listaPrecios])

    return (
        <Form id="modal-precios-form">
            <Col style={{ border: "1px solid #8898aa", marginTop: "15px", marginBottom: "15px", paddingTop: "10px", paddingInline: "25px", borderRadius: "5px" }} >
                <Row >
                    <Col md="12">
                        <Row>
                            <h2>Precios</h2>
                            <Button
                                color={"primary"}
                                style={{ marginLeft: "15px" }}
                                onClick={e => {
                                    e.preventDefault()
                                    toggleModal2()
                                }}
                            > Nuevo Precio</ Button>
                        </Row>
                    </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                    <Col md="12">
                        <ListadoTable
                            titulos={titulos}
                            listado={listado}
                        />
                    </Col>
                </Row>
            </Col>

            <Modal
                isOpen={modal2}
                toggle={toggleModal2}
                size={"lg"}
            >
                <ModalHeader toggle={toggleModal1}>Nuevo Precio</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="8" >
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="precioVtaTxt"
                                >
                                    Tipo de Precio
                                </label>
                                <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={tipoPrecio} onChange={e => setTipoPrecio(e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                >
                                    Cant. Mínima
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    placeholder="Costo del producto..."
                                    type="number"
                                    style={{ fontSize: "25px" }}
                                    value={cantMin}
                                    onChange={e => setCantMin(e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="4">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-username"
                                >
                                    Porc. Ganancia (%)
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-username"
                                    placeholder="% venta..."
                                    type="number"
                                    style={{ fontSize: "25px" }}
                                    value={porcVta}
                                    onChange={e => {
                                        setPorcVta(e.target.value)
                                    }}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4" >
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="precioVtaTxt"
                                >
                                    Precio de venta
                                </label>
                                <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={venta} onChange={e => setVenta(e.target.value)} />
                            </FormGroup>
                        </Col>
                        <Col lg="4">
                            <FormGroup>
                                <FormGroup check>
                                    <Label check>
                                        <Input style={{ fontSize: "20px" }} type="checkbox" checked={roundBool} onChange={e => setRoundBool(e.target.checked)} />{' '}
                                        <span style={{ fontSize: "20px" }} >Redondear</span>
                                    </Label>
                                    {
                                        roundBool ?
                                            <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setRound(e.target.value)} value={round}  >
                                                <option value={100} >1,00</option>
                                                <option value={1000} >10,00</option>
                                                <option value={10000} >100,00</option>
                                            </Input> : null
                                    }
                                </FormGroup>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" style={{ textAlign: "center" }}>
                            <Button color="primary" onClick={e => {
                                e.preventDefault()
                                newItem()
                            }}>
                                Agregar Precio
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Form>
    )
}

export default PreciosProducto