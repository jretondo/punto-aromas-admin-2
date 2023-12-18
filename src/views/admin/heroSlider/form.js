import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import UrlNodeServer from '../../../api/NodeServer';
import InputSearch from '../../../components/customInputs/InputSearch';

const FormHeroSlider = ({
    setIsOpenForm,
    setIsLoading
}) => {
    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    const [tag, setTag] = useState("")
    const [subcategory, setSubcategory] = useState("")
    const [type, setType] = useState(0)
    const [tagList, setTagList] = useState([])
    const [subcategoryList, setSubcategoryList] = useState([])
    const [imgUrl, setImgUrl] = useState()

    const getTags = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.getTags, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const data = respuesta.body
                setTagList(data)
            } else {

            }
        }).catch((error) => {
            setTagList([])
        }).finally(() => {
        })
    }

    const getSubcategories = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.marcas, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const data = respuesta.body
                setSubcategoryList(data)
            } else {

            }
        }).catch((error) => {
            setSubcategoryList([])
        }).finally(() => {
        })
    }

    const tagSearchFn = (tag, searchedText) => {
        if ((tag.tag).toLowerCase().includes(searchedText.toLowerCase())) {
            return tag
        }
    }

    const categorySearchFn = (category, searchedText) => {
        if ((category.category).toLowerCase().includes(searchedText.toLowerCase())) {
            return category
        }
    }

    const submitForm = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        fetch(imgUrl)
            .then(res => res.blob())
            .then(blob => {
                const filemini = new File([blob], "ofertaDiaria.jpg", {
                    type: 'image/jpeg'
                });
                //  console.log('head', formData.getHeaders())
                var formData = new FormData();
                formData.append("hero", filemini);
                formData.append("title", title);
                formData.append("subtitle", subtitle);
                formData.append("tag", tag);
                formData.append("subcategory", subcategory);
                formData.append("type", type);
                formData.append("url", (parseInt(type) === 0 ? tag.tag : subcategory.category));

                // Example POST method implementation:
                async function postData(url = '', data = {}) {
                    // Default options are marked with *
                    const response = await fetch(url, {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    });
                    return response;
                }

                postData(UrlNodeServer.heroSliderDir.heroSlider, formData).then(res => {
                    const respuesta = res.data
                    const status = respuesta.status
                    console.log('respuesta :>> ', respuesta);
                    if (status === 200) {

                    } else {

                    }
                }).catch((error) => {
                    setTagList([])
                }).finally(() => {
                    setIsLoading(false)
                })

            })


    }

    useEffect(() => {
        getSubcategories()
        getTags()
        // eslint-disable-next-line
    }, [])


    return (
        <>
            <Form onSubmit={submitForm}>
                <Row>
                    <Col md="6" className="text-left">
                        <h2>Nueva Oferta para el e-commerce </h2>
                    </Col>
                    <Col md="6" style={{ textAlign: "right" }}>
                        <Button
                            color="danger"
                            onClick={(e) => {
                                e.preventDefault()
                                setIsOpenForm(false)
                            }}
                        >
                            <i className='fa fa-times'></i>
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <Label>Titulo</Label>
                            <Input required type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Label>Descripción</Label>
                        <ReactQuill
                            debug='info'
                            placeholder='Escriba o pegue algo...'
                            theme='snow'
                            value={subtitle}
                            onChange={setSubtitle}
                            modules={{
                                toolbar: ['bold', 'italic', 'underline']
                            }}
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md="4">
                        <FormGroup>
                            <Label>Tipo de oferta</Label>
                            <Input value={type} onChange={e => setType(e.target.value)} type="select">
                                <option value={0}>Etiqueta</option>
                                <option value={1}>Marca</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md="8">
                        <FormGroup>
                            {parseInt(type) === 0 && <Label>Etiqueta</Label>}
                            {parseInt(type) === 1 && <Label>Marca</Label>}
                            <InputSearch
                                id="order_2"
                                itemsList={parseInt(type) === 0 ? tagList : subcategoryList}
                                itemSelected={parseInt(type) === 0 ? tag : subcategory}
                                title={""}
                                placeholderInput={"Buscar..."}
                                getNameFn={parseInt(type) === 0 ? ((tag) => tag.tag) : ((category) => category.category)}
                                setItemSelected={parseInt(type) === 0 ? setTag : setSubcategory}
                                searchFn={parseInt(type) === 0 ? tagSearchFn : categorySearchFn}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <h6 className="heading-small text-muted mb-4">
                        Imagen de Fondo
                    </h6>
                    <div className="pl-lg-4" style={!imgUrl ? { display: "none" } : { display: "block" }}>

                        <Row>
                            <Col md="6" style={{ border: "2px solid black" }}>
                                <Button
                                    color="danger"
                                    style={{ position: "absolute", right: "-20px", top: "-10px", zIndex: "999" }}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setImgUrl(false)
                                    }}
                                >
                                    <i className='fa fa-times'></i>
                                </Button>
                                <img
                                    src={imgUrl ? imgUrl : ""}
                                    style={{ width: "100%" }}
                                    alt="nvaImgMod"
                                />
                            </Col>
                            <Col md="6" className="text-center">
                                <Button
                                    style={{ width: "200px" }}
                                    color="primary"
                                    type="submit"
                                >
                                    Subir Oferta
                                </Button>
                            </Col>
                        </Row>

                    </div>
                    <hr />

                    <Col md="12" style={imgUrl ? { display: "none", textAlign: "center" } : { display: "block", textAlign: "center" }}>
                        <FormGroup>
                            <Input

                                className="form-control-alternative"
                                id="imgNvaAltmod"
                                type="file"
                                accept=".jpg"
                                onChange={e => setImgUrl(URL.createObjectURL(e.target.files[0]))}
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </Form>
        </>
    )
}
export default FormHeroSlider;