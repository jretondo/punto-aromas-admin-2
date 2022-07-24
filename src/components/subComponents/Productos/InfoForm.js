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
    codProd,
    setCodProd,
    preciosList
}) => {

    return (
        <>
            <Row>
                <Col lg={4}>
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
                <Col md="3">
                    <FormGroup>
                        <Label>
                            Córdigo
                        </Label>
                        <Input
                            type="text"
                            value={codProd}
                            onChange={e => setCodProd(e.target.value)}
                            placeholder="Código del Producto..."
                            className="form-control-alternative"
                        />
                    </FormGroup>

                </Col>
                <Col md={2}>
                    <FormGroup>
                        <Label>
                            Costo
                        </Label>
                        <Input value={costo} onChange={e => setCosto(e.target.value)} type="number" />
                    </FormGroup>
                </Col>
                <Col lg={3}>
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
                preciosList={preciosList}
            />

            <VariedadesProd
                listaVar={listaVar}
                setListaVar={setListaVar}
            />
        </>
    )
}

export default InfoForm