import React, { useEffect, useState } from 'react';
import { Col, Form, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ListadoTable from '../ListadoTable';
import FilaPrecio from './FilaPrecio';

const titulos = ["Tipo de precio", "($) Venta"]

const ModalVerPrecios = ({
    modal,
    setModal,
    item
}) => {
    const [precios, setPrecios] = useState(<tr><td>No hay precios agregados</td></tr>)

    const getPrices = async () => {
        setPrecios(<>
            <FilaPrecio
                key={0}
                id={0}
                item={{
                    type_price_name: "Minorista",
                    sell_price: item.minorista
                }}
                muestra={true}
            />
            <FilaPrecio
                key={1}
                id={1}
                item={{
                    type_price_name: "Mayorista 1",
                    sell_price: item.mayorista_1
                }}
                muestra={true}
            />
            <FilaPrecio
                key={2}
                id={2}
                item={{
                    type_price_name: "Mayorista 2",
                    sell_price: item.mayorista_2
                }}
                muestra={true}
            />
            <FilaPrecio
                key={3}
                id={3}
                item={{
                    type_price_name: "Mayorista 3",
                    sell_price: item.mayorista_3
                }}
                muestra={true}
            />
            <FilaPrecio
                key={4}
                id={4}
                item={{
                    type_price_name: "Revendedor",
                    sell_price: item.revendedor
                }}
                muestra={true}
            />
            <FilaPrecio
                key={5}
                id={5}
                item={{
                    type_price_name: "Supermercado",
                    sell_price: item.supermercado
                }}
                muestra={true}
            />
        </>)
    }

    useEffect(() => {
        if (modal) {
            getPrices()
        }
        // eslint-disable-next-line 
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
            }}>

                <ModalHeader toggle={() => setModal(!modal)}>
                    Precios
                </ModalHeader>
                <ModalBody>
                    <Row style={{ marginTop: "20px" }}>
                        <Col md="12">
                            <ListadoTable
                                titulos={titulos}
                                listado={precios}
                            />
                        </Col>
                    </Row>
                </ModalBody>
            </Form>
        </Modal>
    )
}

export default ModalVerPrecios