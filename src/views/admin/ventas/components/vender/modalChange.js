import formatMoney from 'Function/NumberFormat';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import productsSellContext from '../../../../../context/productsSell';

const ModalChange = ({
    modal,
    toggle
}) => {
    const { totalPrecio } = useContext(productsSellContext)
    const [abona, setAbona] = useState(0)
    const [total, setTotal] = useState(totalPrecio)

    useEffect(() => {

        setTimeout(() => {
            try {
                document.getElementById("abonaCon").select()
            } catch (error) {

            }
        }, 300);
        setTotal(totalPrecio)
        // eslint-disable-next-line
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Cambio de Efectivo</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="6" style={{ margin: "auto" }}>
                        <FormGroup>
                            <Label >TOTAL</Label>
                            <Input style={{ textAlign: "right", fontSize: "20px" }} type="text" value={"$ " + formatMoney(total)} disabled />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="6" style={{ margin: "auto" }}>
                        <FormGroup>
                            <Label for="abonaCon">ABONA CON</Label>
                            <Input id="abonaCon" style={{ textAlign: "right", fontSize: "20px" }} type="number" value={abona} onChange={e => setAbona(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col md="6" style={{ margin: "auto" }}>
                        <FormGroup>
                            <Label >CAMBIO</Label>
                            <Input style={{ textAlign: "right", fontSize: "20px" }} type="text" value={"$ " + formatMoney(abona - total)} disabled />
                        </FormGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="danger" onClick={toggle}>Salir</Button>
            </ModalFooter>
        </Modal>
    )
}

export default ModalChange