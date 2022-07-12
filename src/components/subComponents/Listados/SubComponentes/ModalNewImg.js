import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Modal, ModalBody, ModalHeader, Row, Spinner } from 'reactstrap';
import ImagenesForm from 'components/subComponents/Productos/ImagenesForm';
import swal from 'sweetalert';

const ModalNewImage = ({
    modal,
    setModal,
    item
}) => {
    const [loading, setLoading] = useState(false)
    const [listaImgNvas, setListaImgNvas] = useState([])
    const [plantNvasImg, setPlantNvasImg] = useState(<></>)
    const [listaImgEliminadas, setListaImgEliminadas] = useState([])

    const getImages = useCallback(async () => {
        setLoading(true)
        await axios.get(UrlNodeServer.productsDir.sub.images + "/" + item.id_prod, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const imagesList = respuesta.body
                if (imagesList.length > 0) {
                    let imagenes = []
                    // eslint-disable-next-line
                    imagesList.map((item, key) => {
                        if (item.url_img !== "") {
                            imagenes.push([item.url_img, item.id_img])
                        }
                        if (key === imagesList.length - 1) {
                            setListaImgNvas(imagenes)
                        }
                    })
                }
            } else {

            }
        }).catch((error) => {
            console.log('error :>> ', error);
        }).finally(() => {
            setLoading(false)
        })
    }, [item.id_prod])

    const subirImg = async () => {
        setLoading(true)
        let formData = new FormData();
        const typeSend = "PUT"
        formData.append("id_prod", item.id_prod);
        if (listaImgEliminadas.length > 0) {
            // eslint-disable-next-line
            listaImgEliminadas.map(imagen => {
                formData.append("imagenEliminada", imagen);
            })
        }
        if (listaImgNvas.length > 0) {
            await new Promise((resolve, reject) => {
                // eslint-disable-next-line
                listaImgNvas.map((img, key) => {
                    fetch(listaImgNvas[key][0])
                        .then(res => res.blob())
                        .then(blob => {
                            const fileImg = new File([blob], `${item.name}${key}.jpg`, {
                                type: 'image/jpeg'
                            });
                            if (parseInt(listaImgNvas[key][1]) === 0) {
                                formData.append("product", fileImg, `${item.name}${key}.jpg`);
                            }
                            if (key === listaImgNvas.length - 1) {
                                resolve()
                            }
                        })
                })
            })
        }

        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: typeSend,
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            });
            return response;
        }
        postData(UrlNodeServer.productsDir.sub.images, formData)
            .then(async data => {
                let respuesta = await data.json()
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    swal("Imagenes cargadas!", "Las imagenes ya se encuentran en el servidor!", "success");
                } else {
                    swal("Error", "Hubo un error inesperado!", "error");
                }
            }).catch((error) => {
                swal("Error", "Hubo el siguiente error: " + error.toString(), "error");
            }).finally(() => {
                setLoading(false)
                setTimeout(() => {
                    setModal(false)
                }, 700);
            })
    }

    useEffect(() => {
        getImages()
    }, [getImages, modal])

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                Nuevas Imágenes - {item.name}
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <ImagenesForm
                                        listaImgNvas={listaImgNvas}
                                        setListaImgNvas={setListaImgNvas}
                                        plantNvasImg={plantNvasImg}
                                        setPlantNvasImg={setPlantNvasImg}
                                        detallesBool={true}
                                        listaImgEliminadas={listaImgEliminadas}
                                        setListaImgEliminadas={setListaImgEliminadas}
                                        nvaOffer={false}
                                        copiarDet={false}
                                        setCopiarDet={false}
                                    />
                                </Row>
                                <Row>
                                    <Col md="12" style={{ textAlign: "center" }}>
                                        <Button color="primary" onClick={e => {
                                            e.preventDefault()
                                            subirImg()
                                        }}>
                                            Aplicar Cambios
                                        </Button>
                                    </Col>
                                </Row>
                            </ModalBody>
                        </>
                }
            </Form>
        </Modal>
    )
}

export default ModalNewImage