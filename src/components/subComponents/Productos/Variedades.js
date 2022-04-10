import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Row, ModalHeader, FormGroup, Input, ModalBody } from 'reactstrap';
import ListadoTable from '../Listados/ListadoTable';
import FilaVariedad from '../Listados/SubComponentes/FilaVariedad';

const titulos = ["Variedad", "Cód. Barra", ""]

const VariedadesProd = ({
    listaVar,
    setListaVar
}) => {
    const [modal1, setModal1] = useState(false)
    const [codBarra, setCodBarra] = useState("")
    const [variedad, setVariedad] = useState("")
    const [listado, setListado] = useState(<tr><td>No hay variedades agregadas</td></tr>)
    const toggleModal1 = () => {
        setModal1(!modal1)
    }

    const newItem = () => {
        setListaVar(listaVar => [...listaVar, {
            cod_barra: codBarra,
            variedad: variedad,
        }])
    }

    useEffect(() => {
        if (listaVar.length > 0) {
            setListado(
                listaVar.map((item, key) => {
                    return (
                        <FilaVariedad
                            key={key}
                            id={key}
                            item={item}
                            setListaVar={setListaVar}
                        />
                    )
                })
            )
        } else {
            setListado(
                <tr><td>No hay variedades agregadas</td></tr>
            )
        }
        // eslint-disable-next-line 
    }, [listaVar])

    return (
        <>
            <Col style={{ border: "1px solid #8898aa", marginTop: "15px", marginBottom: "15px", paddingTop: "10px", paddingInline: "25px", borderRadius: "5px" }} >
                <Row >
                    <Col md="12">
                        <Row>
                            <h2>Variedades</h2>
                            <Button
                                color={"primary"}
                                style={{ marginLeft: "15px" }}
                                onClick={e => {
                                    e.preventDefault()
                                    toggleModal1()
                                }}
                            > Nueva Variedad</ Button>
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
                isOpen={modal1}
                toggle={toggleModal1}
                size={"lg"}
            >
                <ModalHeader toggle={toggleModal1}>Nuevo Precio</ModalHeader>
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
                                <Input placeholder="Variedad..." style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={variedad} onChange={e => setVariedad(e.target.value)} />
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
                                newItem()
                            }}>
                                Agregar Variedad
                            </Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </>
    )
}

export default VariedadesProd