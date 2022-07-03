import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import ListadoTable from '../ListadoTable';
import FilaPrecioSelect from './FilaPrecioSelect';

const ModalChangePrice = ({
    modal,
    toggle,
    item,
    modifyPrice
}) => {
    const [listPrices, setListPrices] = useState(<tr><td>No hay precios asociados</td></tr>)
    const [cant, setCant] = useState(item.cant_prod)
    const [prices, setPrices] = useState([])
    const [dataProd, setDataProd] = useState([])
    const [revProd, setRevProd] = useState(0)

    const pricesList = () => {

        const data = item
        let pricesData = []
        if (parseFloat(data.minorista) > 0) {
            pricesData.push({
                type_price_name: "minorista",
                sell_price: data.minorista
            })
        }
        if (parseFloat(data.mayorista_1) > 0) {
            pricesData.push({
                type_price_name: "mayorista_1",
                sell_price: data.mayorista_1
            })
        }
        if (parseFloat(data.mayorista_2) > 0) {
            pricesData.push({
                type_price_name: "mayorista_2",
                sell_price: data.mayorista_2
            })
        }
        if (parseFloat(data.mayorista_3) > 0) {
            pricesData.push({
                type_price_name: "mayorista_3",
                sell_price: data.mayorista_3
            })
        }
        if (parseFloat(data.revendedor) > 0) {
            pricesData.push({
                type_price_name: "revendedor",
                sell_price: data.revendedor
            })
        }
        if (parseFloat(data.supermercado) > 0) {
            pricesData.push({
                type_price_name: "supermercado",
                sell_price: data.supermercado
            })
        }

        const precioRevende = data.revendedor

        setDataProd(data)
        setPrices(pricesData)
        setRevProd(precioRevende)
    }

    useEffect(() => {
        if (modal) {
            pricesList()
        }
        // eslint-disable-next-line
    }, [modal])

    useEffect(() => {
        setListPrices(
            // eslint-disable-next-line 
            prices.map((item, key) => {
                return (
                    <FilaPrecioSelect
                        key={key}
                        id={key}
                        item={item}
                        data={dataProd}
                        cant={cant}
                        addToCart={false}
                        precioRevende={revProd}
                        modifyPrice={modifyPrice}
                        toggle={toggle}
                    />
                )
            })
        )
    }, [dataProd, prices, cant, revProd, toggle, modifyPrice])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Cambiar Precio
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col>
                        <FormGroup>
                            <Label>
                                Cantidad de Producto
                            </Label>
                            <Input type="number" min={1} required value={cant} onChange={e => {
                                setCant(e.target.value)
                            }} />
                        </FormGroup>
                    </Col>
                </Row>
                <ListadoTable
                    titulos={["Tipo de Precio", "Precio", ""]}
                    listado={listPrices}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={(e) => {
                    e.preventDefault()
                    toggle()
                }}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalChangePrice