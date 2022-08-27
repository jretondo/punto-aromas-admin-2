import UrlNodeServer from 'api/NodeServer';
import axios from 'axios';
import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import FilaPrecioSelect from 'components/subComponents/Listados/SubComponentes/FilaPrecioSelect';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import swal from 'sweetalert';
import productsSellContext from '../../../../../../context/productsSell';

const ModalPricesCant = ({
    text,
    modal,
    toggle,
    cantProd,
    clienteData,
    setCantProd,
    setProdText,
    clienteBool
}) => {
    const [listPrices, setListPrices] = useState(<tr><td>No hay precios asociados</td></tr>)
    const { NewProdSell } = useContext(productsSellContext)
    const [cant, setCant] = useState(cantProd)
    const [prices, setPrices] = useState([])
    const [dataProd, setDataProd] = useState([])
    const [revProd, setRevProd] = useState(0)

    const addProduct = useCallback((data, cant, idPrice, precioRevende) => {
        NewProdSell(data, cant, idPrice, precioRevende)
        toggle()
    }, [NewProdSell, toggle])

    const FindProd = async () => {
        await axios.get(UrlNodeServer.productsDir.products + `/1?query=${text}&cantPerPage=1&forSell=1`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(async res => {
                const respuesta = res.data
                const status = respuesta.status
                if (status === 200) {
                    const data = respuesta.body.data[0]
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

                    if (pricesData.length === 0) {
                        swal("Error con los precios", "Este producto no tiene precios asociados! Controlelo.", "error")
                    } else if (pricesData.length === 1) {
                        addProduct(data, cant, pricesData, 0)
                    } else {
                        if (clienteData.price_default && parseInt(clienteBool) === 1) {
                            const price = pricesData.filter(item => item.type_price_name === clienteData.price_default)


                            if (price.length > 0) {
                                const precioRevende = data.revendedor
                                if (parseFloat(precioRevende) === 0) {
                                    swal("Producto sin comisión!", "Este producto no posee precio de reventa! Lo que no dejará ninguna comisión!", "info")
                                }
                                setDataProd(data)
                                setPrices(pricesData)
                                setRevProd(precioRevende)
                                addProduct(data, cant, price[0], data.revendedor)
                            } else {
                                const precioRevende = data.revendedor
                                if (parseFloat(precioRevende) === 0) {
                                    swal("Producto sin comisión!", "Este producto no posee precio de reventa! Lo que no dejará ninguna comisión!", "info")
                                }
                                setDataProd(data)
                                setPrices(pricesData)
                                setRevProd(precioRevende)
                                addProduct(data, cant, pricesData[0], data.revendedor)
                            }
                        } else {
                            const precioRevende = data.revendedor
                            if (parseFloat(precioRevende) === 0) {
                                swal("Producto sin comisión!", "Este producto no posee precio de reventa! Lo que no dejará ninguna comisión!", "info")
                            }
                            setDataProd(data)
                            setPrices(pricesData)
                            setRevProd(precioRevende)
                            const price = pricesData.filter(item => item.type_price_name === "mayorista_1")
                            if (price.length > 0) {
                                addProduct(data, cant, price[0], data.revendedor)
                            }
                        }
                    }
                } else {
                    swal("Error!", "Hubo un error. Controle que haya colocado un número válido!", "error");
                }
            }).catch((err) => {
                swal("Error!", "Hubo un error: " + err.message, "error");
            }).finally(() => setProdText(""))
    }

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
                        addToCart={addProduct}
                        precioRevende={revProd}
                    />
                )
            })
        )
    }, [dataProd, prices, cant, revProd, addProduct, clienteData, toggle])

    useEffect(() => {
        if (modal) {
            FindProd()
        }
        // eslint-disable-next-line
    }, [modal, text, clienteData])

    useEffect(() => {
        setCant(cantProd)
    }, [cantProd])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Precios de {text}
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
                                setCantProd(e.target.value)
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

            </ModalFooter>
        </Modal>
    )

}

export default ModalPricesCant