import UrlNodeServer from 'api/NodeServer';
import axios from 'axios';
import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import FilaPrecioSelect from 'components/subComponents/Listados/SubComponentes/FilaPrecioSelect';
import React, { useContext, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import swal from 'sweetalert';
import productsSellContext from '../../../../../../context/productsSell';

const ModalPricesCant = ({
    text,
    modal,
    toggle,
    cantProd,
    setCantProd
}) => {
    const [listPrices, setListPrices] = useState(<tr><td>No hay precios asociados</td></tr>)

    const { NewProdSell } = useContext(productsSellContext)

    const addProduct = (data, cant, idPrice) => {
        NewProdSell(data, cant, idPrice)
        toggle()
    }

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
                    const prices = respuesta.body.prices
                    if (prices.length === 0) {
                        swal("Error con los precios", "Este producto no tiene precios asociados! Controlelo.", "error")
                    } else if (prices.length === 1) {
                        addProduct(data, cantProd, prices[0].id)
                    } else {
                        setListPrices(
                            // eslint-disable-next-line 
                            prices.map((item, key) => {
                                return (
                                    <FilaPrecioSelect
                                        key={key}
                                        id={key}
                                        item={item}
                                        data={data}
                                        cant={cantProd}
                                        addToCart={addProduct}
                                    />
                                )
                            })
                        )
                    }
                } else {
                    swal("Error!", "Hubo un error. Controle que haya colocado un número válido!", "error");
                }
            }).catch((err) => {
                swal("Error!", "Hubo un error: " + err.message, "error");
            })
    }

    useEffect(() => {
        if (modal) {
            FindProd()
        }
        // eslint-disable-next-line
    }, [modal, text])

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
                            <Input type="number" min={1} required value={cantProd} onChange={e => setCantProd(e.target.value)} />
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