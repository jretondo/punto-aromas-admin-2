import React, { useEffect, useState, useContext } from 'react';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row
} from 'reactstrap';
import useSound from 'use-sound';
import beepSfx from '../../../../../../assets/sounds/beep.mp3';
import Scanner from "components/scanner";
import productsSellContext from '../../../../../../context/productsSell';
import isMobile from 'is-mobile';
import ModalSearch from './modalSearch';
import ModalPricesCant from './modalPricesCant';
import ButtonOpenCollapse from 'components/buttonOpen';

const ProductFinder = ({ clienteData, clienteBool }) => {
    const [result, setResult] = useState(null);
    const [prodText, setProdText] = useState("")
    const [cantProd, setCantProd] = useState(1)
    const [camera, setCamera] = useState(false);
    const [prodSearchModal, setProdSearchModal] = useState(false)
    const [modalPrices, setModalPrices] = useState(false)
    const [searchType, setSearchType] = useState(0)

    const { NewProdSell, productsSellList, error } = useContext(productsSellContext)

    const [play] = useSound(beepSfx);

    const findProd = (textFind) => {
        play()
        setModalPrices(true)
        //NewProdSell(textFind, cantProd)
    }

    const onDetected = results => {
        setResult(results);
    };

    const prodSearchToggle = () => {
        setProdSearchModal(!prodSearchModal)
    }

    useEffect(() => {
        play()
        if (result !== null) {
            NewProdSell(prodText, cantProd)
        }
        setCamera(false)
        // eslint-disable-next-line 
    }, [result])

    useEffect(() => {
        if (!prodSearchModal) {
            setTimeout(() => {
                document.getElementById("prodTxtFinder").select()
            }, 600);
        }
    }, [prodSearchModal])

    useEffect(() => {
        document.getElementById("prodTxtFinder").select()
    }, [productsSellList])

    useEffect(() => {
        if (error) {
            document.getElementById("prodTxtFinder").select()
        }
    }, [error])

    return (
        <>
            <Form onSubmit={e => {
                e.preventDefault()
                findProd(prodText)
            }}>

                <Row>
                    <Col md="3">
                        <Label for="cantTxt">Cant.</Label>
                        <FormGroup>
                            <Input type="number" id="cantTxt" value={cantProd} onChange={e => setCantProd(e.target.value)} required />
                        </FormGroup>
                    </Col>
                    <Col md="9" >
                        <Label for="prodTxtFinder">Producto</Label>
                        <InputGroup>
                            {/*
                            <InputGroupAddon addonType="prepend">
                            <ButtonOpenCollapse
                                action={() => setSearchType(0)}
                                tittle={"Nombre"}
                                active={searchType === 0 ? true : false}
                                thin={true}
                            />
                            <ButtonOpenCollapse
                                action={() => setSearchType(1)}
                                tittle={"Código"}
                                active={searchType === 1 ? true : false}
                                thin={true}
                            />
                            <ButtonOpenCollapse
                                action={() => setSearchType(2)}
                                tittle={"Marca"}
                                active={searchType === 2 ? true : false}
                                thin={true}
                            />
                        </InputGroupAddon>
                            */
                            }
                            <Input
                                type="text"
                                id="prodTxtFinder"
                                value={prodText}
                                onChange={e => setProdText(e.target.value)}
                                required
                            />
                            < InputGroupAddon addonType="append">
                                {
                                    isMobile() ?
                                        <Button color="warning" onClick={(e) => {
                                            e.preventDefault();
                                            setCamera(true);
                                        }}><i className="fas fa-camera"></i></Button> : null
                                }
                                <Button className="btn btn-info" onClick={prodSearchToggle} >
                                    <i className="fas fa-search" ></i>
                                </Button>
                                <Button className="btn btn-success" type="submit" >
                                    <i className="fas fa-check" ></i>
                                </Button>
                            </InputGroupAddon>
                        </ InputGroup>
                    </Col>
                </Row>
            </Form>

            <Row>
                <Col style={camera ? { border: "2px solid red" } : { display: "none" }} >
                    <button className="btn btn-danger" style={{ position: "absolute", top: 0, right: 0, zIndex: 100 }} onClick={(e) => {
                        e.preventDefault();
                        setCamera(false);
                    }} >X</button>
                    {camera && <Scanner onDetected={onDetected} />}
                </Col>
            </Row>
            <ModalSearch
                prodSearchModal={prodSearchModal}
                prodSearchToggle={prodSearchToggle}
                setProdText={setProdText}
                findProd={findProd}
            />
            <ModalPricesCant
                text={prodText}
                setProdText={setProdText}
                modal={modalPrices}
                toggle={() => setModalPrices(!modalPrices)}
                cantProd={cantProd}
                setCantProd={setCantProd}
                clienteData={clienteData}
                clienteBool={clienteBool}
                searchType={searchType}
            />
        </>
    )
}

export default ProductFinder