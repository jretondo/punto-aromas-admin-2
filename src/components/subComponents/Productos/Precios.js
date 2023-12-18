import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, ModalHeader, FormGroup, Input, Label, ModalBody } from 'reactstrap';
import swal from 'sweetalert';
import ListadoTable from '../Listados/ListadoTable';
import FilaPrecio from '../Listados/SubComponentes/FilaPrecio';

const titulos = ["Tipo de precio", "($) Venta", "Cant. Min.", ""]

const PreciosProducto = ({
    costo,
    listaPrecios,
    setListaPrecios,
    preciosList
}) => {
    const [preciosDisp, setPreciosDisp] = useState(preciosList)
    const [optionPlant, setOptionPlant] = useState(<></>)
    const [modal2, setModal2] = useState(false)
    const [venta, setVenta] = useState(0)
    const [porcVta, setPorcVta] = useState(0)
    const [roundBool, setRoundBool] = useState(false)
    const [cantMin, setCantMin] = useState(1)
    const [round, setRound] = useState(0)
    const [tipoPrecio, setTipoPrecio] = useState("")
    const [listado, setListado] = useState(<tr><td>No hay precios agregados</td></tr>)

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

        if (tipoPrecio) {
            const newDisp = preciosDisp.filter(item => item.type !== tipoPrecio.type)
            setPreciosDisp(() => newDisp)
            setListaPrecios(listaPrecios => [...listaPrecios, {
                type_price_name: tipoPrecio.type,
                sell_price: venta,
                order: tipoPrecio.order,
                porcVta: porcVta,
                round: round,
                roundBool: roundBool,
                cant_min: cantMin
            }])
        } else {
            swal("Precios", "No hay más precios disponibles para agregar", "error")
        }

    }

    const disponibles = () => {
        let disponible = preciosList
        // eslint-disable-next-line
        listaPrecios.map((item, key) => {
            disponible = disponible.filter(item2 => item2.order !== item.order)
            if (key === listaPrecios.length - 1) {
                setPreciosDisp(() => disponible)
            }
        })
    }

    const recalcular = () => {
        if (listaPrecios.length > 0) {
            let preciosNvos = []
            // eslint-disable-next-line
            listaPrecios.map((item, key) => {
                let valueRound = 1
                if (parseInt(item.round) > 0) {
                    valueRound = parseInt(item.round)
                }
                const newPrice = (Math.round((costo * (1 + (item.porcVta / 100))) * (100 / valueRound))) / (100 / valueRound)
                preciosNvos.push({
                    type_price_name: item.type_price_name,
                    sell_price: newPrice,
                    order: item.order,
                    porcVta: item.porcVta,
                    round: item.round,
                    roundBool: item.roundBool,
                    cant_min: cantMin
                })
                if (key === listaPrecios.length - 1) {
                    setListaPrecios(() => preciosNvos)
                }
            })
        } else {
            swal("Error!", "No hay precios listados para recalcular! Cargue nuevos precios de venta para p¡oder recalcular.", "error")
        }
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
        if (preciosDisp.length > 0) {
            setOptionPlant(
                preciosDisp.map((item, key) => {
                    if (key === 0) {
                        setTipoPrecio(item)
                    }
                    return (<option key={key} value={JSON.stringify(item)}>{item.type}</option>)
                })
            )
        } else {
            setTipoPrecio(false)
            setOptionPlant(<></>)
        }

    }, [preciosDisp])

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
                            preciosDisp={preciosDisp}
                            setPreciosDisp={setPreciosDisp}
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

    useEffect(() => {
        disponibles()
        // eslint-disable-next-line
    }, [listaPrecios])

    return (<>

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
                        <Button
                            color={"warning"}
                            style={{ marginLeft: "15px" }}
                            onClick={e => {
                                e.preventDefault()
                                recalcular()
                            }}
                        > Recalcular Precios</ Button>
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
            <ModalHeader toggle={toggleModal2}>Nuevo Precio</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="6" >
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="precioVtaTxt"
                            >
                                Tipo de Precio
                            </label>
                            <Input required style={{ fontSize: "20px" }} type="select" id="precioVtaTxt" value={JSON.stringify(tipoPrecio)} onChange={e => setTipoPrecio(JSON.parse(e.target.value))}>
                                {optionPlant}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col lg="6">
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
                                min={1}
                                step={1}
                                style={{ fontSize: "25px" }}
                                value={porcVta}
                                onChange={e => {
                                    setPorcVta(e.target.value)
                                }}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="4" >
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="precioVtaTxt"
                            >
                                Precio de venta
                            </label>
                            <Input style={{ fontSize: "25px" }} min={0.01} step={0.01} type="text" id="precioVtaTxt" value={venta} onChange={e => setVenta(e.target.value)} />
                        </FormGroup>
                    </Col>
                    {
                        parseInt(tipoPrecio.order) > 0 && parseInt(tipoPrecio.order) < 4 ?
                            <Col md="4" >
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="precioVtaTxt"
                                    >
                                        Cant. Min.
                                    </label>
                                    <Input style={{ fontSize: "25px" }} min={0} step={1} type="text" id="precioVtaTxt" value={cantMin} onChange={e => setCantMin(e.target.value)} />
                                </FormGroup>
                            </Col> : null
                    }

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
    </>
    )
}

export default PreciosProducto