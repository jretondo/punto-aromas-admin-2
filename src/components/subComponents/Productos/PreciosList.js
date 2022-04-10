import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const PreciosListProd = ({
    modal,
    toggleModal
}) => {

    const getPricesList = () => {

    }

    return (<Modal
        isOpen={modal}
        toggle={toggleModal}
        size={"lg"}
    >
        <ModalHeader toggle={toggleModal}>Nuevo Precio</ModalHeader>
        <ModalBody>

        </ModalBody>
    </Modal>)
}

export default PreciosListProd