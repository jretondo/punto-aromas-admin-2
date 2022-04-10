import React from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Label,
} from "reactstrap";
import PreciosProducto from './Precios';
import VariedadesProd from './Variedades';

const InfoForm = ({
    nombreNvo,
    setNombreNvo,
    costo,
    setCosto,
    unidad,
    setUnidad,
    listaPrecios,
    setListaPrecios,
    listaVar,
    setListaVar,
    detallesBool,
    codBarras,
    setCodBarras
}) => {

    return (
        <>
            <Row>
                <Col lg={detallesBool ? 5 : 6}>
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Nombre
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Nombre del Producto..."
                            type="text"
                            value={nombreNvo}
                            onChange={e => setNombreNvo(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                {
                    detallesBool ?
                        <Col md="3">
                            <FormGroup>
                                <Label>
                                    Cód. de Barras
                                </Label>
                                <Input value={codBarras} onChange={e => setCodBarras(e.target.value)} type="text" />
                            </FormGroup>
                        </Col> : null
                }
                <Col md={detallesBool ? 2 : 3}>
                    <FormGroup>
                        <Label>
                            Costo
                        </Label>
                        <Input value={costo} onChange={e => setCosto(e.target.value)} type="number" />
                    </FormGroup>
                </Col>
                <Col lg={detallesBool ? 2 : 3}>
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="unidadesTxt"
                        >
                            Venta por:
                        </label>
                        <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setUnidad(e.target.value)} value={unidad}  >
                            <option value={0} >Unidad</option>
                            <option value={1} >kilogramos</option>
                            <option value={2} >Litros</option>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            <PreciosProducto
                costo={costo}
                listaPrecios={listaPrecios}
                setListaPrecios={setListaPrecios}
            />
            {
                detallesBool ? null :
                    <VariedadesProd
                        listaVar={listaVar}
                        setListaVar={setListaVar}
                    />
            }
        </>
    )
}

export default InfoForm